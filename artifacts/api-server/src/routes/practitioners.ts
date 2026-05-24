import { Router } from "express";
import { db } from "@workspace/db";
import { practitionersTable, scanRequestsTable } from "@workspace/db/schema";
import { eq, ilike, desc } from "drizzle-orm";
import { z } from "zod";
import { buildPractitionerWelcomeEmail, sendEmail } from "../services/email";

const router = Router();

const PLAN_PRICES: Record<string, number> = { basic: 55, advanced: 99, premium: 149 };

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

async function computeStats(code: string, commissionRate: number) {
  const scans = await db
    .select()
    .from(scanRequestsTable)
    .where(ilike(scanRequestsTable.practitionerCode, code));

  const totalReferrals = scans.length;
  const delivered = scans.filter((s) => s.pipelineStage === "delivered");
  const completedReports = delivered.length;
  const revenueGenerated = delivered.reduce(
    (sum, s) => sum + (PLAN_PRICES[s.plan ?? "basic"] ?? 55),
    0,
  );
  const earnedCommission = Math.floor((revenueGenerated * commissionRate) / 100);
  return { totalReferrals, completedReports, revenueGenerated, earnedCommission };
}

// ── Admin: list all practitioners with live stats ──────────────────────────────

router.get("/admin/practitioners", async (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(practitionersTable)
      .orderBy(desc(practitionersTable.createdAt));

    const withStats = await Promise.all(
      rows.map(async (p) => {
        const stats = await computeStats(p.referralCode, p.commissionRate);
        return {
          ...p,
          ...stats,
          pendingPayout: Math.max(0, stats.earnedCommission - p.totalPaid),
        };
      }),
    );
    res.json(withStats);
  } catch (err) {
    req.log.error({ err }, "Failed to list practitioners");
    res.status(500).json({ error: "Could not load practitioners" });
  }
});

// ── Admin: create practitioner ─────────────────────────────────────────────────

const CreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  referralCode: z
    .string()
    .min(2)
    .max(50)
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Code may only contain letters, numbers, hyphens and underscores"),
  commissionRate: z.number().int().min(0).max(100).default(10),
  tier: z.string().max(30).optional(),
  notes: z.string().max(1000).optional(),
});

router.post("/admin/practitioners", async (req, res) => {
  if (!checkAuth(req, res)) return;
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  try {
    const [row] = await db
      .insert(practitionersTable)
      .values(parsed.data)
      .returning();

    // Send welcome email to newly-added practitioner
    const siteUrl = process.env["SITE_URL"] ?? "https://bioharmonysolutions.ca";
    sendEmail(buildPractitionerWelcomeEmail({
      practitionerName: row.name,
      practitionerEmail: row.email,
      referralCode: row.referralCode,
      commissionRate: row.commissionRate,
      dashboardUrl: `${siteUrl}/practitioner-portal`,
    })).catch((err) => {
      req.log.error({ err, id: row.id }, "Failed to send practitioner welcome email");
    });

    res.status(201).json(row);
  } catch (err: unknown) {
    const pg = err as { code?: string };
    if (pg?.code === "23505") {
      res.status(409).json({ error: "A practitioner with this referral code or email already exists." });
      return;
    }
    req.log.error({ err }, "Failed to create practitioner");
    res.status(500).json({ error: "Could not create practitioner" });
  }
});

// ── Admin: update practitioner ─────────────────────────────────────────────────

const UpdateSchema = z.object({
  commissionRate: z.number().int().min(0).max(100).optional(),
  tier: z.string().max(30).optional(),
  notes: z.string().max(1000).nullable().optional(),
  active: z.boolean().optional(),
  businessName: z.string().max(150).nullable().optional(),
  logoUrl: z.string().max(2000).nullable().optional(),
  credits: z.number().int().min(0).max(10000).optional(),
  creditsUsed: z.number().int().min(0).max(10000).optional(),
});

router.patch("/admin/practitioners/:id", async (req, res) => {
  if (!checkAuth(req, res)) return;
  const id = parseInt(req.params["id"] ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid data" }); return; }

  try {
    const [row] = await db
      .update(practitionersTable)
      .set(parsed.data)
      .where(eq(practitionersTable.id, id))
      .returning();
    if (!row) { res.status(404).json({ error: "Practitioner not found" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to update practitioner");
    res.status(500).json({ error: "Could not update" });
  }
});

// ── Admin: record payout ───────────────────────────────────────────────────────

router.post("/admin/practitioners/:id/payout", async (req, res) => {
  if (!checkAuth(req, res)) return;
  const id = parseInt(req.params["id"] ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const parsed = z.object({ amount: z.number().int().min(1) }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "amount (integer cents) required" }); return; }

  try {
    const [existing] = await db
      .select()
      .from(practitionersTable)
      .where(eq(practitionersTable.id, id))
      .limit(1);
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }

    const [row] = await db
      .update(practitionersTable)
      .set({ totalPaid: existing.totalPaid + parsed.data.amount })
      .where(eq(practitionersTable.id, id))
      .returning();
    res.json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to record payout");
    res.status(500).json({ error: "Could not record payout" });
  }
});

// ── Admin: delete practitioner ─────────────────────────────────────────────────

router.delete("/admin/practitioners/:id", async (req, res) => {
  if (!checkAuth(req, res)) return;
  const id = parseInt(req.params["id"] ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  try {
    await db.delete(practitionersTable).where(eq(practitionersTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete practitioner");
    res.status(500).json({ error: "Could not delete" });
  }
});

// ── Public: practitioner dashboard (authenticated by referral code) ────────────

router.get("/practitioners/dashboard/:code", async (req, res) => {
  const code = (req.params["code"] ?? "").trim().toUpperCase();
  if (!code) { res.status(400).json({ error: "Code required" }); return; }

  try {
    const [practitioner] = await db
      .select()
      .from(practitionersTable)
      .where(eq(practitionersTable.referralCode, code))
      .limit(1);

    if (!practitioner || !practitioner.active) {
      res.status(404).json({ error: "Referral code not found or inactive." });
      return;
    }

    const stats = await computeStats(code, practitioner.commissionRate);

    const recentScans = await db
      .select({
        reportType: scanRequestsTable.reportType,
        plan: scanRequestsTable.plan,
        pipelineStage: scanRequestsTable.pipelineStage,
        paymentStatus: scanRequestsTable.paymentStatus,
        createdAt: scanRequestsTable.createdAt,
      })
      .from(scanRequestsTable)
      .where(ilike(scanRequestsTable.practitionerCode, code))
      .orderBy(desc(scanRequestsTable.createdAt))
      .limit(20);

    res.json({
      id: practitioner.id,
      name: practitioner.name,
      email: practitioner.email,
      referralCode: practitioner.referralCode,
      commissionRate: practitioner.commissionRate,
      tier: practitioner.tier,
      totalPaid: practitioner.totalPaid,
      businessName: practitioner.businessName,
      logoUrl: practitioner.logoUrl,
      credits: practitioner.credits,
      creditsUsed: practitioner.creditsUsed,
      creditsRemaining: Math.max(0, practitioner.credits - practitioner.creditsUsed),
      pendingPayout: Math.max(0, stats.earnedCommission - practitioner.totalPaid),
      ...stats,
      recentReferrals: recentScans,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to load practitioner dashboard");
    res.status(500).json({ error: "Could not load dashboard" });
  }
});

export default router;
