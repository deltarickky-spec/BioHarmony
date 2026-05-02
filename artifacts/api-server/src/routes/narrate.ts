import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { reportAudioTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const NarrateSchema = z.object({
  text: z.string().min(1).max(5000),
  cacheKey: z.string().min(1).max(100),
});

router.post("/narrate", async (req, res) => {
  const parsed = NarrateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const { text, cacheKey } = parsed.data;
  const voice = "shimmer" as const;

  try {
    const cached = await db
      .select()
      .from(reportAudioTable)
      .where(eq(reportAudioTable.cacheKey, cacheKey))
      .limit(1);

    if (cached.length > 0) {
      req.log.info({ cacheKey }, "Serving cached audio");
      const audioBuffer = Buffer.from(cached[0].audioBase64, "base64");
      res.set("Content-Type", "audio/mpeg");
      res.set("Content-Length", String(audioBuffer.length));
      res.set("Cache-Control", "public, max-age=86400");
      res.send(audioBuffer);
      return;
    }

    req.log.info({ cacheKey, chars: text.length }, "Generating TTS audio");

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: text,
      response_format: "mp3",
    });

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const audioBase64 = audioBuffer.toString("base64");

    await db.insert(reportAudioTable).values({ cacheKey, voice, audioBase64 });

    res.set("Content-Type", "audio/mpeg");
    res.set("Content-Length", String(audioBuffer.length));
    res.set("Cache-Control", "public, max-age=86400");
    res.send(audioBuffer);
  } catch (err) {
    req.log.error({ err }, "Audio generation failed");
    res.status(500).json({ error: "Could not generate audio. Please try again." });
  }
});

export default router;
