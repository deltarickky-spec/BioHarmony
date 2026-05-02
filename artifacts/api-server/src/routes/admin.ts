import { Router } from "express";
import { db } from "@workspace/db";
import { reportRequestsTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/admin/leads", async (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD ?? "bioharmony2025";

  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const leads = await db
      .select()
      .from(reportRequestsTable)
      .orderBy(desc(reportRequestsTable.createdAt));

    res.json({ leads });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch leads");
    res.status(500).json({ error: "Could not retrieve leads" });
  }
});

export default router;
