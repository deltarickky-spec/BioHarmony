/**
 * BioHarmony AI Pipeline Scheduler
 *
 * Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
 *
 * This service polls the database every 15 seconds and automatically advances
 * scan requests through the pipeline stages based on elapsed time per stage.
 *
 * When real AI processing is integrated:
 *   - Replace the tick() interval with webhook handlers from Sage/Hermes.
 *   - Each AI stage completion should call: advanceStage(requestId, nextStage)
 *   - Remove STAGE_DURATIONS_SECONDS timing logic entirely.
 *   - Keep the pause/resume/error controls — they remain useful in production.
 *   - Keep the delivered email notification — it fires after the real AI delivers.
 */

import { db } from "@workspace/db";
import { scanRequestsTable, practitionersTable } from "@workspace/db/schema";
import { and, eq, inArray, ilike, isNull, lt } from "drizzle-orm";
import { logger } from "../lib/logger";
import { getPlanPrice, planHasAudio } from "../pricing";
import {
  buildDeliveredEmail,
  buildPaymentReminderEmail,
  buildPractitionerCommissionEmail,
  buildProcessingStartedEmail,
  buildTestimonialRequestEmail,
  sendEmail,
} from "./email";
import { generateBioharmonyScore, generateReportNarrative } from "./ollama";

type PipelineStage =
  | "queued"
  | "extracting"
  | "interpreting"
  | "generating"
  | "quality_check"
  | "pdf_ready"
  | "audio_ready"
  | "delivered";

/**
 * Stage durations in seconds before auto-advancing to the next stage.
 * Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
 * Real durations will be determined by actual AI processing time per stage.
 */
const STAGE_DURATIONS_SECONDS: Record<PipelineStage, number> = {
  queued: 30,          // time in queue before data extraction begins
  extracting: 60,      // data extraction from scan file / voice sample
  interpreting: 90,    // AI interpretation of bio-frequency data
  generating: 90,      // narrative report generation
  quality_check: 60,   // BioHarmony quality review pass
  pdf_ready: 60,       // PDF compilation
  audio_ready: 60,     // audio narration (Premium only)
  delivered: 0,        // terminal — no further progression
};

/**
 * Determine the next pipeline stage.
 * Basic/Advanced: skip audio_ready → go straight to delivered after pdf_ready.
 * Premium: pdf_ready → audio_ready → delivered.
 *
 * Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
 */
function getNextStage(current: PipelineStage, plan: string | null): PipelineStage | null {
  switch (current) {
    case "queued":        return "extracting";
    case "extracting":    return "interpreting";
    case "interpreting":  return "generating";
    case "generating":    return "quality_check";
    case "quality_check": return "pdf_ready";
    case "pdf_ready":
      return planHasAudio(plan) ? "audio_ready" : "delivered";
    case "audio_ready":   return "delivered";
    case "delivered":     return null;
    default:              return null;
  }
}

// ── Global pause state ─────────────────────────────────────────────────────────

let _globalPaused = false;

export function isGlobalPaused(): boolean {
  return _globalPaused;
}

export function pauseGlobal(): void {
  _globalPaused = true;
  logger.info("BioHarmony pipeline automation globally paused");
}

export function resumeGlobal(): void {
  _globalPaused = false;
  logger.info("BioHarmony pipeline automation globally resumed");
}

// ── Scheduler tick ─────────────────────────────────────────────────────────────

/**
 * Single scheduler tick.
 * Queries all eligible requests and advances any that have exceeded their stage duration.
 * Sends "Report Is Ready" email when a request first reaches delivered.
 *
 * Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
 */
async function tick(): Promise<void> {
  if (_globalPaused) return;

  const now = new Date();

  try {
    // Select candidates: payment confirmed, per-request not paused, no active error
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(
        and(
          inArray(scanRequestsTable.paymentStatus, ["paid", "waived"]),
          eq(scanRequestsTable.pipelinePaused, false),
          isNull(scanRequestsTable.pipelineError),
        ),
      );

    const eligible = rows.filter((r) => r.pipelineStage !== "delivered");
    if (eligible.length === 0) return;

    for (const row of eligible) {
      const stage = row.pipelineStage as PipelineStage;
      const duration = STAGE_DURATIONS_SECONDS[stage] ?? 0;

      if (duration === 0) continue;

      // If stageEnteredAt is missing, initialise it so the timer starts
      if (!row.stageEnteredAt) {
        await db
          .update(scanRequestsTable)
          .set({ stageEnteredAt: now })
          .where(eq(scanRequestsTable.id, row.id));
        logger.info({ id: row.id, stage }, "Pipeline timer initialised for request");
        continue;
      }

      const elapsedSeconds = (now.getTime() - row.stageEnteredAt.getTime()) / 1_000;
      if (elapsedSeconds < duration) continue;

      const nextStage = getNextStage(stage, row.plan);
      if (!nextStage) continue;

      logger.info(
        { id: row.id, from: stage, to: nextStage, elapsedSeconds: Math.round(elapsedSeconds) },
        // Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
        "Auto-advancing pipeline stage",
      );

      // Generate BioHarmony score via Ollama when entering quality_check (after generating stage)
      let scoreUpdate: { bioharmonyScore?: number; scoreBreakdown?: string; reportNarrative?: string } = {};
      if (nextStage === "quality_check" && row.bioharmonyScore === null) {
        try {
          const { score, breakdown } = await generateBioharmonyScore(
            row.id,
            row.reportType,
            row.plan,
          );
          scoreUpdate = {
            bioharmonyScore: score,
            scoreBreakdown: breakdown,
          };
          logger.info({ id: row.id, score }, "BioHarmony Intelligence Score generated via Ollama AI");
        } catch (err) {
          logger.error({ err, id: row.id }, "Ollama AI score generation failed — using fallback");
          // Fallback: deterministic score so pipeline can still advance
          const seed = row.id;
          scoreUpdate = {
            bioharmonyScore: 55 + ((seed * 7919) % 34),
            scoreBreakdown: JSON.stringify([
              { label: "Stress Load",       value: 50 + ((seed * 6571) % 40) },
              { label: "Energy Balance",    value: 55 + ((seed * 9973) % 35) },
              { label: "System Alignment",  value: 50 + ((seed * 8221) % 40) },
              { label: "Recovery Capacity", value: 52 + ((seed * 7331) % 38) },
            ]),
          };
        }
      }

      // Generate report narrative via Ollama when entering pdf_ready
      if (nextStage === "pdf_ready" && row.bioharmonyScore !== null && !row.reportNarrative) {
        try {
          const narrative = await generateReportNarrative(
            row.id,
            row.reportType,
            row.plan,
            row.bioharmonyScore,
            row.scoreBreakdown ?? "[]",
          );
          scoreUpdate.reportNarrative = narrative;
          logger.info({ id: row.id }, "Report narrative generated via Ollama AI");
        } catch (err) {
          logger.error({ err, id: row.id }, "Ollama narrative generation failed — continuing without narrative");
        }
      }

      // Advance the stage in DB
      await db
        .update(scanRequestsTable)
        .set({
          pipelineStage: nextStage,
          stageEnteredAt: now,
          ...(nextStage === "delivered" ? { status: "delivered" } : {}),
          ...scoreUpdate,
        })
        .where(eq(scanRequestsTable.id, row.id));

      // Notify client that AI processing has started (first active stage)
      if (nextStage === "extracting") {
        const requestId = `BH-${row.id.toString().padStart(4, "0")}`;
        sendEmail(buildProcessingStartedEmail({
          name: row.name,
          email: row.email,
          requestId,
          reportType: row.reportType,
          plan: row.plan ?? "basic",
        })).catch((err) => {
          logger.error({ err, id: row.id }, "Failed to send processing-started email");
        });
      }

      // Send "Your report is ready" email when advancing to delivered
      // Only if email hasn't been sent yet (deliveredEmailSentAt is null)
      if (nextStage === "delivered" && !row.deliveredEmailSentAt) {
        await sendDeliveryEmail(row.id, row.name, row.email, row.plan, row.whatsapp ?? false, row.reportType, row.promoCode, row.discountAmount);
        // Notify the referring practitioner (if any) of their earned commission
        if (row.practitionerCode) {
          await sendPractitionerCommissionEmail(row.id, row.practitionerCode, row.reportType, row.plan);
        }
        // Send testimonial / feedback request alongside the delivery email
        const requestId = `BH-${row.id.toString().padStart(4, "0")}`;
        sendEmail(buildTestimonialRequestEmail({
          name: row.name,
          email: row.email,
          requestId,
          reportType: row.reportType,
        })).catch((err) => {
          logger.error({ err, id: row.id }, "Failed to send testimonial-request email");
        });
      }
    }
  } catch (err) {
    logger.error({ err }, "Pipeline scheduler tick failed");
  }
}

// ── Payment reminder ───────────────────────────────────────────────────────────

const SITE_URL_SCHEDULER = process.env["SITE_URL"] ?? "https://bioharmonysolutions.ca";
const REMINDER_DELAY_MS = 24 * 60 * 60 * 1_000; // 24 hours

/**
 * Send the "Complete Your BioHarmony Report" payment reminder email.
 * Marks paymentReminderSentAt so the reminder is only sent once per request
 * (unless manually reset via the admin resend endpoint).
 */
export async function sendPaymentReminderEmail(
  id: number,
  name: string,
  email: string,
  whatsapp: boolean,
  promoCode?: string | null,
  discountAmount?: number | null,
  plan?: string | null,
): Promise<void> {
  const requestId = `BH-${id.toString().padStart(4, "0")}`;
  const paymentUrl = `${SITE_URL_SCHEDULER}/upload?resume=${encodeURIComponent(requestId)}`;
  try {
    const payload = buildPaymentReminderEmail({
      name, email, requestId, paymentUrl, whatsapp,
      promoCode: promoCode ?? undefined,
      discountAmount: discountAmount ?? undefined,
      plan: plan ?? undefined,
    });
    await sendEmail(payload);
    await db
      .update(scanRequestsTable)
      .set({ paymentReminderSentAt: new Date() })
      .where(eq(scanRequestsTable.id, id));
    logger.info({ id, email, requestId }, "Payment reminder sent successfully");

    // WhatsApp placeholder — log the message that would be sent via WhatsApp Business API
    if (whatsapp) {
      logger.info(
        { id, requestId },
        "[WhatsApp placeholder] Payment reminder — would send via WhatsApp Business API: " +
        `"Hi ${name.split(" ")[0]}, your BioHarmony report is ready to begin. ` +
        `Complete your payment here: ${paymentUrl} (Ref: ${requestId})"`,
      );
    }
  } catch (err) {
    logger.error({ err, id, email }, "Failed to send payment reminder — admin can use Resend button");
  }
}

/**
 * Scan for pending requests older than 24 hours that haven't received a reminder yet,
 * and send them a payment reminder email.
 * Runs hourly via the scheduler.
 */
async function paymentReminderTick(): Promise<void> {
  const threshold = new Date(Date.now() - REMINDER_DELAY_MS);
  try {
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(
        and(
          eq(scanRequestsTable.paymentStatus, "pending"),
          lt(scanRequestsTable.createdAt, threshold),
          isNull(scanRequestsTable.paymentReminderSentAt),
        ),
      );

    if (rows.length === 0) return;
    logger.info({ count: rows.length }, "Payment reminder tick: found overdue pending requests");

    for (const row of rows) {
      await sendPaymentReminderEmail(
        row.id, row.name, row.email, row.whatsapp ?? false,
        row.promoCode, row.discountAmount, row.plan,
      );
    }
  } catch (err) {
    logger.error({ err }, "Payment reminder tick failed");
  }
}

// ── Practitioner commission email ──────────────────────────────────────────────

/**
 * When a referred client's report is delivered, notify the referring practitioner
 * with their commission breakdown and updated lifetime stats.
 * Only fires if the scan has a practitionerCode and that practitioner is active.
 */
export async function sendPractitionerCommissionEmail(
  scanId: number,
  practitionerCode: string,
  reportType: string,
  plan: string | null,
): Promise<void> {
  const code = practitionerCode.toUpperCase();
  const siteUrl = process.env["SITE_URL"] ?? "https://bioharmonysolutions.ca";

  try {
    const [practitioner] = await db
      .select()
      .from(practitionersTable)
      .where(eq(practitionersTable.referralCode, code))
      .limit(1);

    if (!practitioner || !practitioner.active) return;

    // Compute lifetime stats from all delivered scan requests with this code
    const allScans = await db
      .select()
      .from(scanRequestsTable)
      .where(ilike(scanRequestsTable.practitionerCode, code));

    const totalReferrals = allScans.length;
    const delivered = allScans.filter((s) => s.pipelineStage === "delivered");
    const completedReports = delivered.length;
    const revenueGenerated = delivered.reduce(
      (sum, s) => sum + getPlanPrice(s.plan),
      0,
    );
    const totalEarned = Math.floor((revenueGenerated * practitioner.commissionRate) / 100);
    const pendingPayout = Math.max(0, totalEarned - practitioner.totalPaid);

    const reportValue = getPlanPrice(plan);
    const commissionEarned = Math.floor((reportValue * practitioner.commissionRate) / 100);

    const payload = buildPractitionerCommissionEmail({
      practitionerName: practitioner.name,
      practitionerEmail: practitioner.email,
      referralCode: practitioner.referralCode,
      commissionRate: practitioner.commissionRate,
      reportType,
      plan: plan ?? "comprehensive",
      reportValue,
      commissionEarned,
      totalEarned,
      totalReferrals,
      completedReports,
      pendingPayout,
      dashboardUrl: `${siteUrl}/practitioner-portal`,
    });

    await sendEmail(payload);
    logger.info(
      { scanId, practitionerCode: code, commissionEarned, totalEarned },
      "Practitioner commission email sent",
    );
  } catch (err) {
    logger.error({ err, scanId, practitionerCode: code }, "Failed to send practitioner commission email");
  }
}

// ── Delivery email ─────────────────────────────────────────────────────────────

/**
 * Send the "Your BioHarmony Report Is Ready" email and mark it as sent.
 * If sending fails, logs the error — admin can trigger a resend manually.
 */
export async function sendDeliveryEmail(
  id: number,
  name: string,
  email: string,
  plan: string | null,
  whatsapp: boolean,
  reportType: string,
  promoCode?: string | null,
  discountAmount?: number | null,
): Promise<void> {
  const requestId = `BH-${id.toString().padStart(4, "0")}`;
  try {
    const payload = buildDeliveredEmail({
      name,
      email,
      requestId,
      plan: plan ?? "comprehensive",
      whatsapp,
      reportType,
      promoCode: promoCode ?? undefined,
      discountAmount: discountAmount ?? undefined,
    });
    await sendEmail(payload);
    // Mark email as sent only after confirmed delivery attempt
    await db
      .update(scanRequestsTable)
      .set({ deliveredEmailSentAt: new Date() })
      .where(eq(scanRequestsTable.id, id));
    logger.info({ id, email, requestId }, "Delivery email sent successfully");
  } catch (err) {
    logger.error({ err, id, email }, "Failed to send delivery email — admin can use Resend button");
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────────

let _schedulerInterval: ReturnType<typeof setInterval> | null = null;

let _reminderInterval: ReturnType<typeof setInterval> | null = null;

export function startPipelineScheduler(): void {
  if (_schedulerInterval) return;
  // Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
  logger.info("BioHarmony AI pipeline scheduler started (mock mode — replace with Sage/Hermes webhook later)");
  tick().catch(() => {});
  _schedulerInterval = setInterval(() => {
    tick().catch(() => {});
  }, 15_000);

  // Payment reminder scheduler — runs every hour
  if (!_reminderInterval) {
    logger.info("Payment reminder scheduler started (checks every hour for 24h+ pending requests)");
    paymentReminderTick().catch(() => {}); // run immediately on startup too
    _reminderInterval = setInterval(() => {
      paymentReminderTick().catch(() => {});
    }, 60 * 60 * 1_000);
  }
}

export function stopPipelineScheduler(): void {
  if (_schedulerInterval) {
    clearInterval(_schedulerInterval);
    _schedulerInterval = null;
  }
  if (_reminderInterval) {
    clearInterval(_reminderInterval);
    _reminderInterval = null;
  }
  logger.info("Pipeline + reminder schedulers stopped");
}
