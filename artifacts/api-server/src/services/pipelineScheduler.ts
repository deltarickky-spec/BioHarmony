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
import { scanRequestsTable } from "@workspace/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { logger } from "../lib/logger";
import { buildDeliveredEmail, sendEmail } from "./email";

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
      return (plan ?? "basic") === "premium" ? "audio_ready" : "delivered";
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

      // Generate BioHarmony score when entering quality_check (after generating stage)
      let scoreUpdate: { bioharmonyScore?: number; scoreBreakdown?: string } = {};
      if (nextStage === "quality_check" && row.bioharmonyScore === null) {
        const seed = row.id;
        const score = 55 + ((seed * 7919) % 34);
        const breakdown = [
          { label: "Stress Load",       value: 50 + ((seed * 6571) % 40) },
          { label: "Energy Balance",    value: 55 + ((seed * 9973) % 35) },
          { label: "System Alignment",  value: 50 + ((seed * 8221) % 40) },
          { label: "Recovery Capacity", value: 52 + ((seed * 7331) % 38) },
        ];
        scoreUpdate = {
          bioharmonyScore: score,
          scoreBreakdown: JSON.stringify(breakdown),
        };
        logger.info({ id: row.id, score }, "BioHarmony Intelligence Score generated");
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

      // Send "Your report is ready" email when advancing to delivered
      // Only if email hasn't been sent yet (deliveredEmailSentAt is null)
      if (
        nextStage === "delivered" &&
        !row.deliveredEmailSentAt
      ) {
        await sendDeliveryEmail(row.id, row.name, row.email, row.plan, row.whatsapp ?? false, row.reportType);
      }
    }
  } catch (err) {
    logger.error({ err }, "Pipeline scheduler tick failed");
  }
}

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
): Promise<void> {
  const requestId = `BH-${id.toString().padStart(4, "0")}`;
  try {
    const payload = buildDeliveredEmail({
      name,
      email,
      requestId,
      plan: plan ?? "basic",
      whatsapp,
      reportType,
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

export function startPipelineScheduler(): void {
  if (_schedulerInterval) return;
  // Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
  logger.info("BioHarmony AI pipeline scheduler started (mock mode — replace with Sage/Hermes webhook later)");
  tick().catch(() => {});
  _schedulerInterval = setInterval(() => {
    tick().catch(() => {});
  }, 15_000);
}

export function stopPipelineScheduler(): void {
  if (_schedulerInterval) {
    clearInterval(_schedulerInterval);
    _schedulerInterval = null;
    logger.info("Pipeline scheduler stopped");
  }
}
