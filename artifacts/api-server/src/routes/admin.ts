import { Router } from "express";
import { db } from "@workspace/db";
import { reportRequestsTable, scanRequestsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  isGlobalPaused,
  pauseGlobal,
  resumeGlobal,
  sendDeliveryEmail,
  sendPaymentReminderEmail,
  sendPractitionerCommissionEmail,
} from "../services/pipelineScheduler";
import { buildPaymentReceivedEmail, sendEmail } from "../services/email";

const router = Router();

const VALID_STATUSES = ["new", "in_review", "in_progress", "completed", "delivered"] as const;
const PIPELINE_STAGES = [
  "queued",
  "extracting",
  "interpreting",
  "generating",
  "quality_check",
  "pdf_ready",
  "audio_ready",
  "delivered",
] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed", "waived"] as const;

const AdminUpdateSchema = z
  .object({
    status: z.enum(VALID_STATUSES).optional(),
    pipelineStage: z.enum(PIPELINE_STAGES).optional(),
    paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
    pipelinePaused: z.boolean().optional(),
    pipelineError: z.string().max(500).nullable().optional(),
    adminNote: z.string().max(2000).nullable().optional(),
    starred: z.boolean().optional(),
    flagged: z.boolean().optional(),
  })
  .refine(
    (d) =>
      d.status !== undefined ||
      d.pipelineStage !== undefined ||
      d.paymentStatus !== undefined ||
      d.pipelinePaused !== undefined ||
      d.pipelineError !== undefined ||
      d.adminNote !== undefined ||
      d.starred !== undefined ||
      d.flagged !== undefined,
    { message: "At least one field is required" },
  );

function checkAuth(
  req: Parameters<Parameters<typeof router.get>[1]>[0],
  res: Parameters<Parameters<typeof router.get>[1]>[1],
): boolean {
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "bioharmony2025";
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// ── Data endpoints ─────────────────────────────────────────────────────────────

router.get("/admin/leads", async (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    const [reportRequests, scanRequests] = await Promise.all([
      db.select().from(reportRequestsTable).orderBy(desc(reportRequestsTable.createdAt)),
      db.select().from(scanRequestsTable).orderBy(desc(scanRequestsTable.createdAt)),
    ]);
    res.json({ reportRequests, scanRequests });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch leads");
    res.status(500).json({ error: "Could not retrieve leads" });
  }
});

router.patch("/admin/requests/:source/:id", async (req, res) => {
  if (!checkAuth(req, res)) return;

  const source = req.params["source"];
  const id = Number(req.params["id"]);

  if (!["report", "scan"].includes(source) || isNaN(id)) {
    res.status(400).json({ error: "Invalid source or id" });
    return;
  }

  const parsed = AdminUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid update payload", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const now = new Date();

  try {
    if (source === "report") {
      const updateSet = {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.adminNote !== undefined ? { adminNote: data.adminNote } : {}),
      };
      if (Object.keys(updateSet).length > 0) {
        await db.update(reportRequestsTable).set(updateSet).where(eq(reportRequestsTable.id, id));
      }
    } else {
      // Scan requests — full pipeline control
      const updateSet = {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.pipelineStage !== undefined
          ? {
              pipelineStage: data.pipelineStage,
              // Reset stage timer on manual override so scheduler uses fresh timing
              stageEnteredAt: now,
            }
          : {}),
        ...(data.paymentStatus !== undefined
          ? {
              paymentStatus: data.paymentStatus,
              // Start pipeline timer the moment payment is confirmed
              ...(["paid", "waived"].includes(data.paymentStatus)
                ? { stageEnteredAt: now }
                : {}),
            }
          : {}),
        ...(data.pipelinePaused !== undefined ? { pipelinePaused: data.pipelinePaused } : {}),
        ...(data.pipelineError !== undefined ? { pipelineError: data.pipelineError } : {}),
        ...(data.adminNote !== undefined ? { adminNote: data.adminNote } : {}),
      };

      if (Object.keys(updateSet).length > 0) {
        await db.update(scanRequestsTable).set(updateSet).where(eq(scanRequestsTable.id, id));
      }

      // If payment just confirmed by admin, send payment-received email to client
      if (data.paymentStatus === "paid" || data.paymentStatus === "waived") {
        const payRows = await db
          .select()
          .from(scanRequestsTable)
          .where(eq(scanRequestsTable.id, id))
          .limit(1);
        const payRow = payRows[0];
        if (payRow) {
          const planPrices: Record<string, number> = { basic: 55, advanced: 99, premium: 149 };
          const basePrice = planPrices[payRow.plan ?? "basic"] ?? 55;
          const discount = payRow.discountAmount ?? 0;
          const amount = data.paymentStatus === "waived" ? 0 : Math.max(0, basePrice - discount);
          sendEmail(buildPaymentReceivedEmail({
            name: payRow.name,
            email: payRow.email,
            requestId: `BH-${id.toString().padStart(4, "0")}`,
            plan: payRow.plan ?? "basic",
            reportType: payRow.reportType,
            amount,
          })).catch((err) => {
            req.log.error({ err, id }, "Failed to send payment-received email");
          });
        }
      }

      // If manually advancing to delivered, send delivery + commission emails
      if (data.pipelineStage === "delivered") {
        const rows = await db
          .select()
          .from(scanRequestsTable)
          .where(eq(scanRequestsTable.id, id))
          .limit(1);
        const row = rows[0];
        if (row && !row.deliveredEmailSentAt &&
            (row.paymentStatus === "paid" || row.paymentStatus === "waived")) {
          await sendDeliveryEmail(id, row.name, row.email, row.plan, row.whatsapp ?? false, row.reportType, row.promoCode, row.discountAmount);
          if (row.practitionerCode) {
            await sendPractitionerCommissionEmail(id, row.practitionerCode, row.reportType, row.plan);
          }
        }
      }
    }

    req.log.info({ source, id, ...data }, "Request updated by admin");
    res.json({ success: true, id, ...data });
  } catch (err) {
    req.log.error({ err }, "Failed to update request");
    res.status(500).json({ error: "Could not update request" });
  }
});

// ── Payment reminder resend ────────────────────────────────────────────────────

/**
 * Manually trigger (or resend) a payment reminder for a specific pending scan request.
 * Resets paymentReminderSentAt so the send timestamp is updated on success.
 */
router.post("/admin/requests/scan/:id/resend-payment-reminder", async (req, res) => {
  if (!checkAuth(req, res)) return;

  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(eq(scanRequestsTable.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    if (row.paymentStatus !== "pending") {
      res.status(400).json({ error: "Request is not awaiting payment" });
      return;
    }

    // Reset the sent flag so the timestamp updates on success
    await db
      .update(scanRequestsTable)
      .set({ paymentReminderSentAt: null })
      .where(eq(scanRequestsTable.id, id));

    await sendPaymentReminderEmail(id, row.name, row.email, row.whatsapp ?? false, row.promoCode, row.discountAmount, row.plan);

    req.log.info({ id, email: row.email }, "Payment reminder resent by admin");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to resend payment reminder");
    res.status(500).json({ error: "Could not resend payment reminder" });
  }
});

// ── Delivery email resend ──────────────────────────────────────────────────────

/**
 * Resend the "Your report is ready" delivery email for a specific scan request.
 * Resets deliveredEmailSentAt so it is updated to the new send time on success.
 */
router.post("/admin/requests/scan/:id/resend-delivery-email", async (req, res) => {
  if (!checkAuth(req, res)) return;

  const id = Number(req.params["id"]);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(eq(scanRequestsTable.id, id))
      .limit(1);

    const row = rows[0];
    if (!row) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    if (row.pipelineStage !== "delivered") {
      res.status(400).json({ error: "Request is not in delivered state" });
      return;
    }

    // Clear the sent flag so sendDeliveryEmail will update it on success
    await db
      .update(scanRequestsTable)
      .set({ deliveredEmailSentAt: null })
      .where(eq(scanRequestsTable.id, id));

    await sendDeliveryEmail(id, row.name, row.email, row.plan, row.whatsapp ?? false, row.reportType, row.promoCode, row.discountAmount);

    req.log.info({ id, email: row.email }, "Delivery email resent by admin");
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to resend delivery email");
    res.status(500).json({ error: "Could not resend email" });
  }
});

// ── Pipeline automation control ────────────────────────────────────────────────

router.get("/admin/pipeline/status", (req, res) => {
  if (!checkAuth(req, res)) return;
  res.json({ globalPaused: isGlobalPaused() });
});

/**
 * Globally pause the mock pipeline scheduler.
 * Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
 */
router.post("/admin/pipeline/global-pause", (req, res) => {
  if (!checkAuth(req, res)) return;
  pauseGlobal();
  req.log.info("Global pipeline automation paused by admin");
  res.json({ success: true, globalPaused: true });
});

/**
 * Globally resume the mock pipeline scheduler.
 * Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
 */
router.post("/admin/pipeline/global-resume", (req, res) => {
  if (!checkAuth(req, res)) return;
  resumeGlobal();
  req.log.info("Global pipeline automation resumed by admin");
  res.json({ success: true, globalPaused: false });
});

export { PIPELINE_STAGES, PAYMENT_STATUSES, VALID_STATUSES };
export default router;
