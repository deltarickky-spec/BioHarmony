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
 */

import { db } from "@workspace/db";
import { scanRequestsTable } from "@workspace/db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { logger } from "../lib/logger";

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
  pdf_ready: 60,       // PDF compilation (also used for audio_ready stage)
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

// ── Public stage helper (used by admin route to reset timer on manual advance) ─

export function nowTimestamp(): Date {
  return new Date();
}

// ── Scheduler tick ─────────────────────────────────────────────────────────────

/**
 * Single scheduler tick.
 * Queries all eligible requests and advances any that have exceeded their stage duration.
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

      if (duration === 0) continue; // terminal or unknown stage

      // If stageEnteredAt is missing, initialise it — the request just became eligible
      if (!row.stageEnteredAt) {
        await db
          .update(scanRequestsTable)
          .set({ stageEnteredAt: now })
          .where(eq(scanRequestsTable.id, row.id));
        logger.info({ id: row.id, stage }, "Pipeline timer initialised for request");
        continue;
      }

      const elapsedSeconds = (now.getTime() - row.stageEnteredAt.getTime()) / 1_000;
      if (elapsedSeconds < duration) continue; // not ready yet

      const nextStage = getNextStage(stage, row.plan);
      if (!nextStage) continue;

      logger.info(
        { id: row.id, from: stage, to: nextStage, elapsedSeconds: Math.round(elapsedSeconds) },
        // Mock pipeline progression — replace with Sage/Hermes AI processing webhook later.
        "Auto-advancing pipeline stage",
      );

      await db
        .update(scanRequestsTable)
        .set({
          pipelineStage: nextStage,
          stageEnteredAt: now,
          // Keep legacy status field in sync when fully delivered
          ...(nextStage === "delivered" ? { status: "delivered" } : {}),
        })
        .where(eq(scanRequestsTable.id, row.id));
    }
  } catch (err) {
    logger.error({ err }, "Pipeline scheduler tick failed");
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
  }, 15_000); // poll every 15 seconds
}

export function stopPipelineScheduler(): void {
  if (_schedulerInterval) {
    clearInterval(_schedulerInterval);
    _schedulerInterval = null;
    logger.info("Pipeline scheduler stopped");
  }
}
