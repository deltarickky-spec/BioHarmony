import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { DownloadReportButton } from "@/components/DownloadReportButton";
import { REPORT_DATA } from "@/lib/reportData";
import { ReportAudioPlayer } from "@/components/ReportAudioPlayer";
import { buildNarrationScript } from "@/lib/narrationScript";
import { BioHarmonyScore } from "@/components/BioHarmonyScore";

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
    <div className="flex items-center gap-3 my-9">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#BFA14A]/25 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A]/50" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#BFA14A]/25 to-transparent" />
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-0.5 h-5 rounded-full bg-[#BFA14A]" />
      <h3 className="font-serif text-lg text-[#BFA14A]">{text}</h3>
    </div>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#F4EFE6]/68 text-[15px] leading-[1.92] mb-5 last:mb-0">
      {children}
    </p>
  );
}

function NarrativeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-6 space-y-0">
      {children}
    </div>
  );
}

function PractitionerNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0F5C5E]/10 border border-[#0F5C5E]/25 rounded-2xl px-7 py-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/3 blur-[70px] rounded-full pointer-events-none" />
      <p className="text-[#F4EFE6]/78 text-[15px] leading-[1.9] font-serif italic">
        {children}
      </p>
      <p className="text-[#BFA14A]/50 text-xs mt-4 font-sans not-italic">— Kathy Owens, Bio-Frequency Analytics</p>
    </div>
  );
}

function ClientCard({ name, scanType, date, badge }: {
  name: string; scanType: string; date: string; badge?: string;
}) {
  return (
    <div className="bg-white/[0.045] border border-[#BFA14A]/18 rounded-2xl px-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_40px_rgba(191,161,74,0.06)]">
      <div className="space-y-1">
        <p className="text-[#F4EFE6]/30 text-[10px] uppercase tracking-widest">Client</p>
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

function SampleBadge() {
  return (
    <div className="flex items-center gap-2.5 bg-[#BFA14A]/6 border border-[#BFA14A]/18 rounded-xl px-4 py-3">
      <Sparkles className="w-3.5 h-3.5 text-[#BFA14A]/60 shrink-0" />
      <p className="text-[#F4EFE6]/55 text-xs font-medium">
        This is a sample. Your report will be fully personalized to you.
      </p>
    </div>
  );
}

function ComplianceNote({ pet = false }: { pet?: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/6 rounded-xl px-6 py-4">
      <p className="text-[#F4EFE6]/25 text-xs leading-relaxed text-center">
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
      <p className="text-[#F4EFE6]/38 text-sm italic">
        This is a sample report. Your results will be fully personalized based on your scan.
      </p>
      <Link
        href="/upload-scan"
        className="inline-flex items-center gap-2.5 px-10 h-14 rounded-full bg-[#0F5C5E] text-[#F4EFE6] text-base font-semibold border border-[#BFA14A]/25 shadow-[0_0_20px_rgba(191,161,74,0.22)] hover:shadow-[0_0_40px_rgba(191,161,74,0.45)] hover:bg-[#0F5C5E]/85 transition-all duration-300"
      >
        Get Your Personalized Report
        <span className="text-[#BFA14A]">→</span>
      </Link>
    </div>
  );
}

function JaneDoeReport() {
  return (
    <div className="space-y-7">
      <SampleBadge />
      <ClientCard
        name="Jane Doe"
        scanType="Comprehensive AO Scan"
        date="January 15, 2025"
        badge="Basic Human Sample"
      />

      <BioHarmonyScore
        score={72}
        breakdown={[
          { label: "Stress Load", value: 65 },
          { label: "Energy Balance", value: 78 },
          { label: "System Alignment", value: 71 },
          { label: "Recovery Capacity", value: 74 },
        ]}
      />

      <PractitionerNote>
        "Jane, as I went through your scan, a few clear patterns began to stand out. What your body is showing isn't random — it's communicating a very connected story between your digestion, stress response, and energy levels. This is something I see quite often, and the good news is that once we understand the pattern, we can begin supporting it in a much more targeted and gentle way."
      </PractitionerNote>

      <GoldDivider />

      <div>
        <SectionLabel text="Vitals Overview" />
        <NarrativeBlock>
          <Paragraph>
            Your basic vitals scan is reflecting what many of my clients experience — a body that is working hard but may not be recovering as efficiently as it could. Your energy production markers are slightly lower than optimal, which often shows up as afternoon fatigue or that persistent feeling of being "on" all day but never quite rested. This is very common and very addressable. The pattern here isn't a red flag; it's your body asking for a little more support than it's currently receiving.
          </Paragraph>
          <Paragraph>
            What's worth noting is that your body's baseline resilience is present — the signals we're seeing aren't coming from a place of collapse but from a place of sustained effort. That distinction matters because it tells us the threshold for improvement is much lower than it might feel from the inside.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <div>
        <SectionLabel text="Energy &amp; Stress Patterns" />
        <NarrativeBlock>
          <Paragraph>
            Your Inner Voice scan is picking up a consistent pattern of low-grade internal pressure — the kind that comes from staying busy, staying responsible, and not always giving yourself permission to pause. This kind of sustained mental effort has a quiet but real effect on cortisol levels and, over time, on your sleep quality and digestive comfort.
          </Paragraph>
          <Paragraph>
            The stress response showing in your scan is not acute — it's chronic and quiet, which actually makes it harder to notice from the inside. You may have adapted to it so gradually that it now feels like your normal baseline. But your scan suggests there's a calmer, more spacious version of "normal" available to you, and it's closer than it might seem.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <div>
        <SectionLabel text="Digestive Connection" />
        <NarrativeBlock>
          <Paragraph>
            Your scan is also showing some mild digestive sluggishness — this can feel like bloating after meals, inconsistent energy following food, or a general sense that your gut isn't quite as happy as it could be. This is frequently tied to the stress response your body has been carrying. The gut and the nervous system are in constant communication, and when one is under strain, the other usually reflects it.
          </Paragraph>
          <Paragraph>
            The digestive pattern here is mild and responsive — meaning it's the kind of imbalance that tends to shift quite noticeably when the nervous system gets proper support. Rather than treating the gut in isolation, the most effective approach is usually to address both systems together, which is exactly what a personalized BioHarmony protocol is designed to do.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <GoldDivider />

      <div>
        <SectionLabel text="Recommended Focus Areas" />
        <NarrativeBlock>
          <Paragraph>
            Based on what your scan is showing, the three most impactful places to direct your attention are your nervous system, your gut microbiome, and your sleep architecture — in that order. These systems are deeply interconnected, and meaningful progress in one typically creates positive momentum in the others.
          </Paragraph>
          <Paragraph>
            For nervous system support, morning hydration and five minutes of slow diaphragmatic breathing before bed are deceptively simple but genuinely effective starting points. For digestive health, a quality probiotic and reducing cold or raw foods in the evening can make a noticeable difference within two to three weeks. And for sleep, reducing blue light exposure after 9pm and anchoring a consistent wake time are among the highest-leverage changes available to you right now.
          </Paragraph>
          <Paragraph>
            SEFI frequency support — stress-reduction and energy-balancing sessions aligned with your specific scan markers — would be a strong complement to these lifestyle adjustments, and something we would build into your personalized protocol.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <GoldDivider />
      <ReportAudioPlayer
        cacheKey="jane"
        scriptText={buildNarrationScript(REPORT_DATA.jane)}
        clientName="Jane Doe"
      />
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
        scanType="Advanced BioHarmony Interpretation"
        date="February 3, 2025"
        badge="Advanced Human Case"
      />

      <BioHarmonyScore
        score={58}
        breakdown={[
          { label: "Stress Load", value: 48 },
          { label: "Energy Balance", value: 62 },
          { label: "System Alignment", value: 55 },
          { label: "Recovery Capacity", value: 67 },
        ]}
      />

      <PractitionerNote>
        "Hi Maria, as I reviewed your scan, your body revealed a deeper pattern that has likely been building over time. This isn't just one isolated area — it's a layered response, where your system has been adapting to ongoing stress, inflammation, and internal imbalance. What stood out most is that your body is not overwhelmed — it's actually working very hard to keep things functioning, but it's now asking for more consistent support."
      </PractitionerNote>

      <GoldDivider />

      <div>
        <SectionLabel text="Emotional &amp; Nervous System Patterns" />
        <NarrativeBlock>
          <Paragraph>
            There is a strong and clear connection in your scan between your emotional state and your physical symptoms. The patterns showing up in your nervous system frequency bands are consistent with a body that has been operating in a state of sustained internal pressure — not dramatic or acute, but persistent and cumulative. This often presents as difficulty fully switching off mentally, a sense of background tension that follows you even into rest, and a feeling of being "on call" even when nothing is urgent.
          </Paragraph>
          <Paragraph>
            Even if you're managing well on the outside — and your scan suggests you likely are — your nervous system is staying more activated than it should over the long term. This isn't a character flaw or a sign of weakness. It's a physiological pattern that builds gradually and quietly, and it's one that responds very well to the right kind of support. The fact that it's showing up clearly in your scan is actually useful — it means we can work with it deliberately.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <div>
        <SectionLabel text="The Cascade Effect" />
        <NarrativeBlock>
          <Paragraph>
            When the nervous system stays elevated over time, a cascade of downstream effects tends to follow. Digestion slows because the body deprioritises it during sustained activation. Nutrient absorption drops as a result. Inflammatory processes become harder for the body to regulate, and energy production becomes less efficient. Your scan reflects this cascade quite clearly — each of these systems is showing signs of working harder than it should.
          </Paragraph>
          <Paragraph>
            You may notice this as periods of low energy that don't resolve with rest, sensitivity to foods that didn't bother you before, occasional brain fog or difficulty holding focus, and a general sense of running below your own potential. These experiences are not random. They are connected, and they are telling a consistent story. The important thing to understand is that because they share a common root, addressing that root tends to create improvement across multiple areas at once — which is what makes this kind of comprehensive scan so valuable.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <div>
        <SectionLabel text="Inflammation &amp; Digestive Frequency" />
        <NarrativeBlock>
          <Paragraph>
            Your comprehensive scan shows notable disruption in the inflammatory and digestive frequency bands. This doesn't mean we're looking at a clinical diagnosis — frequency readings and conventional bloodwork measure different things — but it does suggest these systems are under elevated energetic load. Left unaddressed, this kind of pattern can become measurable through conventional testing over time. At this stage, we have an opportunity to support these systems proactively rather than reactively.
          </Paragraph>
          <Paragraph>
            The digestive disruption in particular is worth prioritising. When the gut is not processing and absorbing efficiently, even a clean diet and quality supplementation may not be delivering their full benefit. Restoring digestive coherence is often a foundational step that makes everything else work better — sleep, energy, mood, hormonal balance, and immune resilience all have roots in gut health.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <GoldDivider />

      <div>
        <SectionLabel text="Support Strategy — Priority Order" />
        <NarrativeBlock>
          <Paragraph>
            Given the interconnected nature of what your scan is showing, the most effective approach is phased and sequenced rather than trying to address everything at once. The first and most important priority is calming the nervous system. This is the foundation — without reducing the baseline level of physiological activation, the other systems tend to keep reverting. Once the nervous system has more breathing room, digestion can begin to normalise, inflammation becomes easier for the body to manage, and energy production improves.
          </Paragraph>
          <Paragraph>
            The second priority is gentle digestive support — not aggressive protocols, but targeted assistance to help your body process more efficiently and absorb what it needs. The third priority is reducing the internal load more broadly, which includes identifying any food sensitivities contributing to the inflammatory pattern, and minimising environmental stressors where possible. The fourth priority, which tends to follow naturally from the first three, is gradual energy rebuilding — not by pushing harder, but by removing the drains on your system so that your natural vitality can surface.
          </Paragraph>
          <Paragraph>
            Maria, this is a very common modern pattern — and the fact that your body is showing it now is actually a positive sign. It means your system is communicating early enough to shift things before deeper fatigue sets in. With the right approach, this kind of pattern responds very well.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <GoldDivider />
      <ReportAudioPlayer
        cacheKey="maria"
        scriptText={buildNarrationScript(REPORT_DATA.maria)}
        clientName="Maria Thompson"
      />
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
        scanType="Pet Wellness Scan"
        date="February 20, 2025"
        badge="Pet Report Sample"
      />

      <BioHarmonyScore
        score={76}
        breakdown={[
          { label: "Stress Load", value: 72 },
          { label: "Energy Balance", value: 80 },
          { label: "System Alignment", value: 74 },
          { label: "Recovery Capacity", value: 78 },
        ]}
      />

      <PractitionerNote>
        "As I reviewed Bella's scan, she presents as a loving, sensitive dog who is very tuned into her environment and the people around her. What stood out most is that her system is overall stable — but there are a few areas where her body is working a little harder than it should. Here's what I found, and what I'd suggest to keep her balanced, happy, and thriving."
      </PractitionerNote>

      <GoldDivider />

      <div>
        <SectionLabel text="Emotional &amp; Behavioral Signals" />
        <NarrativeBlock>
          <Paragraph>
            Bella shows a strong and beautiful energetic connection to the people in her life — this registers very clearly in her scan. Animals like Bella are deeply attuned to the emotional environment around them, and that sensitivity is a genuine gift. It also means, however, that her nervous system can carry more than it outwardly shows. When routines change, when there's tension in the household, or when new people or environments are introduced, Bella's system registers it and responds — sometimes in ways that aren't immediately visible.
          </Paragraph>
          <Paragraph>
            Her emotional resonance scores are among the warmest I've seen, which speaks to the quality of the bond she has with her family. That connection is genuinely protective for her health. It's also worth knowing that Bella's wellbeing is partly a reflection of the emotional safety she feels at home — maintaining that consistency, especially around her routines, is one of the most powerful things her guardian can do for her long-term health.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <div>
        <SectionLabel text="Digestive &amp; Physical Patterns" />
        <NarrativeBlock>
          <Paragraph>
            Bella's scan shows mild disruption in the digestive frequency bands — specifically in areas associated with enzyme production and gut microbiome balance. This is a common finding in dogs over the age of five, and it often presents as occasional stomach upset, changes in appetite, a tendency to eat grass, or stools that vary in consistency without an obvious dietary cause. If Sandra has noticed any of these signs, this is likely the energetic pattern underlying them.
          </Paragraph>
          <Paragraph>
            There is also some mild inflammatory activity showing in Bella's scan, particularly in areas associated with joint and connective tissue health. This doesn't necessarily mean Bella is in pain, but it does suggest that her joints and connective tissues may benefit from targeted nutritional support — especially as she gets older. Marine-sourced omega-3 fatty acids, collagen-supporting nutrients, and a high-quality joint supplement formulated for dogs would all be worth discussing with her veterinarian.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <div>
        <SectionLabel text="Energy &amp; Immune Resilience" />
        <NarrativeBlock>
          <Paragraph>
            Bella's energy levels are showing mild fluctuation in her scan — days where she seems full of life alongside days where she seems quieter than usual. This kind of variability, when it shows up in a frequency scan, often reflects a combination of digestive inefficiency and a slightly suppressed immune frequency. She's likely absorbing nutrition inconsistently, which affects how much sustained energy she has available on any given day.
          </Paragraph>
          <Paragraph>
            Supporting her gut health with a canine-specific probiotic and digestive enzyme at mealtimes is probably the single highest-leverage change available right now. When digestion improves, nutrient absorption improves, and both energy and immune resilience tend to follow. Ensuring she has access to fresh, filtered water throughout the day — especially after exercise — is a simple but meaningful complement to this.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <GoldDivider />

      <div>
        <SectionLabel text="Recommendations for Sandra" />
        <NarrativeBlock>
          <Paragraph>
            For Bella, the three areas to focus on are digestive support, joint and connective tissue nutrition, and maintaining a calm, predictable environment. None of these require dramatic intervention. A canine-specific probiotic and digestive enzyme, added to her meals consistently, would be an excellent first step. An omega-3 supplement and a quality joint support formula would address the inflammatory and connective tissue patterns showing in her scan.
          </Paragraph>
          <Paragraph>
            On the environmental side, keeping Bella's routines as consistent as possible — feeding times, walk schedules, sleep location — is genuinely therapeutic for a sensitive dog like her. Providing a quiet, designated space where she can retreat when she needs to decompress is also worth ensuring. These may sound like small things, but for a dog of Bella's temperament and sensitivity, they have a meaningful impact on her nervous system and overall wellbeing.
          </Paragraph>
          <Paragraph>
            Bella is clearly very loved, and that love shows in her scan. The changes we're recommending are gentle, targeted, and very achievable — and they're designed to keep her feeling as good on the inside as she looks on the outside.
          </Paragraph>
        </NarrativeBlock>
      </div>

      <GoldDivider />
      <ReportAudioPlayer
        cacheKey="bella"
        scriptText={buildNarrationScript(REPORT_DATA.bella)}
        clientName="Bella"
      />
      <ComplianceNote pet />
      <ReportCTA />
    </div>
  );
}

const TABS = [
  { id: "jane", label: "Jane Doe", sub: "Basic Human Sample" },
  { id: "maria", label: "Maria Thompson", sub: "Advanced Human Case" },
  { id: "bella", label: "Bella", sub: "Pet Report Sample" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SampleReports() {
  const [activeTab, setActiveTab] = useState<TabId>("jane");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">

      {/* Hero */}
      <section className="py-20 border-b border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F5C5E]/6 to-transparent pointer-events-none" />
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-5">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.25em]">Sample Reports</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6] leading-[1.15]">
              See What Your Report Will Look Like
            </h1>
            <p className="text-lg text-[#F4EFE6]/52 leading-relaxed max-w-xl mx-auto">
              These are real examples of how we turn complex scan data into clear, personalized insight you can actually understand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 flex-1">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">

          {/* Tabs */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer flex flex-col items-center py-4 px-3 rounded-2xl border transition-all duration-250 text-center ${
                    activeTab === tab.id
                      ? "bg-[#0C1919] border-[#BFA14A]/40 shadow-[0_0_30px_rgba(191,161,74,0.13)]"
                      : "bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/18"
                  }`}
                >
                  <span className={`text-sm font-semibold transition-colors ${activeTab === tab.id ? "text-[#BFA14A]" : "text-[#F4EFE6]/75"}`}>
                    {tab.label}
                  </span>
                  <span className={`text-xs mt-1 transition-colors ${activeTab === tab.id ? "text-[#F4EFE6]/50" : "text-[#F4EFE6]/38"}`}>
                    {tab.sub}
                  </span>
                  {activeTab === tab.id && (
                    <div className="mt-2 w-6 h-0.5 rounded-full bg-[#BFA14A]/60" />
                  )}
                </button>
              ))}
            </div>

            {/* Disclaimer note */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles className="w-3 h-3 text-[#BFA14A]/40 shrink-0" />
              <p className="text-[#F4EFE6]/38 text-xs text-center">
                These are sample reports. Your report will be fully personalized based on your scan.
              </p>
            </div>
          </motion.div>

          {/* Download row */}
          <motion.div
            initial="hidden" animate="visible" variants={fadeInUp}
            className="flex items-center justify-between mb-4"
          >
            <p className="text-[#F4EFE6]/30 text-xs">
              Sample for {REPORT_DATA[activeTab].clientName}
            </p>
            <DownloadReportButton data={REPORT_DATA[activeTab]} />
          </motion.div>

          {/* Report card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabFade}
              className="bg-white/[0.025] border border-white/8 rounded-3xl p-6 md:p-10 shadow-[0_0_80px_rgba(15,92,94,0.18),0_0_0_1px_rgba(191,161,74,0.04)]"
            >
              {activeTab === "jane" && <JaneDoeReport />}
              {activeTab === "maria" && <MariaThompsonReport />}
              {activeTab === "bella" && <BellaReport />}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* Bottom strip */}
      <section className="pb-20 pt-4 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#F4EFE6]/30 text-sm">
            Questions about what's in a report?{" "}
            <Link href="/contact" className="text-[#BFA14A]/60 hover:text-[#BFA14A] transition-colors underline underline-offset-4 decoration-[#BFA14A]/25">
              Reach out to Kathy
            </Link>
          </p>
        </div>
      </section>

    </div>
  );
}
