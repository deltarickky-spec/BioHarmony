import { runMigrations } from "stripe-replit-sync";
import app from "./app";
import { logger } from "./lib/logger";
import { startPipelineScheduler } from "./services/pipelineScheduler";
import { getStripeSync } from "./stripeClient";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

async function initStripe(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    logger.warn("DATABASE_URL not set — Stripe initialization skipped");
    return;
  }

  try {
    logger.info("Initializing Stripe schema...");
    await runMigrations({ databaseUrl });
    logger.info("Stripe schema ready");

    const stripeSync = await getStripeSync();

    const domain = `https://${(process.env.REPLIT_DOMAINS ?? "localhost").split(",")[0]}`;
    const webhookEndpoint = await stripeSync.findOrCreateManagedWebhook(`${domain}/api/stripe/webhook`);
    logger.info({ url: webhookEndpoint?.url }, "Stripe webhook configured");

    stripeSync
      .syncBackfill()
      .then(() => logger.info("Stripe data backfill complete"))
      .catch((err: unknown) => logger.error({ err }, "Stripe backfill error (non-fatal)"));
  } catch (err) {
    logger.warn({ err }, "Stripe initialization failed — payments disabled until Stripe is connected");
  }
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
  startPipelineScheduler();
  await initStripe();
});
