/**
 * Bio-Frequency Analytics — central pricing source of truth (backend).
 * Mirrored at artifacts/bioharmony/src/lib/pricing.ts.
 *
 * Any price/label/feature change must be made in BOTH files.
 * All prices in USD.
 */

export type PlanKind = "individual" | "bundle" | "pet" | "membership" | "practitioner";

export interface PlanDef {
  id: string;
  label: string;
  price: number;
  kind: PlanKind;
  popular?: boolean;
  flagship?: boolean;
  shortDesc: string;
  longDesc?: string;
  includes?: string[];
  bestFor?: string;
  deliverable?: string;
  scanTime?: string;
  period?: string;
  badge?: string;
  highlight_features?: string[];
}

// ─── Client A La Carte Scans ────────────────────────────────────────────────

export const INDIVIDUAL_SCANS: readonly PlanDef[] = [
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
  // ── Pet scans ─────────────────────────────────────────────────────────────
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

// ─── Bundles (true savings) ──────────────────────────────────────────────────

export const BUNDLE_PLANS: readonly PlanDef[] = [
  {
    id: "oral-health-plus",
    label: "Oral Health Plus",
    price: 88,
    kind: "bundle",
    shortDesc: "Dental Scan + TMJ Scan combined — save $22.",
    includes: ["Dental Scan ($55)", "TMJ Scan ($55)"],
    bestFor: "Holistic oral health, comprehensive jaw & tooth assessment.",
    deliverable: "Combined oral wellness report with both analyses.",
  },
  {
    id: "mind-body-harmony",
    label: "Mind-Body Harmony",
    price: 77,
    kind: "bundle",
    shortDesc: "Inner Voice + Vitals + AO Mindsync — save $33.",
    includes: ["Inner Voice Scan ($33)", "Vitals Scan ($44)", "AO Mindsync ($33)"],
    bestFor: "Holistic mind-body wellness starting point.",
    deliverable: "Three reports + personalized balancing audio.",
  },
  {
    id: "ultimate-wellness",
    label: "Ultimate Wellness",
    price: 133,
    kind: "bundle",
    popular: true,
    badge: "Best Value",
    shortDesc: "Comprehensive + Inner Voice + Vitals — save $41.",
    includes: ["Comprehensive Scan ($97)", "Inner Voice Scan ($33)", "Vitals Scan ($44)"],
    bestFor: "Complete mind-body picture, premium entry tier.",
    deliverable: "Full comprehensive report + emotional analysis + balancing audio.",
  },
  {
    id: "premium-interpretation",
    label: "Premium Interpretation",
    price: 297,
    kind: "bundle",
    shortDesc: "Comprehensive Scan + 30–45 min 1-on-1 with Kathy Owens.",
    includes: ["Comprehensive Scan ($97)", "Live interpretation session with Kathy"],
    bestFor: "Clients wanting expert guidance and a personalized action plan.",
    deliverable: "Full report + live walkthrough + custom wellness roadmap (session scheduled separately).",
  },
] as const;

// ─── Client Memberships ──────────────────────────────────────────────────────

export const MEMBERSHIP_PLANS: readonly PlanDef[] = [
  {
    id: "membership-access",
    label: "BioHarmony Access",
    price: 97,
    kind: "membership",
    period: "month",
    shortDesc: "One scan per month + member-only discounts.",
    bestFor: "Monthly wellness tracking, existing clients who scan regularly.",
    deliverable: "1 comprehensive or comparable scan per month",
    highlight_features: [
      "1 scan per month (any $97-or-less scan)",
      "20% off additional a la carte scans",
      "Access to client portal with history tracking",
      "Priority email processing",
      "Monthly wellness tip via email",
    ],
  },
  {
    id: "membership-pro",
    label: "BioHarmony Pro",
    price: 147,
    kind: "membership",
    period: "month",
    badge: "Most Popular",
    popular: true,
    shortDesc: "Two scans per month plus deeper savings.",
    bestFor: "Active wellness self-trackers.",
    highlight_features: [
      "2 scans per month (any type, including comprehensive)",
      "25% off additional a la carte scans",
      "Access to client portal with trend tracking",
      "Priority processing (24–48 hr delivery)",
      "Monthly wellness tip + check-in note",
    ],
  },
  {
    id: "membership-unlimited",
    label: "BioHarmony Unlimited",
    price: 247,
    kind: "membership",
    period: "month",
    shortDesc: "Unlimited scans every month + premium support.",
    bestFor: "Dedicated wellness optimizers, families.",
    deliverable: "Unlimited scans, all types",
    highlight_features: [
      "Unlimited scans — any type, any time",
      "30% off pet scans and add-ons",
      "Access to client portal with lifetime history",
      "Priority processing + express delivery",
      "Quarterly 15-min check-in with Kathy",
      "Free family member onboarding",
    ],
  },
] as const;

// ─── Practitioner Plans (capped scans per month) ──────────────────────────

export const PRACTITIONER_PLANS: readonly PlanDef[] = [
  {
    id: "practitioner-solo",
    label: "Solo Practitioner",
    price: 49,
    kind: "practitioner",
    period: "month",
    shortDesc: "10 scans/month — perfect for starting out.",
    bestFor: "Individual practitioners with their own scan device.",
    highlight_features: [
      "10 scan reports per month included",
      "Additional scans $4.90 each (80% off retail)",
      "Access to BioHarmony interpretation engine",
      "Client-ready formatted reports",
      "Email support",
      "30-minute report delivery",
    ],
  },
  {
    id: "practitioner-growth",
    label: "Growth Practitioner",
    price: 79,
    kind: "practitioner",
    period: "month",
    badge: "Most Popular",
    popular: true,
    shortDesc: "25 scans/month + your brand on every report.",
    bestFor: "Growing practices who want branded client reports.",
    highlight_features: [
      "25 scan reports per month included",
      "Additional scans $3.16 each (85% off retail)",
      "White label — your brand on every report",
      "30-minute report delivery",
      "All scan types (Basic + Dental + TMJ)",
      "Priority email & chat support",
    ],
  },
  {
    id: "practitioner-elite",
    label: "Elite Practitioner",
    price: 149,
    kind: "practitioner",
    period: "month",
    shortDesc: "60 scans/month — built for high volume.",
    bestFor: "High-volume practices, wellness clinics, multi-practitioner setups.",
    highlight_features: [
      "60 scan reports per month included",
      "Additional scans $2.48 each (90% off retail)",
      "White label — your brand on every report",
      "30-minute express delivery",
      "All scan types including Dental, TMJ, Pet",
      "Multi-practitioner accounts (up to 3 users)",
      "Dedicated account manager",
      "Custom portal setup with client branding",
    ],
  },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LEGACY_PLAN_ALIASES: Record<string, string> = {
  basic: "vitals",
  advanced: "comprehensive",
  premium: "ultimate-wellness",
  "quick-wellness": "vitals",
  "emotional-balance": "inner-voice",
  "body-system-focus": "body-system",
  "complete-wellness": "comprehensive",
};

export const ALL_PLANS: readonly PlanDef[] = [
  ...INDIVIDUAL_SCANS,
  ...BUNDLE_PLANS,
  ...MEMBERSHIP_PLANS,
  ...PRACTITIONER_PLANS,
];

export const ALL_PLAN_IDS = ALL_PLANS.map((p) => p.id);
const VALID_PLAN_IDS = new Set<string>([...ALL_PLAN_IDS, ...Object.keys(LEGACY_PLAN_ALIASES)]);

export const PET_PLANS = INDIVIDUAL_SCANS.filter((p) => p.kind === "pet");

function resolvePlanId(id: string | null | undefined): string {
  if (!id) return "comprehensive";
  return LEGACY_PLAN_ALIASES[id] ?? id;
}

export function getPlan(id: string | null | undefined): PlanDef {
  const resolved = resolvePlanId(id);
  return ALL_PLANS.find((p) => p.id === resolved) ?? ALL_PLANS.find((p) => p.id === "comprehensive")!;
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

const AUDIO_PLAN_IDS = new Set([
  "ao-mindsync", "inner-voice",
  "mind-body-harmony", "ultimate-wellness", "premium-interpretation",
]);

export function planHasAudio(id: string | null | undefined): boolean {
  const resolved = resolvePlanId(id);
  return AUDIO_PLAN_IDS.has(resolved) || AUDIO_PLAN_IDS.has(id ?? "");
}

const SCORE_PLAN_IDS = new Set([
  "comprehensive", "ultimate-wellness", "premium-interpretation",
  "body-system", "oral-health-plus",
]);

export function planHasScore(id: string | null | undefined): boolean {
  const resolved = resolvePlanId(id);
  return SCORE_PLAN_IDS.has(resolved) || SCORE_PLAN_IDS.has(id ?? "");
}
