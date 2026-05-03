export const WELLNESS_TAGS = [
  "stress",
  "digestion",
  "sleep",
  "inflammation",
  "hormones",
  "energy",
] as const;

export type WellnessTag = (typeof WELLNESS_TAGS)[number];

const TAG_RULES: Array<{ tag: WellnessTag; pattern: RegExp }> = [
  {
    tag: "stress",
    pattern: /stress|anxi|tension|overwhelm|burnout|nervous|worry|pressure|panic|cortisol|mental/i,
  },
  {
    tag: "digestion",
    pattern: /digest|gut|stomach|bloat|ibs|constipat|diarr|bowel|nausea|gastro|acid.?reflux|crohn|colitis|leaky.?gut|food.?sensitiv/i,
  },
  {
    tag: "sleep",
    pattern: /sleep|insomnia|fatigue|wak(e|ing)|night.?sweat|drowsy|melatonin|rest(less)?|circadian/i,
  },
  {
    tag: "inflammation",
    pattern: /inflam|joint|arthritis|autoimmun|swelling|chronic.?pain|fibromyalgia|lupus|rheumat|eczema|psoriasis/i,
  },
  {
    tag: "hormones",
    pattern: /hormon|thyroid|adrenal|menopaus|perimenopaus|period|pms|pmdd|estrogen|testosterone|cortisol|insulin|diabet|cycle|progesterone|fertility|libido/i,
  },
  {
    tag: "energy",
    pattern: /\benergy\b|exhaust|lethargy|vitality|sluggish|brain.?fog|focus|concentrat|adrenal.?fatigue|low.?energy|chronic.?fatigue|cfs/i,
  },
];

const REPORT_TYPE_HINTS: Partial<Record<string, WellnessTag[]>> = {
  inner_voice: ["stress", "energy"],
  aura_scan: ["energy", "stress"],
  full_body_scan: ["inflammation", "energy"],
  cellular_scan: ["inflammation", "energy"],
  emotional_scan: ["stress", "hormones"],
};

/**
 * Infer wellness tags from the submission note and report type.
 * Returns an array of matched tags (may be empty for pet scans or minimal notes).
 */
export function inferTags(
  note: string | null | undefined,
  reportType: string | null | undefined,
): WellnessTag[] {
  const tags = new Set<WellnessTag>();

  const text = (note ?? "").toLowerCase();

  for (const { tag, pattern } of TAG_RULES) {
    if (pattern.test(text)) {
      tags.add(tag);
    }
  }

  if (reportType && tags.size === 0) {
    const hints = REPORT_TYPE_HINTS[reportType];
    if (hints) {
      for (const h of hints) tags.add(h);
    }
  }

  return Array.from(tags);
}
