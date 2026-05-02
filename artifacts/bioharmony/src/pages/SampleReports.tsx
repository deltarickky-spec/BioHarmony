import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[#F4EFE6]/60 text-[14px] leading-relaxed">
          <span className="mt-[7px] w-1 h-1 rounded-full bg-[#BFA14A]/60 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function PriorityList({ items }: { items: Array<{ num: string; title: string; desc: string }> }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-4 bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4">
          <div className="w-7 h-7 rounded-full border border-[#BFA14A]/40 text-[#BFA14A] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
            {item.num}
          </div>
          <div>
            <p className="text-[#BFA14A] text-sm font-medium mb-0.5">{item.title}</p>
            <p className="text-[#F4EFE6]/45 text-xs leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
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

function SampleBadge() {
  return (
    <div className="flex items-center gap-2 bg-[#BFA14A]/6 border border-[#BFA14A]/18 rounded-xl px-4 py-3 mb-2">
      <Sparkles className="w-3.5 h-3.5 text-[#BFA14A]/50 shrink-0" />
      <p className="text-[#F4EFE6]/45 text-xs">
        This is a sample. Your report will be fully personalized to you.
      </p>
    </div>
  );
}

function ComplianceNote({ pet = false }: { pet?: boolean }) {
  return (
    <div className="bg-white/[0.025] border border-white/6 rounded-xl px-6 py-4">
      <p className="text-[#F4EFE6]/28 text-xs leading-relaxed text-center">
        {pet
          ? "This pet wellness report is for informational purposes only and does not constitute veterinary advice. Please consult a licensed veterinarian for any health concerns about your animal."
          : "This report is for wellness education and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. Please consult a qualified healthcare professional for any medical concerns."}
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
        className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/25 px-10 h-14 text-base shadow-[0_0_20px_rgba(191,161,74,0.28)] hover:shadow-[0_0_35px_rgba(191,161,74,0.5)] transition-all duration-300"
      >
        <Link href="/upload-scan">Get Your Personalized Report</Link>
      </Button>
    </div>
  );
}

function ClientCard({
  name, scanType, date, badge,
}: {
  name: string; scanType: string; date: string; badge?: string;
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
    <div className="space-y-7">
      <SampleBadge />
      <ClientCard
        name="Jane Doe"
        scanType="Inner Voice + Basic Vitals"
        date="January 15, 2025"
      />

      <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
        <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.9] font-serif italic">
          "Jane, as I went through your scan, a few clear patterns began to stand out. What your body is showing isn't random — it's actually communicating a very connected story between your digestion, stress response, and energy levels. This is something I see quite often, and the good news is that once we understand the pattern, we can begin supporting it in a much more targeted and gentle way."
        </p>
        <p className="text-[#BFA14A]/55 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
      </div>

      <GoldDivider />

      <div>
        <SectionLabel text="Vitals Overview" />
        <InsightBlock>
          Your basic vitals scan is reflecting what many of my clients experience — a body that's working hard but may not be recovering as efficiently as it could. Your energy production markers are slightly lower than optimal, which often shows up as afternoon fatigue or that feeling of being "on" all day but never quite rested. This is very common and very addressable.
        </InsightBlock>
      </div>

      <div>
        <SectionLabel text="Energy & Stress Patterns" />
        <InsightBlock>
          Your Inner Voice scan is picking up a consistent pattern of low-grade internal pressure — the kind that comes from staying busy, staying responsible, and not always giving yourself permission to pause. This kind of sustained mental effort has a quiet but real effect on cortisol levels and, over time, on your sleep quality and digestion.
        </InsightBlock>
      </div>

      <Callout>
        These stress and vitals patterns are closely connected. When we support the nervous system, the energy levels often follow naturally.
      </Callout>

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
    <div className="space-y-7">
      <SampleBadge />
      <ClientCard
        name="Maria Thompson"
        scanType="Comprehensive AO Scan"
        date="February 3, 2025"
        badge="Advanced Case"
      />

      <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
        <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.9] font-serif italic">
          "Hi Maria, as I reviewed your scan, your body revealed a deeper pattern that has likely been building over time. This isn't just one isolated area — it's a layered response, where your system has been adapting to ongoing stress, inflammation, and internal imbalance. What stood out most is that your body is not overwhelmed — it's actually working very hard to keep things functioning, but it's now asking for more consistent support."
        </p>
        <p className="text-[#BFA14A]/55 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
      </div>

      <GoldDivider />

      <div>
        <SectionLabel text="Emotional & Nervous System Patterns" />
        <InsightBlock>
          <p className="mb-4">There is a strong connection here between your emotional state and physical symptoms. Your scan reflects patterns often associated with:</p>
          <BulletList items={[
            "Internal pressure or emotional holding",
            "Difficulty fully switching off mentally",
            "A constant \"background stress\" in the body",
          ]} />
          <p className="mt-4">Even if you're managing well on the outside, your nervous system is staying more activated than it should long-term. Over time, this begins to affect digestion, inflammation levels, and energy production.</p>
        </InsightBlock>
      </div>

      <div>
        <SectionLabel text="What Your Body Is Showing" />
        <InsightBlock>
          <p className="mb-3">Several systems are working harder than usual, particularly:</p>
          <BulletList items={[
            "Digestive processing",
            "Inflammatory response",
            "Energy regulation",
          ]} />
          <p className="mt-4 mb-3">You may notice:</p>
          <BulletList items={[
            "Periods of low energy or burnout",
            "Sensitivity to foods that didn't bother you before",
            "Brain fog or difficulty focusing at times",
          ]} />
          <p className="mt-4 text-[#F4EFE6]/50 italic text-sm">This is not failure — it's your body adapting under load.</p>
        </InsightBlock>
      </div>

      <Callout>
        What's important here is the combination effect. When stress remains elevated, digestion slows, nutrient absorption drops, inflammation increases, and energy decreases — it creates a loop. Your scan reflects that loop clearly, but also shows that it's very workable.
      </Callout>

      <div>
        <SectionLabel text="The Deeper Pattern" />
        <InsightBlock>
          <p className="mb-4">When stress remains elevated, a cascade follows:</p>
          <div className="space-y-2">
            {[
              "Digestion slows",
              "Nutrient absorption drops",
              "Inflammation increases",
              "Energy decreases",
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#BFA14A]/60" />
                  {i < arr.length - 1 && <div className="w-px h-4 bg-[#BFA14A]/20 mt-1" />}
                </div>
                <p className="text-[#F4EFE6]/60 text-sm">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-5">Your scan reflects this loop clearly — but also shows that it's very workable. The fact that your body is communicating this now is a genuinely positive sign. It means your system is signalling early enough to shift things before deeper fatigue sets in.</p>
        </InsightBlock>
      </div>

      <GoldDivider />

      <SectionLabel text="Support Strategy — Priority Order" />
      <PriorityList items={[
        { num: "1", title: "Calm the nervous system first", desc: "This is the foundation. Without this, nothing else holds." },
        { num: "2", title: "Support digestion gently", desc: "Not aggressive — just helping your body process more efficiently." },
        { num: "3", title: "Reduce internal load", desc: "This includes food sensitivities and environmental stressors." },
        { num: "4", title: "Rebuild energy gradually", desc: "Not pushing harder — supporting smarter." },
      ]} />

      <div className="bg-[#0F5C5E]/8 border border-[#0F5C5E]/20 rounded-2xl px-6 py-5">
        <p className="text-[#F4EFE6]/65 text-[15px] leading-[1.85] font-serif italic">
          "Maria, this is a very common modern pattern — and the fact that your body is showing it now is actually a positive sign. It means your system is communicating early enough to shift things before deeper fatigue sets in. With the right approach, this kind of pattern responds very well."
        </p>
        <p className="text-[#BFA14A]/50 text-xs mt-3 font-sans not-italic">— Kathy Owens</p>
      </div>

      <GoldDivider />
      <ComplianceNote />
      <ReportCTA />
    </div>
  );
}

function BellaReport() {
  return (
    <div className="space-y-7">
      <SampleBadge />
      <ClientCard
        name="Bella"
        scanType="AO Scan — Canine Wellness"
        date="February 20, 2025"
        badge="Pet Report"
      />

      <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
        <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.9] font-serif italic">
          "As I reviewed Bella's scan, she presents as a loving, sensitive dog who is very tuned into her environment and the people around her. What stood out most is that her system is overall stable — but there are a few areas where her body is working a little harder than it should. Here's what I found, and what I'd suggest to keep her balanced, happy, and thriving."
        </p>
        <p className="text-[#BFA14A]/55 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
      </div>

      <GoldDivider />

      <div>
        <SectionLabel text="Emotional & Behavioral Signals" />
        <InsightBlock>
          <p className="mb-4">Bella shows patterns linked to:</p>
          <BulletList items={[
            "Sensitivity to surroundings and environmental changes",
            "Strong emotional connection to her owners",
            "Mild stress responses when routines change",
          ]} />
          <p className="mt-4">Dogs like Bella often pick up on emotional energy very easily — her sensitivity is actually a sign of her deep bond, but it means her nervous system can carry more than it lets on.</p>
        </InsightBlock>
      </div>

      <div>
        <SectionLabel text="Physical Observations" />
        <InsightBlock>
          <p className="mb-3">Her scan suggests focus areas around:</p>
          <BulletList items={[
            "Digestive sensitivity",
            "Mild inflammation patterns",
            "Energy fluctuations",
          ]} />
          <p className="mt-4 mb-3">You might notice:</p>
          <BulletList items={[
            "Occasional stomach upset or loose stools",
            "Changes in appetite or eating pace",
            "Slight differences in energy levels day to day",
          ]} />
        </InsightBlock>
      </div>

      <Callout>
        Bella is doing well overall — these are just small areas to support so she can stay balanced, happy, and thriving. Her emotional connection scores are among the highest I've seen.
      </Callout>

      <GoldDivider />

      <SectionLabel text="Support for Bella" />
      <RecommendationGrid items={[
        { title: "Keep Routines Consistent", desc: "Predictable feeding, walk, and sleep schedules help regulate her sensitive nervous system." },
        { title: "Support Gut Health Gently", desc: "A canine-specific probiotic or digestive enzyme with meals to reduce digestive sensitivity." },
        { title: "Ensure Hydration", desc: "Fresh, filtered water throughout the day — especially after walks and active play." },
        { title: "Provide Calm Environments", desc: "A designated quiet space and reduced noise exposure when Bella seems unsettled." },
      ]} />

      <div className="bg-[#0F5C5E]/8 border border-[#0F5C5E]/20 rounded-2xl px-6 py-5">
        <p className="text-[#F4EFE6]/65 text-[15px] leading-[1.85] font-serif italic">
          "Bella is doing well overall — these are just small areas to support so she can stay balanced, happy, and thriving. The love she has for her family shows very clearly in her scan."
        </p>
        <p className="text-[#BFA14A]/50 text-xs mt-3 font-sans not-italic">— Kathy Owens</p>
      </div>

      <GoldDivider />
      <ComplianceNote pet />
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

      <section className="py-20 border-b border-white/8">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-5">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em]">Sample Reports</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6]">See BioHarmony Interpretations in Action</h1>
            <p className="text-lg text-[#F4EFE6]/50 leading-relaxed max-w-xl mx-auto">
              These are real examples of how we translate complex scan data into clear, personalized insight.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">

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
