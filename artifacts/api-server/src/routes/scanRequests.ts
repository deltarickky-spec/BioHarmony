import { Router } from "express";
import { db } from "@workspace/db";
import { scanRequestsTable } from "@workspace/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { z } from "zod";
import { buildReportNotificationEmail, buildClientConfirmationEmail, sendEmail } from "../services/email";

const router = Router();

const ScanRequestSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim(),
  phone: z.string().max(50).trim().optional(),
  reportType: z.string().min(1).max(50).trim(),
  language: z.string().min(2).max(10).trim().default("en"),
  fileName: z.string().max(255).trim().optional(),
  whatsapp: z.boolean().optional(),
  plan: z.enum(["basic", "advanced", "premium"]).optional(),
  note: z.string().max(1000).trim().optional(),
  referralSource: z.string().max(100).trim().optional(),
  promoCode: z.string().max(50).trim().optional(),
  discountAmount: z.number().int().min(0).max(9999).optional(),
});

router.get("/scan-requests/public/:id", async (req, res) => {
  const cleaned = (req.params["id"] ?? "").trim().toUpperCase().replace(/^BH-?/, "");
  const numId = parseInt(cleaned, 10);
  if (isNaN(numId) || numId <= 0) {
    res.status(400).json({ error: "Invalid request ID format." });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(eq(scanRequestsTable.id, numId))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Request not found." });
      return;
    }

    const row = rows[0]!;

    if (row.pipelineStage !== "delivered") {
      res.status(403).json({
        error: "Report not yet available. Check back once your report has been delivered.",
        pipelineStage: row.pipelineStage,
      });
      return;
    }

    res.json({
      requestId: `BH-${row.id.toString().padStart(4, "0")}`,
      name: row.name,
      reportType: row.reportType,
      plan: row.plan ?? "basic",
      language: row.language,
      pipelineStage: row.pipelineStage,
      bioharmonyScore: row.bioharmonyScore ?? null,
      scoreBreakdown: row.scoreBreakdown ?? null,
      deliveredEmailSentAt: row.deliveredEmailSentAt ?? null,
      createdAt: row.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to look up public report");
    res.status(500).json({ error: "Could not retrieve your report. Please try again." });
  }
});

router.get("/scan-requests/track", async (req, res) => {
  const rawId = (req.query["id"] as string | undefined) ?? "";
  const email = ((req.query["email"] as string | undefined) ?? "").trim().toLowerCase();

  if (!rawId || !email) {
    res.status(400).json({ error: "Missing id or email parameters" });
    return;
  }

  const cleaned = rawId.trim().toUpperCase().replace(/^BH-?/, "");
  const numId = parseInt(cleaned, 10);
  if (isNaN(numId) || numId <= 0) {
    res.status(400).json({ error: "Invalid request ID format. Use BH-XXXX or just the number." });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(and(eq(scanRequestsTable.id, numId), ilike(scanRequestsTable.email, email)))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({
        error: "Request not found. Please check your Request ID and email — both must match your original submission.",
      });
      return;
    }

    const row = rows[0]!;

    res.json({
      id: row.id,
      requestId: `BH-${row.id.toString().padStart(4, "0")}`,
      name: row.name,
      email: row.email,
      reportType: row.reportType,
      plan: row.plan ?? "basic",
      language: row.language,
      whatsapp: row.whatsapp ?? false,
      fileName: row.fileName ?? null,
      status: row.status,
      pipelineStage: row.pipelineStage,
      paymentStatus: row.paymentStatus,
      deliveredEmailSentAt: row.deliveredEmailSentAt ?? null,
      bioharmonyScore: row.bioharmonyScore ?? null,
      scoreBreakdown: row.scoreBreakdown ?? null,
      createdAt: row.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to look up scan request for tracking");
    res.status(500).json({ error: "Could not retrieve your request. Please try again." });
  }
});

router.post("/scan-requests", async (req, res) => {
  const parsed = ScanRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;

  try {
    const [row] = await db
      .insert(scanRequestsTable)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        reportType: data.reportType,
        language: data.language,
        fileName: data.fileName,
        whatsapp: data.whatsapp ?? false,
        plan: data.plan,
        note: data.note,
        referralSource: data.referralSource,
        promoCode: data.promoCode ?? null,
        discountAmount: data.discountAmount ?? null,
      })
      .returning({ id: scanRequestsTable.id });

    req.log.info({ id: row.id, email: data.email }, "New scan request submitted");

    const emailPayload = buildReportNotificationEmail({
      source: "scan",
      name: data.name,
      email: data.email,
      phone: data.phone,
      reportType: data.reportType,
      language: data.language,
      fileName: data.fileName,
      whatsapp: data.whatsapp,
      note: data.note,
      submittedAt: new Date(),
    });

    const confirmPayload = buildClientConfirmationEmail({
      source: "scan",
      name: data.name,
      email: data.email,
      reportType: data.reportType,
      language: data.language,
      fileName: data.fileName,
      whatsapp: data.whatsapp,
      note: data.note,
      plan: data.plan,
      promoCode: data.promoCode ?? undefined,
      discountAmount: data.discountAmount ?? undefined,
    });

    await Promise.all([
      sendEmail(emailPayload).catch((err: unknown) => {
        req.log.error({ err }, "Admin email notification failed (non-fatal)");
      }),
      sendEmail(confirmPayload).catch((err: unknown) => {
        req.log.error({ err }, "Client confirmation email failed (non-fatal)");
      }),
    ]);

    res.status(201).json({ success: true, id: row.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save scan request");
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

export default router;
