import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { reportAudioTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  de: "German",
  it: "Italian",
};

const NarrateSchema = z.object({
  text: z.string().min(1).max(5000),
  cacheKey: z.string().min(1).max(100),
  language: z.string().min(2).max(5).optional().default("en"),
});

async function translateNarration(text: string, targetLang: string): Promise<string> {
  const langName = LANG_NAMES[targetLang];
  if (!langName) return text;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a professional wellness translator. Translate the following narration from English to ${langName}. Maintain a warm, calm, personal tone — as if Kathy Owens is speaking directly to the client. Return only the translated text, no other commentary.`,
      },
      { role: "user", content: text },
    ],
  });

  return completion.choices[0]?.message?.content ?? text;
}

router.post("/narrate", async (req, res) => {
  const parsed = NarrateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const { text, cacheKey, language } = parsed.data;
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

    const isNonEnglish = language && language !== "en" && LANG_NAMES[language];
    let narrationText = text;

    if (isNonEnglish) {
      req.log.info({ cacheKey, language }, "Translating narration before TTS");
      narrationText = await translateNarration(text, language);
    }

    req.log.info({ cacheKey, language, chars: narrationText.length }, "Generating TTS audio");

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice,
      input: narrationText,
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
