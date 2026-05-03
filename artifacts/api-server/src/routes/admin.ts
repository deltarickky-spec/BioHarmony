import { Router } from "express";
import { db } from "@workspace/db";
import { reportRequestsTable, scanRequestsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  isGlobalPaused,
  pauseGlobal,
  resumeGlobal,
} from "../services/pipelineScheduler";

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
  })
  .refine(
    (d) =>
      d.status !== undefined ||
      d.pipelineStage !== undefined ||
      d.paymentStatus !== undefined ||
      d.pipelinePaused !== undefined ||
      d.pipelineError !== undefined,
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
      };

      if (Object.keys(updateSet).length > 0) {
        await db.update(scanRequestsTable).set(updateSet).where(eq(scanRequestsTable.id, id));
      }
    }

    req.log.info({ source, id, ...data }, "Request updated by admin");
    res.json({ success: true, id, ...data });
  } catch (err) {
    req.log.error({ err }, "Failed to update request");
    res.status(500).json({ error: "Could not update request" });
  }
});

// ── Pipeline automation control ────────────────────────────────────────────────

/** Get global pipeline automation status */
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
