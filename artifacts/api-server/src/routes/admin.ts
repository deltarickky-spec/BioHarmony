import { Router } from "express";
import { db } from "@workspace/db";
import { reportRequestsTable, scanRequestsTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const VALID_STATUSES = ["new", "in_review", "in_progress", "completed", "delivered"] as const;
const StatusSchema = z.object({
  status: z.enum(VALID_STATUSES),
});

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

  const parsed = StatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid status", details: parsed.error.issues });
    return;
  }

  const { status } = parsed.data;

  try {
    if (source === "report") {
      await db
        .update(reportRequestsTable)
        .set({ status })
        .where(eq(reportRequestsTable.id, id));
    } else {
      await db
        .update(scanRequestsTable)
        .set({ status })
        .where(eq(scanRequestsTable.id, id));
    }

    req.log.info({ source, id, status }, "Request status updated");
    res.json({ success: true, id, status });
  } catch (err) {
    req.log.error({ err }, "Failed to update status");
    res.status(500).json({ error: "Could not update status" });
  }
});

export default router;
