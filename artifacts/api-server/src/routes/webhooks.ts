import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

/**
 * Webhook placeholder endpoints — ready to connect HP Sage/Hermes AI processing.
 * Each endpoint logs the payload and returns a 200 acknowledgement.
 * Replace the body of each handler with real processing logic when integrating.
 */

router.post("/webhooks/payment-success", (req, res) => {
  logger.info({ body: req.body }, "[WEBHOOK] payment-success received");
  res.json({ received: true, event: "payment-success", status: "queued" });
});

router.post("/webhooks/report-generated", (req, res) => {
  logger.info({ body: req.body }, "[WEBHOOK] report-generated received");
  res.json({ received: true, event: "report-generated", status: "queued" });
});

router.post("/webhooks/audio-ready", (req, res) => {
  logger.info({ body: req.body }, "[WEBHOOK] audio-ready received");
  res.json({ received: true, event: "audio-ready", status: "queued" });
});

router.post("/webhooks/delivery-complete", (req, res) => {
  logger.info({ body: req.body }, "[WEBHOOK] delivery-complete received");
  res.json({ received: true, event: "delivery-complete", status: "queued" });
});

/**
 * Sage/Hermes AI processing status update.
 * Expected payload: { requestId: number, stage: string, score?: number, scoreBreakdown?: string, error?: string }
 */
router.post("/webhooks/sage-hermes-status", (req, res) => {
  logger.info({ body: req.body }, "[WEBHOOK] sage-hermes-status received");
  res.json({ received: true, event: "sage-hermes-status", status: "queued" });
});

export default router;
