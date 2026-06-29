import { Router } from "express";
import { db } from "@workspace/db";
import { scanRequestsTable } from "@workspace/db/schema";
import { eq, and, ilike } from "drizzle-orm";
import { z } from "zod";
import { buildReportNotificationEmail, buildClientConfirmationEmail, buildReferralRewardEmail, sendEmail } from "../services/email";
import { inferTags } from "../services/tagInference";
import { ALL_PLAN_IDS } from "../pricing";
import { createClientId, legacyNumericId, normalizeClientId } from "../lib/clientId";

const router = Router();

const ScanRequestSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim(),
  phone: z.string().max(50).trim().optional(),
  reportType: z.string().min(1).max(50).trim(),
  language: z.string().min(2).max(10).trim().default("en"),
  fileName: z.string().max(255).trim().optional(),
  whatsapp: z.boolean().optional(),
  plan: z.string().max(50).refine((v) => ALL_PLAN_IDS.includes(v) || ["basic", "advanced", "premium"].includes(v), { message: "Invalid plan" }).optional(),
  note: z.string().max(1000).trim().optional(),
  referralSource: z.string().max(100).trim().optional(),
  referrerEmail: z.string().email().max(255).trim().optional(),
  practitionerCode: z.string().max(50).trim().toUpperCase().optional(),
  promoCode: z.string().max(50).trim().optional(),
  discountAmount: z.number().int().min(0).max(9999).optional(),
});

router.get("/scan-requests/public/:id", async (req, res) => {
  const clientId = normalizeClientId(req.params["id"] ?? "");
  if (!clientId) {
    res.status(400).json({ error: "Invalid request ID format." });
    return;
  }

  try {
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(eq(scanRequestsTable.clientId, clientId))
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
      requestId: row.clientId,
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

  const clientId = normalizeClientId(rawId);
  const legacyId = legacyNumericId(rawId);
  if (!clientId && !legacyId) {
    res.status(400).json({ error: "Invalid BioHarmony Client ID format." });
    return;
  }

  try {
    let rows = await db
      .select()
      .from(scanRequestsTable)
      .where(and(
        clientId
          ? eq(scanRequestsTable.clientId, clientId)
          : eq(scanRequestsTable.id, legacyId!),
        ilike(scanRequestsTable.email, email),
      ))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({
        error: "Request not found. Please check your Request ID and email — both must match your original submission.",
      });
      return;
    }

    const row = rows[0]!;
    // A verified legacy lookup is upgraded in place to a random Client ID.
    if (!row.clientId) {
      const newClientId = createClientId();
      await db.update(scanRequestsTable)
        .set({ clientId: newClientId })
        .where(eq(scanRequestsTable.id, row.id));
      row.clientId = newClientId;
    }

    res.json({
      id: row.id,
      requestId: row.clientId,
      // The tracking UI already knows the email; return only masked contact data.
      name: "BioHarmony Client",
      email: row.email.replace(/^(.{1,2}).*(@.*)$/, "$1••••$2"),
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
      tags: row.tags ?? [],
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
    const clientId = createClientId();
    const [row] = await db
      .insert(scanRequestsTable)
      .values({
        clientId,
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
        referrerEmail: data.referrerEmail ?? null,
        practitionerCode: data.practitionerCode ?? null,
        promoCode: data.promoCode ?? null,
        discountAmount: data.discountAmount ?? null,
        tags: inferTags(data.note, data.reportType),
      })
      .returning({ id: scanRequestsTable.id, clientId: scanRequestsTable.clientId });

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
      requestId: clientId,
    });

    const emailPromises: Promise<void>[] = [
      sendEmail(emailPayload).catch((err: unknown) => {
        req.log.error({ err }, "Admin email notification failed (non-fatal)");
      }),
      sendEmail(confirmPayload).catch((err: unknown) => {
        req.log.error({ err }, "Client confirmation email failed (non-fatal)");
      }),
    ];

    // Referral reward — send WELLNESS20 to the referrer if an email was provided
    if (data.referrerEmail) {
      const rewardPayload = buildReferralRewardEmail({
        referrerEmail: data.referrerEmail,
        referredName: data.name,
        rewardCode: "WELLNESS20",
        rewardLabel: "20% off your next report",
      });
      emailPromises.push(
        sendEmail(rewardPayload).catch((err: unknown) => {
          req.log.error({ err }, "Referral reward email failed (non-fatal)");
        }),
      );
    }

    await Promise.all(emailPromises);

    res.status(201).json({ success: true, id: row.id, clientId: row.clientId });
  } catch (err) {
    req.log.error({ err }, "Failed to save scan request");
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

export default router;
