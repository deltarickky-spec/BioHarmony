import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { db } from "@workspace/db";
import { reportTranslationsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const LANG_NAMES: Record<string, string> = {
  es: "Spanish",
  fr: "French",
  pt: "Portuguese",
  de: "German",
  it: "Italian",
};

const TranslateRequestSchema = z.object({
  content: z.record(z.string(), z.unknown()),
  targetLanguage: z.string().min(2).max(5),
  sessionId: z.string().min(1).max(64),
});

router.post("/translate", async (req, res) => {
  const parsed = TranslateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const { content, targetLanguage, sessionId } = parsed.data;

  if (targetLanguage === "en") {
    res.json({ translated: content, cached: false });
    return;
  }

  const langName = LANG_NAMES[targetLanguage];
  if (!langName) {
    res.status(400).json({ error: `Unsupported language: ${targetLanguage}` });
    return;
  }

  try {
    const existing = await db
      .select()
      .from(reportTranslationsTable)
      .where(
        and(
          eq(reportTranslationsTable.sessionId, sessionId),
          eq(reportTranslationsTable.language, targetLanguage),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      res.json({ translated: existing[0].contentTranslated, cached: true });
      return;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 8192,
      messages: [
        {
          role: "system",
          content: `You are a professional wellness translator specializing in warm, empathetic language.
Translate the JSON wellness report content from English to ${langName}.

STRICT RULES:
- Maintain a warm, personal, story-style tone — conversational and gentle, NOT clinical or robotic
- Keep ALL JSON object keys exactly as-is in English (never translate keys)
- Do NOT translate these proper nouns: "BioHarmony Solutions", "BioHarmony", "SEFI", "Jane Doe", "Kathy Owens"
- Preserve the exact JSON structure — same keys, same array lengths, same nesting
- Only translate the string values
- Return ONLY valid JSON — no markdown fences, no explanation, just the JSON object`,
        },
        {
          role: "user",
          content: JSON.stringify(content, null, 2),
        },
      ],
    });

    const raw = response.choices[0]?.message?.content ?? "";

    let translated: Record<string, unknown>;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      translated = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as Record<string, unknown>;
    } catch {
      req.log.warn({ raw }, "Failed to parse translation JSON — falling back to English");
      translated = content;
    }

    await db.insert(reportTranslationsTable).values({
      sessionId,
      language: targetLanguage,
      reportType: "sample",
      contentEnglish: content,
      contentTranslated: translated,
    });

    res.json({ translated, cached: false });
  } catch (err) {
    req.log.error({ err }, "Translation error");
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
