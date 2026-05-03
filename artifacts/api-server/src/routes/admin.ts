import { Router } from "express";
import { db } from "@workspace/db";
import { reportRequestsTable, scanRequestsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

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
  })
  .refine(
    (d) => d.status !== undefined || d.pipelineStage !== undefined || d.paymentStatus !== undefined,
    { message: "At least one field (status, pipelineStage, or paymentStatus) is required" },
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

  try {
    if (source === "report") {
      const updateSet = {
        ...(data.status !== undefined ? { status: data.status } : {}),
      };
      if (Object.keys(updateSet).length > 0) {
        await db.update(reportRequestsTable).set(updateSet).where(eq(reportRequestsTable.id, id));
      }
    } else {
      const updateSet = {
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.pipelineStage !== undefined ? { pipelineStage: data.pipelineStage } : {}),
        ...(data.paymentStatus !== undefined ? { paymentStatus: data.paymentStatus } : {}),
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

export { PIPELINE_STAGES, PAYMENT_STATUSES, VALID_STATUSES };
export default router;
