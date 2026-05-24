import { Router } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { scanRequestsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getUncachableStripeClient } from "../stripeClient";
import { getPlan } from "../pricing";

const router = Router();

const CheckoutSchema = z.object({
  scanRequestId: z.number().int().positive(),
});

/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for a submitted scan request.
 * Looks up the price from the synced stripe.prices table by plan metadata.
 */
router.post("/stripe/checkout", async (req, res) => {
  const parsed = CheckoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const { scanRequestId } = parsed.data;

  try {
    // Fetch the scan request to confirm it exists and get its plan
    const rows = await db
      .select()
      .from(scanRequestsTable)
      .where(eq(scanRequestsTable.id, scanRequestId))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Scan request not found" });
      return;
    }

    const row = rows[0]!;
    const plan = row.plan ?? "comprehensive";
    const planDef = getPlan(plan);

    // Look up the Stripe price from the synced stripe schema
    const priceResult = await db.execute(
      sql`
        SELECT pr.id AS price_id
        FROM stripe.prices pr
        JOIN stripe.products prod ON prod.id = pr.product
        WHERE prod.metadata->>'plan' = ${plan}
          AND pr.active = true
          AND prod.active = true
        LIMIT 1
      `,
    );

    if (priceResult.rows.length === 0) {
      req.log.error({ plan }, "No active Stripe price found for plan — run seed-products script");
      res.status(503).json({
        error: "Payment temporarily unavailable. Please contact info@bioharmonysolutions.ca.",
      });
      return;
    }

    const priceId = priceResult.rows[0]!.price_id as string;

    const stripe = await getUncachableStripeClient();

    const requestId = `BH-${scanRequestId.toString().padStart(4, "0")}`;
    const domain =
      process.env.SITE_URL ??
      `https://${(process.env.REPLIT_DOMAINS ?? "localhost").split(",")[0]}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      customer_email: row.email,
      metadata: {
        scanRequestId: String(scanRequestId),
        requestId,
        plan,
        clientName: row.name,
      },
      success_url: `${domain}/track-report?id=${requestId}`,
      cancel_url: `${domain}/upload-scan`,
      payment_intent_data: {
        description: `BioHarmony ${planDef.label} — $${planDef.price}`,
        metadata: {
          scanRequestId: String(scanRequestId),
          requestId,
          clientName: row.name,
        },
      },
    });

    req.log.info({ scanRequestId, plan, sessionId: session.id }, "Stripe checkout session created");
    res.json({ url: session.url });
  } catch (err) {
    req.log.error({ err, scanRequestId }, "Failed to create Stripe checkout session");
    res.status(500).json({ error: "Could not create payment session. Please try again." });
  }
});

export default router;
