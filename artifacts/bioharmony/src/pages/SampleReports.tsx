import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const tabFade = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-8">
      <div className="flex-1 h-px bg-white/6" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A]/40" />
      <div className="flex-1 h-px bg-white/6" />
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-5 rounded-full bg-[#BFA14A]" />
      <h3 className="font-serif text-lg text-[#BFA14A]">{text}</h3>
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#F4EFE6]/65 text-[15px] leading-[1.85]">{children}</p>
  );
}

function InsightBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-5 text-[#F4EFE6]/65 text-[15px] leading-[1.85]">
      {children}
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[#BFA14A]/45 pl-5 py-0.5">
      <p className="text-[#F4EFE6]/60 text-[14px] italic font-serif leading-relaxed">"{children}"</p>
    </div>
  );
}

function RecommendationGrid({ items }: { items: Array<{ title: string; desc: string }> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((r, i) => (
        <div key={i} className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4 hover:border-[#BFA14A]/20 transition-colors duration-200">
          <p className="text-[#BFA14A] text-sm font-medium mb-1">{r.title}</p>
          <p className="text-[#F4EFE6]/45 text-xs leading-relaxed">{r.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ComplianceNote() {
  return (
    <div className="bg-white/[0.025] border border-white/6 rounded-xl px-6 py-4">
      <p className="text-[#F4EFE6]/28 text-xs leading-relaxed text-center">
        This report is for wellness education and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. Please consult a qualified healthcare professional for any medical concerns.
      </p>
    </div>
  );
}

function ReportCTA() {
  return (
    <div className="pt-4 pb-2 flex flex-col items-center gap-4 text-center">
      <p className="text-[#F4EFE6]/40 text-sm">Ready to see your own results interpreted like this?</p>
      <Button
        asChild
        size="lg"
        className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/25 px-10 h-13 text-base shadow-[0_0_20px_rgba(191,161,74,0.28)] hover:shadow-[0_0_35px_rgba(191,161,74,0.5)] transition-all duration-300"
      >
        <Link href="/upload-scan">Get Your Personalized Report</Link>
      </Button>
    </div>
  );
}

function ClientCard({
  name,
  scanType,
  date,
  badge,
}: {
  name: string;
  scanType: string;
  date: string;
  badge?: string;
}) {
  return (
    <div className="bg-white/[0.045] border border-[#BFA14A]/18 rounded-2xl px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_40px_rgba(191,161,74,0.06)]">
      <div className="space-y-1">
        <p className="text-[#F4EFE6]/35 text-[10px] uppercase tracking-widest">Client</p>
        <p className="font-serif text-2xl text-[#F4EFE6]">{name}</p>
        {badge && (
          <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-[#0F5C5E] border border-[#0F5C5E]/40 rounded-full px-3 py-0.5">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col sm:items-end gap-1">
        <p className="text-[#BFA14A] text-sm font-medium">{scanType}</p>
        <p className="text-[#F4EFE6]/30 text-xs">{date}</p>
      </div>
    </div>
  );
}

function JaneDoeReport() {
  return (
    <div className="space-y-8">
      <ClientCard
        name="Jane Doe"
        scanType="Inner Voice + Basic Vitals"
        date="January 15, 2025"
      />

      {/* Opening narrative */}
      <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
        <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.9] font-serif italic">
          "Jane, as I went through your scan, a few clear patterns began to stand out. What your body is showing isn't random — it's actually communicating a very connected story between your digestion, stress response, and energy levels. This is something I see quite often, and the good news is that once we understand the pattern, we can begin supporting it in a much more targeted and gentle way."
        </p>
        <p className="text-[#BFA14A]/55 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
      </div>

      <GoldDivider />

      {/* Vitals overview */}
      <div>
        <SectionLabel text="Vitals Overview" />
        <InsightBlock>
          Your basic vitals scan is reflecting what many of my clients experience — a body that's working hard but may not be recovering as efficiently as it could. Your energy production markers are slightly lower than optimal, which often shows up as afternoon fatigue or that feeling of being "on" all day but never quite rested. This is very common and very addressable.
        </InsightBlock>
      </div>

      {/* Energy & stress */}
      <div>
        <SectionLabel text="Energy & Stress Patterns" />
        <InsightBlock>
          Your Inner Voice scan is picking up a consistent pattern of low-grade internal pressure — the kind that comes from staying busy, staying responsible, and not always giving yourself permission to pause. This kind of sustained mental effort has a quiet but real effect on cortisol levels and, over time, on your sleep quality and digestion.
        </InsightBlock>
      </div>

      <Callout>
        These stress and vitals patterns are closely connected. When we support the nervous system, the energy levels often follow naturally.
      </Callout>

      {/* Digestive connection */}
      <div>
        <SectionLabel text="Digestive Connection" />
        <InsightBlock>
          Your scan is also showing some mild digestive sluggishness — this can feel like bloating after meals, inconsistent energy after eating, or a general sense that your gut isn't quite as happy as it could be. This is frequently tied to the stress response your body has been carrying.
        </InsightBlock>
      </div>

      <GoldDivider />

      <SectionLabel text="Wellness Recommendations" />
      <RecommendationGrid items={[
        { title: "Morning Hydration Ritual", desc: "16 oz of warm lemon water before anything else to activate gentle digestive movement." },
        { title: "Nervous System Wind-Down", desc: "5 minutes of slow diaphragmatic breathing before bed to shift into parasympathetic recovery." },
        { title: "Digestive Support", desc: "Consider a quality probiotic and reduce cold/raw foods in the evenings." },
        { title: "SEFI Frequency Support", desc: "Stress-reduction and energy-balancing frequency sessions aligned with your scan markers." },
      ]} />

      <GoldDivider />
      <ComplianceNote />
      <ReportCTA />
    </div>
  );
}

function MariaThompsonReport() {
  return (
    <div className="space-y-8">
      <ClientCard
        name="Maria Thompson"
        scanType="Comprehensive AO Scan"
        date="February 3, 2025"
        badge="Advanced Case"
      />

      {/* Opening narrative */}
      <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
        <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.9] font-serif italic">
          "Maria, your comprehensive scan paints a rich picture — one I find genuinely fascinating. There are several systems in your body that are clearly in conversation with each other, and the patterns I'm seeing suggest that your body has been trying very hard to keep things balanced under pressure. The encouraging part? Everything I'm seeing is workable. Let me walk you through it."
        </p>
        <p className="text-[#BFA14A]/55 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
      </div>

      <GoldDivider />

      {/* Digestive */}
      <div>
        <SectionLabel text="Digestive & Absorption Patterns" />
        <InsightBlock>
          Your scan is showing moderate disruption in digestive enzyme activity and nutrient absorption — particularly in the small intestine region. This can manifest as inconsistent energy after meals, occasional bloating, and a sense that even when you eat well, your body isn't fully utilizing what you're giving it. The liver markers are also slightly elevated in terms of workload, suggesting your detox pathways would benefit from gentle support.
        </InsightBlock>
      </div>

      {/* Hormonal */}
      <div>
        <SectionLabel text="Hormonal Balance Indicators" />
        <InsightBlock>
          Your hormonal markers — particularly around the thyroid and adrenal axis — show a pattern I see frequently in high-functioning women who carry significant daily load. The thyroid scan isn't flagging anything acute, but it does suggest your thyroid is working at the lower edge of its optimal range. Combined with the adrenal indicators, this creates the classic pattern of "tired but wired" — difficulty truly resting even when exhausted.
        </InsightBlock>
      </div>

      <Callout>
        The adrenal-thyroid-digestive triangle is one of the most common patterns I see. Supporting one tends to create positive momentum across all three.
      </Callout>

      {/* Emotional */}
      <div>
        <SectionLabel text="Emotional Stress Profile" />
        <InsightBlock>
          Your Inner Voice data is particularly interesting. The dominant emotional frequencies your voice is reflecting are consistent with unresolved perfectionism, the need to be needed, and difficulty delegating or letting go of control. This isn't a criticism — it's actually a deeply compassionate pattern that comes from caring deeply. But your body is asking you to let it rest more than it has been.
        </InsightBlock>
      </div>

      {/* Nervous system */}
      <div>
        <SectionLabel text="Nervous System & Sleep Quality" />
        <InsightBlock>
          Your nervous system scan is showing a consistent lean toward sympathetic dominance — your fight-or-flight response is more activated than it should be at baseline. This affects everything from sleep quality to immune response to how well your gut moves. The good news is that this is highly responsive to frequency support, breathwork, and targeted lifestyle adjustments.
        </InsightBlock>
      </div>

      <GoldDivider />

      <SectionLabel text="Wellness Recommendations" />
      <RecommendationGrid items={[
        { title: "Liver & Detox Support", desc: "Milk thistle, dandelion root tea, and reducing processed foods for 30 days to ease hepatic load." },
        { title: "Thyroid Nourishment", desc: "Selenium-rich foods (Brazil nuts), iodine support, and minimizing fluoride exposure where possible." },
        { title: "Adrenal Recovery Protocol", desc: "Adaptogenic herbs (ashwagandha or rhodiola), no caffeine before 10am, and consistent sleep/wake times." },
        { title: "Gut Microbiome Restoration", desc: "Rotating fermented foods, prebiotic fiber, and a quality multi-strain probiotic with meals." },
        { title: "Nervous System Reset", desc: "Daily parasympathetic practices: gentle yoga, cold-warm shower contrast, or Yoga Nidra before sleep." },
        { title: "SEFI Comprehensive Sessions", desc: "Multi-system frequency support series targeting adrenal, thyroid, and digestive markers from your scan." },
      ]} />

      <GoldDivider />
      <ComplianceNote />
      <ReportCTA />
    </div>
  );
}

function BellaReport() {
  return (
    <div className="space-y-8">
      <ClientCard
        name="Bella"
        scanType="AO Scan — Canine Wellness"
        date="February 20, 2025"
        badge="Pet Report"
      />

      {/* Opening narrative */}
      <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
        <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.9] font-serif italic">
          "Bella's scan gave us a beautiful window into how her body is functioning right now. At 5 years old, she's in a great stage of life — energetic, emotionally connected, and generally thriving. That said, her scan did reveal a few patterns worth addressing gently. Here's what I found, and what I'd suggest to keep her feeling her absolute best."
        </p>
        <p className="text-[#BFA14A]/55 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
      </div>

      <GoldDivider />

      {/* Digestive & nutritional */}
      <div>
        <SectionLabel text="Digestive & Nutritional Patterns" />
        <InsightBlock>
          Bella's digestive scan is showing moderate enzyme activity — her gut is functional and healthy overall, but there are markers suggesting she may not be absorbing certain nutrients as efficiently as possible. This is common in dogs who eat primarily dry kibble, as the highly processed nature of commercial pet food can over time reduce the natural enzymatic activity in the digestive tract. Adding digestive enzymes or rotating in some whole food additions could make a noticeable difference.
        </InsightBlock>
      </div>

      {/* Energetic vitality */}
      <div>
        <SectionLabel text="Energetic Vitality Markers" />
        <InsightBlock>
          Bella's vitality markers are reading well — she has strong life-force energy and her cellular communication looks vibrant. There is one area worth noting: her joint tissue markers show the very early signs of wear that are normal for a 5-year-old active dog, but which are worth supporting now before they become more pronounced. Proactive joint support now can make a significant difference in her comfort and mobility at 8–10 years old.
        </InsightBlock>
      </div>

      <Callout>
        Bella's energy and emotional connection scores are among the highest I've seen. She is deeply bonded to her family and that shows clearly in her scan.
      </Callout>

      {/* Stress & emotional */}
      <div>
        <SectionLabel text="Stress & Emotional Balance" />
        <InsightBlock>
          Her emotional frequency markers are showing a gentle but consistent undercurrent of environmental stress — likely related to household changes, separation patterns, or noise sensitivity. This is very common in highly bonded dogs. Her nervous system is coping well, but providing more consistent daily rhythm and some targeted calming support could help her feel even more settled and secure.
        </InsightBlock>
      </div>

      <GoldDivider />

      <SectionLabel text="Wellness Recommendations" />
      <RecommendationGrid items={[
        { title: "Digestive Enzyme Support", desc: "Add a canine-specific digestive enzyme supplement to her meals to improve nutrient absorption." },
        { title: "Joint & Mobility Care", desc: "Introduce omega-3 fish oil and a quality glucosamine/chondroitin supplement proactively." },
        { title: "Calming Routine Support", desc: "Consistent daily schedule, a calming herbal supplement (valerian or chamomile blend for dogs), and a safe den space." },
        { title: "SEFI Pet Frequency Sessions", desc: "Gentle pet-adapted frequency support targeting her digestive and stress markers from the scan." },
      ]} />

      <GoldDivider />

      <div className="bg-white/[0.025] border border-white/6 rounded-xl px-6 py-4">
        <p className="text-[#F4EFE6]/28 text-xs leading-relaxed text-center">
          This pet wellness report is for informational purposes only and does not constitute veterinary advice. Please consult a licensed veterinarian for any health concerns about your animal.
        </p>
      </div>

      <ReportCTA />
    </div>
  );
}

const TABS = [
  { id: "jane", label: "Basic Report", sub: "Jane Doe" },
  { id: "maria", label: "Advanced Case", sub: "Maria Thompson" },
  { id: "bella", label: "Pet Report", sub: "Bella" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SampleReports() {
  const [activeTab, setActiveTab] = useState<TabId>("jane");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">

      {/* Page header */}
      <section className="py-20 border-b border-white/8">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-5">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em]">Sample Reports</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6]">See BioHarmony Interpretations in Action</h1>
            <p className="text-lg text-[#F4EFE6]/50 leading-relaxed max-w-xl mx-auto">
              Three real-world examples of how we translate complex AO Scan data into warm, clear, and actionable personal insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-16 flex-1">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">

          {/* Tab switcher */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-10">
            <div className="inline-flex w-full bg-white/[0.03] border border-white/8 rounded-2xl p-1.5 gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200 text-center
                    ${activeTab === tab.id
                      ? "bg-[#0C1919] border border-[#BFA14A]/25 shadow-[0_2px_16px_rgba(0,0,0,0.4)]"
                      : "hover:bg-white/[0.03]"
                    }
                  `}
                >
                  <span className={`text-sm font-medium transition-colors duration-200 ${activeTab === tab.id ? "text-[#BFA14A]" : "text-[#F4EFE6]/45"}`}>
                    {tab.label}
                  </span>
                  <span className={`text-xs mt-0.5 transition-colors duration-200 ${activeTab === tab.id ? "text-[#F4EFE6]/50" : "text-[#F4EFE6]/25"}`}>
                    {tab.sub}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Report content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabFade}
              className="bg-white/[0.025] border border-white/8 rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.4)]"
            >
              {activeTab === "jane" && <JaneDoeReport />}
              {activeTab === "maria" && <MariaThompsonReport />}
              {activeTab === "bella" && <BellaReport />}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

    </div>
  );
}
