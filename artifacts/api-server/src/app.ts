import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import type Stripe from "stripe";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";
import { handleBioHarmonyStripeEvent } from "./services/paymentHandler";

const app: Express = express();

// ── Logging middleware ──────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── Stripe webhook — MUST be registered BEFORE express.json() ──────────────────
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    const signature = Array.isArray(sig) ? sig[0]! : sig;

    // Step 1: Verify + sync via stripe-replit-sync
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, signature);
    } catch (err) {
      logger.error({ err }, "Stripe webhook verification/sync failed");
      res.status(400).json({ error: "Webhook processing error" });
      return;
    }

    // Step 2: BioHarmony-specific payment logic (non-fatal)
    try {
      const event = JSON.parse((req.body as Buffer).toString()) as Stripe.Event;
      await handleBioHarmonyStripeEvent(event);
    } catch (err) {
      logger.error({ err }, "BioHarmony payment handler error (non-fatal, sync succeeded)");
    }

    res.status(200).json({ received: true });
  },
);

// ── Standard middleware (after webhook) ────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API routes ─────────────────────────────────────────────────────────────────
app.use("/api", router);

export default app;
