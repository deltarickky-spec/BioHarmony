import type { ReportData } from "./reportData";

export function buildNarrationScript(data: ReportData): string {
  const { clientName, reportType, sections } = data;

  const supportLines = sections.supportFocus
    .map((item, i) => `${i + 1}. ${item.title}. ${item.desc}`)
    .join("\n\n");

  return `Welcome to BioHarmony Analytics.

This is your ${reportType} wellness interpretation report for ${clientName}, prepared by Kathy Owens.

Overview.

${sections.overview}

Emotional Patterns.

${sections.emotionalPatterns}

Body Insights.

${sections.bodyInsights}

Your Support Focus.

${supportLines}

A closing note from Kathy.

${sections.closing}

Thank you for trusting BioHarmony Analytics with your wellness journey. This report was prepared with care by Kathy Owens, Founder of BioHarmony Analytics.`;
}
