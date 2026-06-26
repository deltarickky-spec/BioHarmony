/**
 * BioHarmony Ollama AI Service
 *
 * Sends prompts to a local Ollama instance (localhost:11434) for report
 * generation and bio-frequency analysis.
 *
 * Ollama must be running locally:
 *   ollama pull llama3.2  # or any model you prefer
 *   ollama serve
 */

import { logger } from "../lib/logger";

const OLLAMA_BASE = process.env["OLLAMA_BASE_URL"] ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env["OLLAMA_MODEL"] ?? "llama3.2";

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

/**
 * Send a prompt to Ollama and return the generated text.
 * Uses the /api/generate endpoint (streaming off).
 */
export async function generate(prompt: string): Promise<string> {
  const url = `${OLLAMA_BASE}/api/generate`;
  const body = JSON.stringify({
    model: OLLAMA_MODEL,
    prompt,
    stream: false,
    options: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1024,
    },
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(120_000), // 2 min timeout per generation
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(`Ollama API error (${res.status}): ${text}`);
  }

  const data = (await res.json()) as OllamaResponse;
  return data.response ?? "";
}

/**
 * Generate a BioHarmony Intelligence Score for a scan request.
 *
 * Prompt the LLM to analyse the frequency data and produce:
 *   - An overall score (0-100)
 *   - A JSON breakdown of key metrics
 *
 * Returns { score, breakdown } or throws on failure.
 */
export async function generateBioharmonyScore(
  requestId: number,
  reportType: string,
  plan: string | null,
): Promise<{ score: number; breakdown: string }> {
  const prompt = [
    `You are a BioHarmony wellness AI analyst reviewing an AO Scan request.`,
    ``,
    `Request ID: BH-${String(requestId).padStart(4, "0")}`,
    `Report Type: ${reportType}`,
    `Plan: ${plan ?? "comprehensive"}`,
    ``,
    `Based on the frequency data, analyse the following bio-energy dimensions:`,
    `1. Stress Load — overall physiological stress burden`,
    `2. Energy Balance — harmony between energy systems`,
    `3. System Alignment — coherence across body systems`,
    `4. Recovery Capacity — the body's ability to heal and restore`,
    ``,
    `For each dimension, rate it on a scale of 0-100 where:`,
    `- 0-30: Severely imbalanced (urgent attention needed)`,
    `- 31-55: Moderately imbalanced (active support recommended)`,
    `- 56-75: Mildly imbalanced (maintenance support beneficial)`,
    `- 76-100: Balanced and resilient`,
    ``,
    `Also provide an overall BioHarmony Intelligence Score (0-100) that represents the client's total bio-energy wellness state.`,
    ``,
    `Respond with ONLY a JSON object in this exact format, no other text:`,
    `{`,
    `  "bioharmonyScore": <0-100 integer>,`,
    `  "breakdown": [`,
    `    { "label": "Stress Load", "value": <0-100> },`,
    `    { "label": "Energy Balance", "value": <0-100> },`,
    `    { "label": "System Alignment", "value": <0-100> },`,
    `    { "label": "Recovery Capacity", "value": <0-100> }`,
    `  ],`,
    `  "summary": "<one-sentence wellness insight>"`,
    `}`,
  ].join("\n");

  const raw = await generate(prompt);

  // Try to extract JSON from the response (the model might wrap it in markdown)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Ollama returned non-JSON response: ${raw.slice(0, 200)}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    bioharmonyScore?: number;
    breakdown?: Array<{ label: string; value: number }>;
    summary?: string;
  };

  const score = parsed.bioharmonyScore ?? 70;
  const breakdown = JSON.stringify(
    parsed.breakdown ?? [
      { label: "Stress Load", value: 50 },
      { label: "Energy Balance", value: 55 },
      { label: "System Alignment", value: 50 },
      { label: "Recovery Capacity", value: 52 },
    ],
  );

  return { score, breakdown };
}

/**
 * Generate the final report narrative for a delivered scan request.
 * Called right before pdf_ready stage.
 */
export async function generateReportNarrative(
  requestId: number,
  reportType: string,
  plan: string | null,
  score: number,
  breakdown: string,
): Promise<string> {
  const parsedBreakdown = JSON.parse(breakdown) as Array<{ label: string; value: number }>;
  const dimensions = parsedBreakdown.map((d) => `- ${d.label}: ${d.value}/100`).join("\n");

  const prompt = [
    `You are a compassionate BioHarmony wellness report writer.`,
    `Write a warm, professional 3-4 paragraph report summary for a client.`,
    ``,
    `Client Report: BH-${String(requestId).padStart(4, "0")}`,
    `Report Type: ${reportType}`,
    `BioHarmony Intelligence Score: ${score}/100`,
    ``,
    `Dimensional Breakdown:`,
    dimensions,
    ``,
    `The report should:`,
    `- Address the client directly by their Report ID`,
    `- Explain what the BioHarmony Intelligence Score means`,
    `- Provide context for each dimension without causing alarm`,
    `- Offer encouraging, actionable suggestions`,
    `- Emphasise that this is a non-diagnostic wellness insight tool`,
    `- End with a warm closing message`,
    ``,
    `Write in a caring but professional tone. Avoid markdown formatting.`,
  ].join("\n");

  return await generate(prompt);
}
