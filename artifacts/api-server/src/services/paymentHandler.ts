import type Stripe from "stripe";
import { db } from "@workspace/db";
import { scanRequestsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

/**
 * Handle BioHarmony-specific Stripe events.
 * Called after stripe-replit-sync has already verified + synced the event.
 */
export async function handleBioHarmonyStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await onCheckoutComplete(session);
  }
}

async function onCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
  const rawId = session.metadata?.scanRequestId;
  if (!rawId) {
    logger.warn({ sessionId: session.id }, "checkout.session.completed — no scanRequestId in metadata");
    return;
  }

  const id = parseInt(rawId, 10);
  if (isNaN(id) || id <= 0) {
    logger.warn({ sessionId: session.id, rawId }, "checkout.session.completed — invalid scanRequestId");
    return;
  }

  await db
    .update(scanRequestsTable)
    .set({ paymentStatus: "paid" })
    .where(eq(scanRequestsTable.id, id));

  logger.info({ id, sessionId: session.id }, "Payment confirmed — pipeline will auto-start on next scheduler tick");
}
