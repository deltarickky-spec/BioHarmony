import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { BioHarmonyScore } from "@/components/BioHarmonyScore";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

interface ReportContent {
  openingParagraph: string;
  digestiveTitle: string;
  digestiveText: string;
  connectedInsight: string;
  emotionalTitle: string;
  emotionalText: string;
  recommendations: Array<{ title: string; desc: string }>;
  ctaHeadline: string;
  ctaSubtext: string;
}

const ENGLISH_CONTENT: ReportContent = {
  openingParagraph: "Jane, as I went through your scan, a few clear patterns began to stand out. What your body is showing isn't random — it's actually communicating a very connected story between your digestion, stress response, and energy levels. This is something I see quite often, and the good news is that once we understand the pattern, we can begin supporting it in a much more targeted and gentle way.",
  digestiveTitle: "Digestive System Support",
  digestiveText: "Your scan is showing that your digestive system may be working harder than it should right now. This can sometimes show up as bloating, slower digestion, or feeling tired after meals. What's interesting is that this is often connected to stress patterns as well — when the body is in a more stressed state, digestion naturally slows down.",
  connectedInsight: "This is where things connect — your digestive patterns are not isolated. They're closely tied to your nervous system and emotional stress levels. When those are supported together, the body often responds much more quickly.",
  emotionalTitle: "Emotional & Energetic Patterns",
  emotionalText: "Your Inner Voice scan suggests a tendency toward internal pressure — feeling like you need to hold things together or push through even when your body is asking for rest. This can quietly impact both your energy and digestion over time.",
  recommendations: [
    { title: "Focus on Hydration", desc: "Consistent daily water intake supports cellular communication and gentle detox." },
    { title: "Digestive Support", desc: "Prioritize warm, easy-to-digest foods and consider probiotic support." },
    { title: "Stress Regulation", desc: "Short breathing practices or meditation to calm the nervous system response." },
    { title: "Light Daily Movement", desc: "Gentle walks or stretching to encourage lymphatic flow and energy." },
    { title: "Frequency Support (SEFI)", desc: "Targeted frequency support sessions aligned with your scan patterns." },
  ],
  ctaHeadline: "Ready to understand your own results?",
  ctaSubtext: "Upload your AO Scan export and receive your own personalized BioHarmony interpretation.",
};

const SESSION_KEY = "bioharmony_report_session";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-6 rounded-full bg-[#BFA14A]"></div>
      <h2 className="font-serif text-xl text-[#BFA14A]">{label}</h2>
    </div>
  );
}

function InsightCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-7 leading-relaxed text-[#F4EFE6]/70 text-[15px]">
      {children}
    </div>
  );
}

export default function SampleReport() {
  const { language } = useLanguage();
  const [content, setContent] = useState<ReportContent>(ENGLISH_CONTENT);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const translationCache = useRef<Partial<Record<Language, ReportContent>>>({ en: ENGLISH_CONTENT });

  useEffect(() => {
    if (language === "en") {
      setContent(ENGLISH_CONTENT);
      setTranslationError(null);
      return;
    }

    const cached = translationCache.current[language];
    if (cached) {
      setContent(cached);
      setTranslationError(null);
      return;
    }

    const sessionId = getSessionId();
    setIsTranslating(true);
    setTranslationError(null);

    const base = import.meta.env.BASE_URL.replace(/\/$/, "");

    fetch(`${base}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: ENGLISH_CONTENT,
        targetLanguage: language,
        sessionId,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ translated: ReportContent }>;
      })
      .then(({ translated }) => {
        translationCache.current[language] = translated;
        setContent(translated);
      })
      .catch(() => {
        setTranslationError("Translation unavailable — showing English version.");
        setContent(ENGLISH_CONTENT);
      })
      .finally(() => setIsTranslating(false));
  }, [language]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">

      {/* Page header */}
      <section className="py-20 border-b border-white/8">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-5">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">BioHarmony Interpretation</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6]">Sample BioHarmony Interpretation Report</h1>
            <p className="text-lg text-[#F4EFE6]/55 leading-relaxed max-w-xl mx-auto">
              See how we turn complex scan data into clear, personalized insights you can actually understand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Language selector bar */}
      <div className="sticky top-[72px] z-30 bg-[#060D0D]/90 backdrop-blur-xl border-b border-white/8">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto py-3 flex items-center justify-between gap-4">
          <span className="text-[#F4EFE6]/30 text-xs uppercase tracking-wider hidden sm:block">View report in:</span>
          <LanguageSelector />
          {isTranslating && (
            <div className="flex items-center gap-2 text-[#BFA14A]/60 text-xs ml-auto shrink-0">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Translating…</span>
            </div>
          )}
        </div>
        {translationError && (
          <div className="container px-4 md:px-6 max-w-3xl mx-auto pb-2">
            <p className="text-amber-400/60 text-xs">{translationError}</p>
          </div>
        )}
      </div>

      {/* Report body */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto space-y-10">

            {/* Client header card */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="bg-white/5 border border-[#BFA14A]/20 rounded-2xl px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_40px_rgba(191,161,74,0.07)]">
                <div className="space-y-1">
                  <p className="text-[#F4EFE6]/40 text-xs uppercase tracking-wider">Client</p>
                  <p className="font-serif text-2xl text-[#F4EFE6]">Jane Doe</p>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <p className="text-[#BFA14A] text-sm font-medium">Comprehensive AO Scan</p>
                  <p className="text-[#F4EFE6]/35 text-xs">Report Date: January 15, 2025</p>
                </div>
              </div>
            </motion.div>

            {/* Opening paragraph */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeInUp}
              key={`opening-${language}`}
            >
              <div className="bg-[#0F5C5E]/12 border border-[#0F5C5E]/30 rounded-2xl px-7 py-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#BFA14A]/4 blur-[60px] rounded-full pointer-events-none"></div>
                <p className="text-[#F4EFE6]/80 text-[15px] leading-[1.85] font-serif italic">
                  "{content.openingParagraph}"
                </p>
                <p className="text-[#BFA14A]/60 text-xs mt-4 font-sans not-italic">— Kathy Owens, BioHarmony Solutions</p>
              </div>
            </motion.div>

            {/* Intelligence Score */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <BioHarmonyScore
                score={72}
                breakdown={[
                  { label: "Stress Load", value: 65 },
                  { label: "Energy Balance", value: 78 },
                  { label: "System Alignment", value: 71 },
                  { label: "Recovery Capacity", value: 74 },
                ]}
              />
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-grow h-px bg-white/6"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A]/40"></div>
              <div className="flex-grow h-px bg-white/6"></div>
            </div>

            {/* Digestive section */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              key={`digestive-${language}`}
            >
              <SectionHeader label={content.digestiveTitle} />
              <InsightCard>{content.digestiveText}</InsightCard>
            </motion.div>

            {/* Connected insight callout */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              key={`insight-${language}`}
            >
              <div className="border-l-2 border-[#BFA14A]/50 pl-6 py-1">
                <p className="text-[#F4EFE6]/65 text-[14px] leading-[1.8] italic font-serif">
                  "{content.connectedInsight}"
                </p>
              </div>
            </motion.div>

            {/* Emotional section */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              key={`emotional-${language}`}
            >
              <SectionHeader label={content.emotionalTitle} />
              <InsightCard>{content.emotionalText}</InsightCard>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-grow h-px bg-white/6"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A]/40"></div>
              <div className="flex-grow h-px bg-white/6"></div>
            </div>

            {/* Recommendations */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              key={`recs-${language}`}
            >
              <SectionHeader label={language === "en" ? "Gentle Wellness Recommendations" : content.recommendations[0]?.title ? "Gentle Wellness Recommendations" : "Gentle Wellness Recommendations"} />
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="bg-white/4 border border-white/8 rounded-xl px-5 py-4 hover:border-[#BFA14A]/20 transition-colors duration-200"
                  >
                    <p className="text-[#BFA14A] text-sm font-medium mb-1">{rec.title}</p>
                    <p className="text-[#F4EFE6]/50 text-xs leading-relaxed">{rec.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Compliance note */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="bg-white/3 border border-white/6 rounded-xl px-6 py-4">
                <p className="text-[#F4EFE6]/30 text-xs leading-relaxed text-center">
                  This report is for wellness education and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. Please consult a qualified healthcare professional for any medical concerns.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-white/8 bg-gradient-to-b from-transparent to-[#040A0A]">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">{content.ctaHeadline}</h2>
            <p className="text-[#F4EFE6]/50 leading-relaxed">{content.ctaSubtext}</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/25 px-10 h-14 text-base shadow-[0_0_20px_rgba(191,161,74,0.3)] hover:shadow-[0_0_35px_rgba(191,161,74,0.55)] transition-all duration-300"
              data-testid="sample-report-upload-cta"
            >
              <Link href="/upload-scan">Upload Your Scan</Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
