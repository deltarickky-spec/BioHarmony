import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Download, Volume2, Globe, ShieldCheck, AlertTriangle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const REPORT_TYPE_LABELS: Record<string, string> = {
  ao_scan: "AO Scan Analysis",
  inner_voice: "Inner Voice Analysis",
  pet_scan: "Pet Wellness Report",
  comprehensive: "Comprehensive Wellness Report",
};

const LANG_LABELS: Record<string, string> = {
  en: "English", fr: "French", es: "Spanish", pt: "Portuguese",
  de: "German", zh: "Chinese", ar: "Arabic", hi: "Hindi",
};

interface ReportData {
  requestId: string;
  name: string;
  reportType: string;
  plan: string;
  language: string;
  pipelineStage: string;
  bioharmonyScore: number | null;
  scoreBreakdown: string | null;
  deliveredEmailSentAt: string | null;
  createdAt: string;
}

interface ScoreCategory {
  label: string;
  value: number;
  description: string;
  color: string;
}

function parseScoreBreakdown(raw: string | null): ScoreCategory[] | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ScoreCategory[];
  } catch { return null; }
}

function getMockCategories(overall: number): ScoreCategory[] {
  const base = overall ?? 72;
  return [
    { label: "Stress Load", value: Math.max(40, Math.min(98, base - 4)), description: "Your body's current stress response and adrenal balance", color: "teal" },
    { label: "Energy Balance", value: Math.max(40, Math.min(98, base + 3)), description: "Cellular energy production and mitochondrial resonance", color: "gold" },
    { label: "System Alignment", value: Math.max(40, Math.min(98, base - 2)), description: "Coherence across primary organ and system frequencies", color: "purple" },
    { label: "Recovery Capacity", value: Math.max(40, Math.min(98, base + 1)), description: "Your body's natural regeneration and repair response", color: "teal" },
  ];
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = score >= 75 ? "#BFA14A" : score >= 55 ? "#0F5C5E" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference} strokeDashoffset={circumference - filled}
          strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#BFA14A]">{score}</span>
        <span className="text-[10px] text-[#F4EFE6]/40 uppercase tracking-wider">/100</span>
      </div>
    </div>
  );
}

function CategoryBar({ cat }: { cat: ScoreCategory }) {
  const colorClass = cat.color === "gold" ? "bg-[#BFA14A]" : cat.color === "purple" ? "bg-purple-400" : "bg-[#4ecdc4]";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#F4EFE6]/80">{cat.label}</span>
        <span className="text-sm font-semibold text-[#F4EFE6]">{cat.value}</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${cat.value}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
      <p className="text-[10px] text-[#F4EFE6]/35 mt-1.5 leading-relaxed">{cat.description}</p>
    </div>
  );
}

export default function ReportDelivery() {
  const params = useParams<{ id: string }>();
  const [, search] = useLocation();
  const email = new URLSearchParams(search).get("email") ?? "";

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const id = params.id ?? "";
        const url = email
          ? `${BASE}/api/scan-requests/track?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`
          : `${BASE}/api/scan-requests/public/${encodeURIComponent(id)}`;
        const res = await fetch(url);
        if (!res.ok) {
          const body = (await res.json()) as { error?: string; pipelineStage?: string };
          setError(body.error ?? "Report not found.");
          return;
        }
        const d = (await res.json()) as ReportData;
        setData(d);
        setLang(d.language ?? "en");
      } catch {
        setError("Could not load your report. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id, email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060D0D] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#BFA14A]/50 animate-spin mx-auto mb-4" />
          <p className="text-[#F4EFE6]/35 text-sm">Loading your report…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#060D0D] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-10 h-10 text-[#BFA14A]/50 mx-auto mb-4" />
          <h2 className="font-serif text-xl text-[#F4EFE6] mb-3">Report Not Found</h2>
          <p className="text-[#F4EFE6]/45 text-sm mb-6">{error ?? "This report link may be invalid or the report is not yet delivered."}</p>
          <Link href="/track-report" className="inline-block px-6 py-2.5 bg-[#BFA14A] text-[#060D0D] rounded-xl text-sm font-semibold hover:bg-[#d4b456] transition">
            Track Your Report
          </Link>
        </div>
      </div>
    );
  }

  const isDelivered = data.pipelineStage === "delivered";
  const score = data.bioharmonyScore ?? 72;
  const categories = parseScoreBreakdown(data.scoreBreakdown) ?? getMockCategories(score);
  const isPremium = data.plan === "premium";
  const isAdvancedPlus = data.plan === "advanced" || isPremium;
  const reportLabel = REPORT_TYPE_LABELS[data.reportType] ?? data.reportType;

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] pb-24">

      {/* Header */}
      <div className="border-b border-white/8 bg-[#060D0D]/95 backdrop-blur-sm px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[#BFA14A] uppercase tracking-widest mb-1">BioHarmony Solutions</p>
            <h1 className="font-serif text-2xl text-[#F4EFE6]">{data.name}</h1>
            <p className="text-[#F4EFE6]/45 text-sm mt-1">{reportLabel}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">{data.requestId}</p>
            {isDelivered ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-400/80 mt-1">
                <CheckCircle className="w-3 h-3" /> Delivered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-[#BFA14A]/60 mt-1">
                <Clock className="w-3 h-3" /> In Progress
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-10 space-y-8">

        {!isDelivered && (
          <div className="rounded-2xl border border-[#BFA14A]/25 bg-[#BFA14A]/5 p-6 text-center">
            <Clock className="w-8 h-8 text-[#BFA14A]/50 mx-auto mb-3" />
            <h2 className="font-serif text-xl text-[#F4EFE6] mb-2">Your report is being prepared</h2>
            <p className="text-[#F4EFE6]/50 text-sm">We're currently in the <span className="text-[#BFA14A]/80 font-medium">{data.pipelineStage?.replace(/_/g, " ")}</span> stage. You'll receive an email when it's ready.</p>
          </div>
        )}

        {isDelivered && (
          <>
            {/* BioHarmony Intelligence Score */}
            <section className="rounded-2xl border border-white/10 bg-[#0C1919] p-6">
              <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-6 font-medium">BioHarmony Intelligence Score</p>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreRing score={score} size={140} />
                <div className="flex-1 space-y-5">
                  {categories.map((cat) => <CategoryBar key={cat.label} cat={cat} />)}
                </div>
              </div>
              <p className="text-[10px] text-[#F4EFE6]/25 mt-5 leading-relaxed">
                Score reflects bio-frequency resonance patterns — for educational purposes only. Not a medical assessment.
              </p>
            </section>

            {/* Language selector */}
            <section className="rounded-2xl border border-white/10 bg-[#0C1919] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#BFA14A]/60" />
                  <span className="text-sm text-[#F4EFE6]/70">Report Language</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowLangPicker(!showLangPicker)}
                    className="flex items-center gap-2 text-sm text-[#F4EFE6] px-3 py-1.5 rounded-lg border border-white/12 hover:border-[#BFA14A]/40 transition"
                  >
                    {LANG_LABELS[lang] ?? lang}
                    <span className="text-[#F4EFE6]/30">▾</span>
                  </button>
                  {showLangPicker && (
                    <div className="absolute right-0 top-full mt-1 bg-[#0C1919] border border-white/12 rounded-xl shadow-xl z-10 overflow-hidden min-w-[140px]">
                      {Object.entries(LANG_LABELS).map(([code, label]) => (
                        <button key={code} onClick={() => { setLang(code); setShowLangPicker(false); }}
                          className={cn("w-full text-left px-4 py-2.5 text-sm transition hover:bg-white/5",
                            lang === code ? "text-[#BFA14A]" : "text-[#F4EFE6]/65"
                          )}>{label}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* PDF Download */}
            <section className="rounded-2xl border border-white/10 bg-[#0C1919] p-5">
              <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-4 font-medium">Your Report</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#F4EFE6]/80 font-medium">{reportLabel} — PDF</p>
                  <p className="text-xs text-[#F4EFE6]/40 mt-0.5">Personalized wellness report · {LANG_LABELS[lang] ?? lang}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#BFA14A] text-[#060D0D] rounded-xl text-sm font-semibold hover:bg-[#d4b456] transition shrink-0">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </section>

            {/* Audio — Premium only */}
            {isPremium && (
              <section className="rounded-2xl border border-[#BFA14A]/25 bg-[#BFA14A]/5 p-5">
                <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-4 font-medium">Audio Narration</p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#F4EFE6]/80 font-medium">Personalized Audio Report</p>
                    <p className="text-xs text-[#F4EFE6]/40 mt-0.5">AI-narrated · {LANG_LABELS[lang] ?? lang} · ~8 minutes</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#BFA14A]/40 text-[#BFA14A] rounded-xl text-sm font-semibold hover:bg-[#BFA14A]/10 transition shrink-0">
                    <Volume2 className="w-4 h-4" /> Play Audio
                  </button>
                </div>
              </section>
            )}

            {/* Disclaimer */}
            <section className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#F4EFE6]/25 shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#F4EFE6]/35 leading-relaxed">
                  This report is for wellness education and informational purposes only. It is not a medical diagnosis, treatment plan, or substitute for professional medical advice. Always consult a qualified healthcare provider for health concerns.{" "}
                  <Link href="/disclaimer" className="underline underline-offset-2 hover:text-[#F4EFE6]/55 transition">Full disclaimer</Link>
                </p>
              </div>
            </section>

            {/* Testimonial CTA */}
            <section className="rounded-2xl border border-[#0F5C5E]/30 bg-[#0F5C5E]/5 p-6 text-center">
              <p className="text-[#4ecdc4] text-sm font-medium mb-2">How was your experience?</p>
              <p className="text-[#F4EFE6]/50 text-sm mb-4">Your feedback helps Kathy improve future reports.</p>
              <Link href={`/feedback?id=${data.requestId}`}
                className="inline-block px-5 py-2 rounded-xl border border-[#4ecdc4]/30 text-[#4ecdc4]/80 text-sm hover:bg-[#0F5C5E]/15 hover:border-[#4ecdc4]/50 transition"
              >
                Leave Feedback ✦
              </Link>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
