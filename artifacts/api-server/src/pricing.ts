 /**
 * BioHarmony Analytics — central pricing source of truth (backend).
 * Mirrored at artifacts/bioharmony/src/lib/pricing.ts.
 *
 * Any price/label/feature change must be made in BOTH files.
 */

export type PlanKind = "individual" | "package" | "pet";

export interface PlanDef {
  id: string;
  label: string;
  price: number;           // CAD/USD whole dollars
  kind: PlanKind;
  popular?: boolean;
  flagship?: boolean;
  shortDesc: string;
  longDesc?: string;
  includes?: string[];
  bestFor?: string;
  deliverable?: string;
  scanTime?: string;
}

export const PLANS: readonly PlanDef[] = [
  // ── 7 individual AO Scan programs ────────────────────────────────────────────
  {
    id: "inner-voice",
    label: "Inner Voice Scan",
    price: 33,
    kind: "individual",
    shortDesc: "Voice frequency emotional analysis with balancing audio.",
    longDesc: "A 10–15 second voice recording analyzed for tonal frequencies that map to current emotional states and stress patterns.",
    bestFor: "Quick emotional wellness check, stress assessment, mood balancing.",
    deliverable: "Voice analysis report + personalized balancing audio file (MP3).",
    scanTime: "10–15 seconds recording.",
  },
  {
    id: "vitals",
    label: "Vitals Scan",
    price: 44,
    kind: "individual",
    shortDesc: "Snapshot of your body's core energetic systems.",
    longDesc: "Scans the energetic state of your blood biology, vital organs, endocrine glands, and foundational body systems.",
    bestFor: "General wellness overview, first-time clients, annual check-in.",
    deliverable: "Vitals summary report with system-by-system color-coded results.",
    scanTime: "~2–3 minutes.",
  },
  {
    id: "body-system",
    label: "Body System Scan",
    price: 66,
    kind: "individual",
    shortDesc: "Deep-dive into one specific body system of your choice.",
    longDesc: "Focuses on a single body system (digestive, cardiovascular, respiratory, lymphatic, etc.) for detailed energetic imbalance analysis.",
    bestFor: "Clients with specific concerns (digestive, heart, breathing, etc.).",
    deliverable: "Detailed single-system report with specific findings and recommendations.",
    scanTime: "~3–5 minutes.",
  },
  {
    id: "comprehensive",
    label: "Comprehensive Scan",
    price: 97,
    kind: "individual",
    flagship: true,
    shortDesc: "Our flagship full-body energetic analysis using the Solex 1–9 scale.",
    longDesc: "Deeply scans thousands of data points across all body systems, chromosomes, and cellular structures from head to toe.",
    bestFor: "Complete wellness assessment, establishing a baseline.",
    deliverable: "Full narrative report (14,000+ chars): Executive Summary, System-by-System Analysis, Frequency Resonance Story, Holistic Recommendations, 30-Day Wellness Journey Plan.",
    scanTime: "~10–15 minutes.",
  },
  {
    id: "dental",
    label: "Dental Scan",
    price: 55,
    kind: "individual",
    shortDesc: "Tooth-by-tooth energetic assessment of teeth, jaw, and oral tissues.",
    longDesc: "Scans each tooth and surrounding jaw/tissue structures for energetic imbalances, stress, or tension.",
    bestFor: "Dental wellness, pre-dental visit prep, holistic oral health.",
    deliverable: "Dental energetic profile with tooth-by-tooth analysis.",
    scanTime: "~5–7 minutes.",
  },
  {
    id: "tmj",
    label: "TMJ Scan",
    price: 55,
    kind: "individual",
    shortDesc: "Specialized scan for the temporomandibular (jaw) joint.",
    longDesc: "Assesses energetic, structural, and vibrational frequencies of the jaw joint and surrounding muscles.",
    bestFor: "Jaw pain, teeth grinding, jaw clicking, facial tension, headaches.",
    deliverable: "TMJ resonance report with structural analysis and balancing recommendations.",
    scanTime: "~5–7 minutes.",
  },
  {
    id: "ao-mindsync",
    label: "AO Mindsync",
    price: 33,
    kind: "individual",
    shortDesc: "Personalized affirmation + 8Hz binaural audio for mindfulness.",
    longDesc: "Custom audio combining your own voice affirmations with binaural beats centered at 8Hz (meditative frequency).",
    bestFor: "Mental wellness, stress management, meditation, sleep support.",
    deliverable: "Personalized MP3 with your voice + binaural tones.",
    scanTime: "~5 minutes recording + processing.",
  },

  // ── 8 package bundles ────────────────────────────────────────────────────────
  {
    id: "quick-wellness",
    label: "Quick Wellness Check",
    price: 44,
    kind: "package",
    shortDesc: "Vitals Scan only — quick energetic overview.",
    includes: ["Vitals Scan"],
    bestFor: "First-time clients wanting a quick overview.",
    deliverable: "Basic summary report.",
  },
  {
    id: "emotional-balance",
    label: "Emotional Balance",
    price: 33,
    kind: "package",
    shortDesc: "Inner Voice Scan with emotional frequency report.",
    includes: ["Inner Voice Scan"],
    bestFor: "Stress relief, mood support.",
    deliverable: "Emotional frequency report + personalized balancing audio.",
  },
  {
    id: "body-system-focus",
    label: "Body System Focus",
    price: 66,
    kind: "package",
    shortDesc: "Body System Scan (you choose the system).",
    includes: ["Body System Scan"],
    bestFor: "Targeted health concerns.",
    deliverable: "Detailed system-specific report.",
  },
  {
    id: "complete-wellness",
    label: "Complete Wellness",
    price: 97,
    kind: "package",
    popular: true,
    shortDesc: "Full Comprehensive Scan — single person, one session.",
    includes: ["Comprehensive Scan"],
    bestFor: "Complete baseline assessment, serious wellness tracking.",
    deliverable: "Full narrative report (all 5 sections, 14,000+ chars). Standard 2–3 business day PDF delivery. No add-ons.",
  },
  {
    id: "oral-health-plus",
    label: "Oral Health Plus",
    price: 88,
    kind: "package",
    shortDesc: "Dental Scan + TMJ Scan combined.",
    includes: ["Dental Scan", "TMJ Scan"],
    bestFor: "Holistic oral health focus.",
    deliverable: "Combined oral wellness report.",
  },
  {
    id: "mind-body-harmony",
    label: "Mind-Body Harmony",
    price: 77,
    kind: "package",
    shortDesc: "Inner Voice + Vitals + AO Mindsync.",
    includes: ["Inner Voice Scan", "Vitals Scan", "AO Mindsync"],
    bestFor: "Holistic mind-body wellness.",
    deliverable: "Three reports + personalized audio.",
  },
  {
    id: "ultimate-wellness",
    label: "Ultimate Wellness",
    price: 133,
    kind: "package",
    shortDesc: "Comprehensive + Inner Voice + Vitals for the full picture.",
    includes: ["Comprehensive Scan", "Inner Voice Scan", "Vitals Scan"],
    bestFor: "Complete mind-body picture, premium entry tier.",
    deliverable: "Full comprehensive report + emotional analysis + balancing audio.",
  },
  {
    id: "premium-interpretation",
    label: "Premium Interpretation",
    price: 297,
    kind: "package",
    shortDesc: "Comprehensive Scan + 30–45 min 1-on-1 with Kathy Owens.",
    includes: ["Comprehensive Scan", "Live interpretation session with Kathy"],
    bestFor: "Clients wanting expert guidance and a personalized action plan.",
    deliverable: "Full report + live walkthrough + custom wellness roadmap (session scheduled separately).",
  },

  // ── Pet scans ───────────────────────────────────────────────────────────────
  {
    id: "pet-vitals",
    label: "Pet Vitals",
    price: 75,
    kind: "pet",
    shortDesc: "Energetic snapshot of your pet's blood biology, organs, and glands.",
    bestFor: "Quick wellness overview for dogs, cats, and horses.",
    deliverable: "Pet vitals summary report.",
  },
  {
    id: "pet-comprehensive",
    label: "Pet Comprehensive",
    price: 150,
    kind: "pet",
    shortDesc: "Full body system analysis for pets with 30-day wellness plan.",
    bestFor: "Owners wanting a complete energetic profile for their animal.",
    deliverable: "Complete pet report with all body systems + 30-day pet wellness plan.",
  },
] as const;

// Legacy slug compatibility — keeps existing DB rows resolvable.
const LEGACY_PLAN_ALIASES: Record<string, string> = {
  basic: "vitals",
  advanced: "comprehensive",
  premium: "ultimate-wellness",
};

export const ALL_PLAN_IDS = PLANS.map((p) => p.id);
const VALID_PLAN_IDS = new Set<string>([...ALL_PLAN_IDS, ...Object.keys(LEGACY_PLAN_ALIASES)]);

function resolvePlanId(id: string | null | undefined): string {
  if (!id) return "comprehensive";
  return LEGACY_PLAN_ALIASES[id] ?? id;
}

export function getPlan(id: string | null | undefined): PlanDef {
  const resolved = resolvePlanId(id);
  return PLANS.find((p) => p.id === resolved) ?? PLANS.find((p) => p.id === "comprehensive")!;
}

export function getPlanPrice(id: string | null | undefined): number {
  return getPlan(id).price;
}

export function getPlanLabel(id: string | null | undefined): string {
  return getPlan(id).label;
}

export function isValidPlanId(id: string): boolean {
  return VALID_PLAN_IDS.has(id);
}

/** Plans that grant an audio narration (AO Mindsync-equivalent) on delivery. */
const AUDIO_PLAN_IDS = new Set([
  "ao-mindsync",
  "inner-voice",
  "emotional-balance",
  "mind-body-harmony",
  "ultimate-wellness",
  "premium-interpretation",
  "premium", // legacy
]);

export function planHasAudio(id: string | null | undefined): boolean {
  const resolved = resolvePlanId(id);
  return AUDIO_PLAN_IDS.has(resolved) || AUDIO_PLAN_IDS.has(id ?? "");
}

/** Plans that include a BioHarmony Score (anything richer than a single basic vitals/inner voice). */
const SCORE_PLAN_IDS = new Set([
  "comprehensive", "complete-wellness", "ultimate-wellness", "premium-interpretation",
  "body-system", "body-system-focus", "oral-health-plus",
  "advanced", "premium", // legacy
]);

export function planHasScore(id: string | null | undefined): boolean {
  const resolved = resolvePlanId(id);
  return SCORE_PLAN_IDS.has(resolved) || SCORE_PLAN_IDS.has(id ?? "");
}
