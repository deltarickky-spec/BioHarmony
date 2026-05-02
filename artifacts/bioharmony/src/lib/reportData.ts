export interface SupportItem {
  title: string;
  desc: string;
}

export interface ReportSections {
  overview: string;
  emotionalPatterns: string;
  bodyInsights: string;
  supportFocus: SupportItem[];
  closing: string;
}

export interface ReportData {
  clientName: string;
  scanType: string;
  date: string;
  reportType: string;
  sections: ReportSections;
}

export const REPORT_DATA: Record<"jane" | "maria" | "bella", ReportData> = {
  jane: {
    clientName: "Jane Doe",
    scanType: "Inner Voice + Basic Vitals",
    date: "January 15, 2025",
    reportType: "Basic Report",
    sections: {
      overview:
        "Jane, as I went through your scan, a few clear patterns began to stand out. What your body is showing isn't random — it's actually communicating a very connected story between your digestion, stress response, and energy levels. This is something I see quite often, and the good news is that once we understand the pattern, we can begin supporting it in a much more targeted and gentle way.",
      emotionalPatterns:
        "Your Inner Voice scan is picking up a consistent pattern of low-grade internal pressure — the kind that comes from staying busy, staying responsible, and not always giving yourself permission to pause. This kind of sustained mental effort has a quiet but real effect on cortisol levels and, over time, on your sleep quality and digestion. Even when you feel like you're coping well, your nervous system is telling a different story.",
      bodyInsights:
        "Your basic vitals scan is reflecting what many of my clients experience — a body that's working hard but may not be recovering as efficiently as it could. Your energy production markers are slightly lower than optimal, which often shows up as afternoon fatigue or that feeling of being \"on\" all day but never quite rested. Your scan is also showing some mild digestive sluggishness, frequently tied to the stress response your body has been carrying.",
      supportFocus: [
        { title: "Morning Hydration Ritual", desc: "16 oz of warm lemon water before anything else to activate gentle digestive movement." },
        { title: "Nervous System Wind-Down", desc: "5 minutes of slow diaphragmatic breathing before bed to shift into parasympathetic recovery." },
        { title: "Digestive Support", desc: "Consider a quality probiotic and reduce cold/raw foods in the evenings." },
        { title: "SEFI Frequency Support", desc: "Stress-reduction and energy-balancing frequency sessions aligned with your scan markers." },
      ],
      closing:
        "Jane, these patterns are very workable. When we support the nervous system first, the energy levels and digestion often follow naturally. I'm here to guide you through each step at a pace that feels sustainable and gentle for your body.",
    },
  },

  maria: {
    clientName: "Maria Thompson",
    scanType: "Comprehensive AO Scan",
    date: "February 3, 2025",
    reportType: "Advanced Case",
    sections: {
      overview:
        "Hi Maria, as I reviewed your scan, your body revealed a deeper pattern that has likely been building over time. This isn't just one isolated area — it's a layered response, where your system has been adapting to ongoing stress, inflammation, and internal imbalance. What stood out most is that your body is not overwhelmed — it's actually working very hard to keep things functioning, but it's now asking for more consistent support.",
      emotionalPatterns:
        "There is a strong connection between your emotional state and physical symptoms. Your scan reflects patterns often associated with internal pressure or emotional holding, difficulty fully switching off mentally, and a constant \"background stress\" in the body. Even if you're managing well on the outside, your nervous system is staying more activated than it should long-term. Over time, this begins to affect digestion, inflammation levels, and energy production.",
      bodyInsights:
        "Several systems are working harder than usual, particularly digestive processing, inflammatory response, and energy regulation. You may notice periods of low energy or burnout, sensitivity to foods that didn't bother you before, and brain fog or difficulty focusing at times. This is not failure — it's your body adapting under load. When stress remains elevated, digestion slows, nutrient absorption drops, inflammation increases, and energy decreases — creating a loop your scan reflects clearly.",
      supportFocus: [
        { title: "1. Calm the Nervous System First", desc: "This is the foundation. Without this, nothing else holds. Prioritize parasympathetic rest daily." },
        { title: "2. Support Digestion Gently", desc: "Not aggressive — just helping your body process more efficiently with enzymes and easy-to-digest foods." },
        { title: "3. Reduce Internal Load", desc: "Address food sensitivities and environmental stressors to lighten the body's daily burden." },
        { title: "4. Rebuild Energy Gradually", desc: "Not pushing harder — supporting smarter with adaptogens, sleep rhythm, and targeted frequency sessions." },
      ],
      closing:
        "Maria, this is a very common modern pattern — and the fact that your body is showing it now is actually a positive sign. It means your system is communicating early enough to shift things before deeper fatigue sets in. With the right approach, this kind of pattern responds very well. I'm genuinely encouraged by what I see.",
    },
  },

  bella: {
    clientName: "Bella",
    scanType: "AO Scan — Canine Wellness",
    date: "February 20, 2025",
    reportType: "Pet Report",
    sections: {
      overview:
        "As I reviewed Bella's scan, she presents as a loving, sensitive dog who is very tuned into her environment and the people around her. What stood out most is that her system is overall stable — but there are a few areas where her body is working a little harder than it should. Here's what I found, and what I'd suggest to keep her balanced, happy, and thriving.",
      emotionalPatterns:
        "Bella shows patterns linked to sensitivity to surroundings and environmental changes, a strong emotional connection to her owners, and mild stress responses when routines change. Dogs like Bella often pick up on emotional energy very easily — her sensitivity is actually a sign of her deep bond, but it means her nervous system can carry more than it lets on. Her emotional connection scores are among the highest I've seen.",
      bodyInsights:
        "Her scan suggests focus areas around digestive sensitivity, mild inflammation patterns, and energy fluctuations. You might notice occasional stomach upset or loose stools, changes in appetite or eating pace, and slight differences in energy levels day to day. Overall, Bella's vitality markers are reading well — she has strong life-force energy and her cellular communication looks vibrant.",
      supportFocus: [
        { title: "Keep Routines Consistent", desc: "Predictable feeding, walk, and sleep schedules help regulate her sensitive nervous system." },
        { title: "Support Gut Health Gently", desc: "A canine-specific probiotic or digestive enzyme with meals to reduce digestive sensitivity." },
        { title: "Ensure Hydration", desc: "Fresh, filtered water throughout the day — especially after walks and active play." },
        { title: "Provide Calm Environments", desc: "A designated quiet space and reduced noise exposure when Bella seems unsettled." },
      ],
      closing:
        "Bella is doing well overall — these are just small areas to support so she can stay balanced, happy, and thriving. The love she has for her family shows very clearly in her scan. With a little extra attention to routine and gut health, she will continue to thrive beautifully.",
    },
  },
};
