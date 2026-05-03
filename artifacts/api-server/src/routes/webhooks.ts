import { Router } from "express";
import { timingSafeEqual } from "crypto";
import { db } from "@workspace/db";
import { scanRequestsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendDeliveryEmail, sendPractitionerCommissionEmail } from "../services/pipelineScheduler";
import { logger } from "../lib/logger";

const router = Router();

// ── Environment configuration ──────────────────────────────────────────────────
// AI_PROCESSING_MODE:  "mock" (default) | "live" — controls processing + signature enforcement
// HP_AI_SERVER_URL:    Base URL of HP AI server (empty = not connected)
// HP_WEBHOOK_SECRET:   Shared secret; HP must send as x-bioharmony-signature header (live mode only)
const AI_PROCESSING_MODE = process.env["AI_PROCESSING_MODE"] ?? "mock";
const HP_AI_SERVER_URL = process.env["HP_AI_SERVER_URL"] ?? "";

logger.info(
  {
    AI_PROCESSING_MODE,
    HP_AI_SERVER_URL: HP_AI_SERVER_URL || "(not set)",
    HP_WEBHOOK_SECRET: process.env["HP_WEBHOOK_SECRET"] ? "configured" : "(not set)",
  },
  "Webhook config loaded",
);

// ── Signature verification ─────────────────────────────────────────────────────

/**
 * Verifies the x-bioharmony-signature header against HP_WEBHOOK_SECRET.
 * Uses timingSafeEqual to prevent timing-based attacks.
 * Returns true when:
 *   - AI_PROCESSING_MODE is "mock" (verification skipped for safe testing)
 *   - AI_PROCESSING_MODE is "live" AND the header matches the configured secret
 */
function verifyHpSignature(req: Parameters<Parameters<typeof router.post>[1]>[0]): {
  valid: boolean;
  reason?: string;
} {
  if (AI_PROCESSING_MODE !== "live") {
    return { valid: true };
  }

  const secret = process.env["HP_WEBHOOK_SECRET"] ?? "";
  if (!secret) {
    logger.error("HP_WEBHOOK_SECRET is not configured — rejecting live webhook (fail secure)");
    return { valid: false, reason: "HP_WEBHOOK_SECRET not configured on server" };
  }

  const received = (req.headers["x-bioharmony-signature"] as string | undefined) ?? "";
  if (!received) {
    return { valid: false, reason: "Missing x-bioharmony-signature header" };
  }

  // Constant-time comparison prevents timing attacks
  try {
    const secretBuf = Buffer.from(secret, "utf8");
    const receivedBuf = Buffer.from(received, "utf8");
    if (secretBuf.length !== receivedBuf.length) {
      return { valid: false, reason: "Signature mismatch" };
    }
    if (!timingSafeEqual(secretBuf, receivedBuf)) {
      return { valid: false, reason: "Signature mismatch" };
    }
  } catch {
    return { valid: false, reason: "Signature comparison error" };
  }

  return { valid: true };
}

// ── HP payload schema ──────────────────────────────────────────────────────────

const HpReportPayloadSchema = z.object({
  request_id: z.string().min(1),        // e.g. "BH-0001" or "BH-TEST-001"
  status: z.enum(["success", "error"]),
  report_text: z.string().optional(),
  report_pdf_url: z.string().optional(),
  audio_url: z.string().optional(),
  language: z.string().optional(),
  bioharmony_score: z
    .object({ overall: z.number().int().min(0).max(100) })
    .optional(),
  error_message: z.string().optional(),
});

type HpReportPayload = z.infer<typeof HpReportPayloadSchema>;

// ── Shared processing logic ────────────────────────────────────────────────────

interface ProcessResult {
  ok: boolean;
  message: string;
  scanId?: number;
  stage?: string;
  emailSent?: boolean;
  commissionSent?: boolean;
  dryRun?: boolean;
}

async function processHpReportPayload(payload: HpReportPayload): Promise<ProcessResult> {
  const rawId = payload.request_id.toUpperCase().replace(/^BH-?/, "");
  const numericId = parseInt(rawId.replace(/[^0-9]/g, ""), 10);

  // Detect test / non-numeric IDs → dry run
  if (isNaN(numericId)) {
    return {
      ok: true,
      message: "Dry-run: non-numeric request_id — no DB changes made",
      dryRun: true,
    };
  }

  const [row] = await db
    .select()
    .from(scanRequestsTable)
    .where(eq(scanRequestsTable.id, numericId))
    .limit(1);

  if (!row) {
    return { ok: false, message: `No scan request found for id ${numericId}` };
  }

  if (payload.status === "error") {
    const errorMsg = payload.error_message ?? "HP processing failed";
    await db
      .update(scanRequestsTable)
      .set({ pipelineError: errorMsg.slice(0, 500) })
      .where(eq(scanRequestsTable.id, numericId));
    logger.warn({ scanId: numericId, errorMsg }, "[HP] Report generation failed — pipeline error set");
    return { ok: true, message: "Pipeline error recorded", scanId: numericId, stage: "error_logged" };
  }

  // status === "success"
  const updates: Partial<typeof scanRequestsTable.$inferInsert> = {
    pipelineStage: "delivered",
    stageEnteredAt: new Date(),
    status: "delivered",
    pipelineError: null,
  };

  if (payload.bioharmony_score?.overall !== undefined) {
    updates.bioharmonyScore = payload.bioharmony_score.overall;
  }

  await db
    .update(scanRequestsTable)
    .set(updates)
    .where(eq(scanRequestsTable.id, numericId));

  logger.info({ scanId: numericId }, "[HP] Scan advanced to delivered");

  let emailSent = false;
  let commissionSent = false;

  if (!row.deliveredEmailSentAt &&
      (row.paymentStatus === "paid" || row.paymentStatus === "waived")) {
    await sendDeliveryEmail(
      row.id, row.name, row.email, row.plan,
      row.whatsapp ?? false, row.reportType,
      row.promoCode, row.discountAmount,
    );
    emailSent = true;

    if (row.practitionerCode) {
      await sendPractitionerCommissionEmail(
        row.id, row.practitionerCode, row.reportType, row.plan,
      );
      commissionSent = true;
    }
  }

  return {
    ok: true,
    message: "Report delivered successfully",
    scanId: numericId,
    stage: "delivered",
    emailSent,
    commissionSent,
  };
}

// ── POST /webhooks/hp-report-generated ────────────────────────────────────────
// Real HP Sage/Hermes callback — acknowledge immediately, process synchronously.
// Replace body with async queue dispatch when processing time grows.

router.post("/webhooks/hp-report-generated", async (req, res) => {
  // ── Step 1: Signature verification (live mode enforces, mock mode skips) ──
  const sig = verifyHpSignature(req);
  if (!sig.valid) {
    req.log.warn(
      { reason: sig.reason, AI_PROCESSING_MODE },
      "[WEBHOOK] hp-report-generated rejected — invalid signature",
    );
    res.status(401).json({ received: false, error: "Unauthorized", reason: sig.reason });
    return;
  }

  // ── Step 2: Payload validation ─────────────────────────────────────────────
  const parsed = HpReportPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.flatten() }, "[WEBHOOK] hp-report-generated: invalid payload");
    res.status(400).json({ received: false, error: "Invalid payload", details: parsed.error.flatten() });
    return;
  }

  const payload = parsed.data;
  req.log.info({ requestId: payload.request_id, status: payload.status }, "[WEBHOOK] hp-report-generated received");

  // ── Step 3: Mode gate — mock mode logs only, live mode processes ───────────
  if (AI_PROCESSING_MODE !== "live") {
    req.log.info(
      { AI_PROCESSING_MODE },
      "[WEBHOOK] hp-report-generated — mock mode, payload logged but not processed",
    );
    res.json({ received: true, event: "hp-report-generated", note: "mock mode — payload logged but not processed" });
    return;
  }

  // ── Step 4: Process payload ────────────────────────────────────────────────
  try {
    const result = await processHpReportPayload(payload);
    req.log.info({ result }, "[WEBHOOK] hp-report-generated processed");
    res.json({ received: true, event: "hp-report-generated", ...result });
  } catch (err) {
    req.log.error({ err }, "[WEBHOOK] hp-report-generated processing failed");
    // Always return 200 to prevent HP from retrying indefinitely on server errors
    res.json({ received: true, event: "hp-report-generated", ok: false, message: "Internal error — logged" });
  }
});

// ── POST /test/hp-webhook ──────────────────────────────────────────────────────
// Test route: simulates an HP callback bypassing the AI_PROCESSING_MODE gate.
// Protected by admin auth. Accepts an optional body; falls back to the standard
// test payload if none provided.

function checkAdminAuth(req: Parameters<Parameters<typeof router.post>[1]>[0]): boolean {
  const adminPassword = process.env["ADMIN_PASSWORD"] ?? "bioharmony2025";
  const auth = req.headers["authorization"] ?? "";
  return auth === `Bearer ${adminPassword}`;
}

const TEST_PAYLOAD_DEFAULT: HpReportPayload = {
  request_id: "BH-TEST-001",
  status: "success",
  report_text: "This is a test BioHarmony report from HP.",
  report_pdf_url: "",
  audio_url: "",
  language: "English",
  bioharmony_score: { overall: 72 },
};

router.post("/test/hp-webhook", async (req, res) => {
  if (!checkAdminAuth(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rawBody = Object.keys(req.body ?? {}).length > 0 ? req.body : TEST_PAYLOAD_DEFAULT;
  const parsed = HpReportPayloadSchema.safeParse(rawBody);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", details: parsed.error.flatten() });
    return;
  }

  const payload = parsed.data;
  req.log.info({ payload }, "[TEST] hp-webhook simulation triggered");

  try {
    const result = await processHpReportPayload(payload);
    req.log.info({ result }, "[TEST] hp-webhook simulation complete");
    res.json({
      simulation: true,
      payload,
      result,
      env: {
        AI_PROCESSING_MODE,
        HP_AI_SERVER_URL: HP_AI_SERVER_URL || "(not set)",
      },
    });
  } catch (err) {
    req.log.error({ err }, "[TEST] hp-webhook simulation failed");
    res.status(500).json({ simulation: true, error: "Internal error", details: String(err) });
  }
});

// ── Existing placeholder webhooks ──────────────────────────────────────────────

router.post("/webhooks/payment-success", (req, res) => {
  req.log.info({ body: req.body }, "[WEBHOOK] payment-success received");
  res.json({ received: true, event: "payment-success", status: "queued" });
});

router.post("/webhooks/report-generated", (req, res) => {
  req.log.info({ body: req.body }, "[WEBHOOK] report-generated received");
  res.json({ received: true, event: "report-generated", status: "queued" });
});

router.post("/webhooks/audio-ready", (req, res) => {
  req.log.info({ body: req.body }, "[WEBHOOK] audio-ready received");
  res.json({ received: true, event: "audio-ready", status: "queued" });
});

router.post("/webhooks/delivery-complete", (req, res) => {
  req.log.info({ body: req.body }, "[WEBHOOK] delivery-complete received");
  res.json({ received: true, event: "delivery-complete", status: "queued" });
});

router.post("/webhooks/sage-hermes-status", (req, res) => {
  req.log.info({ body: req.body }, "[WEBHOOK] sage-hermes-status received");
  res.json({ received: true, event: "sage-hermes-status", status: "queued" });
});

export default router;
