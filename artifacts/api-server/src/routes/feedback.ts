import { Router } from "express";
import { db } from "@workspace/db";
import { feedbackTable } from "@workspace/db/schema";
import { z } from "zod";

const router = Router();

const FeedbackSchema = z.object({
  requestId: z.string().max(100).trim().optional(),
  accuracyRating: z.number().int().min(1).max(5),
  clarityRating: z.number().int().min(1).max(5),
  returnLikelihood: z.number().int().min(1).max(5),
  testimonial: z.string().max(500).trim().optional(),
  referralSource: z.string().max(100).trim().optional(),
  clientName: z.string().max(100).trim().optional(),
  consentShare: z.boolean().default(false),
});

router.post("/feedback", async (req, res) => {
  const parsed = FeedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid feedback data", details: parsed.error.flatten() });
    return;
  }

  const d = parsed.data;

  try {
    const [row] = await db
      .insert(feedbackTable)
      .values({
        requestId: d.requestId ?? null,
        accuracyRating: d.accuracyRating,
        clarityRating: d.clarityRating,
        returnLikelihood: d.returnLikelihood,
        testimonial: d.testimonial ?? null,
        referralSource: d.referralSource ?? null,
        clientName: d.clientName ?? null,
        consentShare: d.consentShare,
      })
      .returning({ id: feedbackTable.id });

    res.status(201).json({ success: true, id: row?.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save feedback");
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

router.get("/feedback", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(feedbackTable)
      .orderBy(feedbackTable.createdAt);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch feedback");
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

export default router;
