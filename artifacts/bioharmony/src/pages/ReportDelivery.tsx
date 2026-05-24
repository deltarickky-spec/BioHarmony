import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Volume2, Globe, ShieldCheck, AlertTriangle,
  CheckCircle, Clock, Loader2, Mail, ArrowRight, ChevronRight,
  Sparkles, CreditCard, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { planHasAudio, planHasScore } from "@/lib/pricing";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const REPORT_TYPE_LABELS: Record<string, string> = {
  ao_scan: "AO Scan Analysis",
  inner_voice: "Inner Voice Analysis",
  full_body_scan: "Full Body Scan",
  cellular_scan: "Cellular Analysis",
  emotional_scan: "Emotional Wellness",
  pet_scan: "Pet Wellness Report",
  comprehensive: "Comprehensive Wellness Report",
};

const LANG_LABELS: Record<string, string> = {
  en: "English", fr: "French", es: "Spanish", pt: "Portuguese",
  de: "German", zh: "Chinese", ar: "Arabic", hi: "Hindi",
};

const PIPELINE_STAGES = [
  { key: "queued",     label: "Received",   desc: "Your scan has been received" },
  { key: "processing", label: "Processing", desc: "Analysis underway" },
  { key: "review",     label: "Review",     desc: "Final quality check" },
  { key: "delivered",  label: "Delivered",  desc: "Your report is ready" },
];

const TAG_META: Record<string, { label: string; icon: string; color: string; desc: string }> = {
  stress:       { label: "Stress",       icon: "🧠", color: "bg-rose-900/30 text-rose-300 border-rose-700/30",       desc: "Indicators of adrenal & nervous system stress patterns detected" },
  digestion:    { label: "Digestion",    icon: "🌿", color: "bg-green-900/25 text-green-300 border-green-700/25",    desc: "Digestive frequency resonance and gut-related markers identified" },
  sleep:        { label: "Sleep",        icon: "🌙", color: "bg-indigo-900/30 text-indigo-300 border-indigo-700/30", desc: "Rest cycle patterns and circadian rhythm imbalances noted" },
  inflammation: { label: "Inflammation", icon: "🔥", color: "bg-orange-900/25 text-orange-300 border-orange-700/25", desc: "Systemic inflammatory frequency markers present in scan data" },
  hormones:     { label: "Hormones",     icon: "⚡", color: "bg-purple-900/25 text-purple-300 border-purple-700/25", desc: "Endocrine and hormonal resonance patterns identified" },
  energy:       { label: "Energy",       icon: "✨", color: "bg-[#BFA14A]/10 text-[#BFA14A] border-[#BFA14A]/25",    desc: "Cellular energy production and mitochondrial resonance assessed" },
};

interface ReportData {
  requestId: string;
  name: string;
  email: string;
  reportType: string;
  plan: string;
  language: string;
  pipelineStage: string;
  paymentStatus: string;
  bioharmonyScore: number | null;
  scoreBreakdown: string | null;
  deliveredEmailSentAt: string | null;
  tags: string[];
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
  try { return JSON.parse(raw) as ScoreCategory[]; } catch { return null; }
}

function getMockCategories(overall: number): ScoreCategory[] {
  const b = overall ?? 72;
  return [
    { label: "Stress Load",       value: Math.max(40, Math.min(98, b - 4)), description: "Your body's current stress response and adrenal balance",              color: "teal" },
    { label: "Energy Balance",    value: Math.max(40, Math.min(98, b + 3)), description: "Cellular energy production and mitochondrial resonance",               color: "gold" },
    { label: "System Alignment",  value: Math.max(40, Math.min(98, b - 2)), description: "Coherence across primary organ and system frequencies",               color: "purple" },
    { label: "Recovery Capacity", value: Math.max(40, Math.min(98, b + 1)), description: "Your body's natural regeneration and repair response",                color: "teal" },
  ];
}

// ── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color = score >= 75 ? "#BFA14A" : score >= 55 ? "#0F5C5E" : "#ef4444";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={9} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={9}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-[#BFA14A] leading-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >{score}</motion.span>
        <span className="text-[10px] text-[#F4EFE6]/35 uppercase tracking-wider mt-0.5">/100</span>
      </div>
    </div>
  );
}

function CategoryBar({ cat, delay = 0 }: { cat: ScoreCategory; delay?: number }) {
  const colorClass = cat.color === "gold" ? "bg-[#BFA14A]" : cat.color === "purple" ? "bg-purple-400" : "bg-[#4ecdc4]";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-[#F4EFE6]/75">{cat.label}</span>
        <span className="text-sm font-semibold text-[#F4EFE6]">{cat.value}</span>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${cat.value}%` }}
          transition={{ duration: 1, delay: 0.3 + delay * 0.12, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
      <p className="text-[10px] text-[#F4EFE6]/30 mt-1 leading-relaxed">{cat.description}</p>
    </div>
  );
}

// ── Pipeline Tracker ──────────────────────────────────────────────────────────

function PipelineTracker({ stage }: { stage: string }) {
  const currentIdx = PIPELINE_STAGES.findIndex((s) => s.key === stage);
  const idx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute top-5 left-5 right-5 h-px bg-white/10 hidden sm:block" />
      <div
        className="absolute top-5 left-5 h-px bg-[#BFA14A]/50 hidden sm:block transition-all duration-700"
        style={{ width: idx === 0 ? 0 : `${(idx / (PIPELINE_STAGES.length - 1)) * 100}%` }}
      />

      <div className="grid grid-cols-4 gap-2 relative z-10">
        {PIPELINE_STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div key={s.key} className="flex flex-col items-center gap-2 text-center">
              <div className={cn(
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                done  ? "bg-[#BFA14A] border-[#BFA14A]" :
                active ? "bg-[#BFA14A]/15 border-[#BFA14A] shadow-[0_0_14px_rgba(191,161,74,0.3)]" :
                         "bg-white/[0.03] border-white/12"
              )}>
                {done
                  ? <CheckCircle className="w-4 h-4 text-[#060D0D]" />
                  : active
                    ? <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.8 }}>
                        <div className="w-2 h-2 rounded-full bg-[#BFA14A]" />
                      </motion.div>
                    : <div className="w-2 h-2 rounded-full bg-white/15" />
                }
              </div>
              <div>
                <p className={cn("text-xs font-medium", done || active ? "text-[#F4EFE6]/80" : "text-[#F4EFE6]/25")}>
                  {s.label}
                </p>
                {active && (
                  <p className="text-[9px] text-[#BFA14A]/70 mt-0.5 leading-tight">{s.desc}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Email Gate ────────────────────────────────────────────────────────────────

function EmailGate({ reportId, onVerified }: { reportId: string; onVerified: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError("");
    try {
      const cleaned = reportId.trim().toUpperCase().replace(/^BH-?/, "");
      const res = await fetch(`${BASE}/api/scan-requests/track?id=${encodeURIComponent(cleaned)}&email=${encodeURIComponent(trimmed)}`);
      if (res.status === 404) {
        setError("No submission found with this email and Report ID. Please check both and try again.");
      } else if (!res.ok) {
        const body = await res.json() as { error?: string };
        setError(body.error ?? "Could not verify. Please try again.");
      } else {
        onVerified(trimmed);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060D0D] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0C1919] border border-[#BFA14A]/30 mb-4">
            <Sparkles className="w-6 h-6 text-[#BFA14A]" />
          </div>
          <p className="text-[#BFA14A] text-xs tracking-[0.3em] uppercase mb-1">BioHarmony Analytics</p>
          <h1 className="font-serif text-2xl text-[#F4EFE6]">Your Report</h1>
        </div>

        <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-7">
          <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
            <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-widest mb-0.5">Report ID</p>
            <p className="text-lg font-mono font-semibold text-[#BFA14A]">
              {reportId.toUpperCase().startsWith("BH") ? reportId.toUpperCase() : `BH-${reportId.padStart(4, "0")}`}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#F4EFE6]/40 mb-2 uppercase tracking-wider">
                Verify with your email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F4EFE6]/25 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@email.com"
                  className="w-full bg-white/5 border border-white/12 text-[#F4EFE6] placeholder:text-[#F4EFE6]/20 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#BFA14A]/40 transition"
                />
              </div>
              <p className="text-[10px] text-[#F4EFE6]/25 mt-1.5">
                Enter the email you used when submitting your scan.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400/80 text-xs leading-relaxed"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-3 rounded-xl bg-[#BFA14A] text-[#060D0D] font-semibold text-sm hover:bg-[#d4b456] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                : <><ArrowRight className="w-4 h-4" /> View My Report</>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-[#F4EFE6]/20 mt-5">
          Don't have your Report ID?{" "}
          <Link href="/track-report" className="text-[#BFA14A]/50 hover:text-[#BFA14A]/80 transition underline underline-offset-2">
            Track your report
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ReportDelivery() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [, search] = useLocation();
  const emailFromUrl = new URLSearchParams(search).get("email") ?? "";

  const [verifiedEmail, setVerifiedEmail] = useState(emailFromUrl);
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState("en");
  const [showLangPicker, setShowLangPicker] = useState(false);

  const reportId = params.id ?? "";

  // Once email is verified (either from URL or gate), fetch data
  useEffect(() => {
    if (!verifiedEmail) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const cleaned = reportId.trim().toUpperCase().replace(/^BH-?/, "");
        const res = await fetch(
          `${BASE}/api/scan-requests/track?id=${encodeURIComponent(cleaned)}&email=${encodeURIComponent(verifiedEmail)}`
        );
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
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
  }, [verifiedEmail, reportId]);

  function handleVerified(email: string) {
    setVerifiedEmail(email);
  }

  // No email yet — show gate
  if (!verifiedEmail) {
    return <EmailGate reportId={reportId} onVerified={handleVerified} />;
  }

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
          <p className="text-[#F4EFE6]/45 text-sm mb-6 leading-relaxed">
            {error ?? "This report link may be invalid or expired."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setVerifiedEmail(""); setError(null); }}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 border border-white/12 text-[#F4EFE6]/60 rounded-xl text-sm hover:border-white/20 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
            <Link href="/track-report"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#BFA14A] text-[#060D0D] rounded-xl text-sm font-semibold hover:bg-[#d4b456] transition"
            >
              Track Your Report <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDelivered = data.pipelineStage === "delivered";
  const isPending = data.paymentStatus === "pending";
  const score = data.bioharmonyScore ?? 72;
  const categories = parseScoreBreakdown(data.scoreBreakdown) ?? getMockCategories(score);
  const isPremium = planHasAudio(data.plan);
  const showScore = planHasScore(data.plan);
  const reportLabel = REPORT_TYPE_LABELS[data.reportType] ?? data.reportType;
  const tags = data.tags ?? [];

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] pb-24">

      {/* ── Header ── */}
      <div className="border-b border-white/8 bg-[#060D0D]/95 backdrop-blur-sm px-4 py-5 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-[#BFA14A] uppercase tracking-widest mb-1">BioHarmony Analytics</p>
            <h1 className="font-serif text-xl text-[#F4EFE6] leading-tight">{data.name}</h1>
            <p className="text-[#F4EFE6]/40 text-sm mt-0.5">{reportLabel}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[#F4EFE6]/25 uppercase tracking-wider font-mono">{data.requestId}</p>
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

      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-6">

        {/* ── Payment warning ── */}
        {isPending && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-700/30 bg-amber-900/10 p-5"
          >
            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-amber-400/70 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-300/90 mb-0.5">Payment pending</p>
                <p className="text-xs text-[#F4EFE6]/45 leading-relaxed">
                  Your report is in queue. Processing begins once payment is confirmed.
                  Check your email for the payment link, or contact{" "}
                  <a href="mailto:info@bioharmonysolutions.ca" className="text-[#4ecdc4] underline underline-offset-2">
                    info@bioharmonysolutions.ca
                  </a>
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ── Pipeline Progress ── */}
        {!isDelivered && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-[#0C1919] p-6"
          >
            <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-6 font-medium">Report Progress</p>
            <PipelineTracker stage={data.pipelineStage} />
            <p className="text-[11px] text-[#F4EFE6]/30 mt-5 text-center leading-relaxed">
              You'll receive an email at <span className="text-[#F4EFE6]/50">{data.email}</span> when your report is delivered.
            </p>
          </motion.section>
        )}

        {/* ── Delivered content ── */}
        {isDelivered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >

            {/* BioHarmony Intelligence Score (only for plans that include it) */}
            {showScore && (
              <section className="rounded-2xl border border-white/10 bg-[#0C1919] p-6">
                <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-6 font-medium">BioHarmony Intelligence Score</p>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ScoreRing score={score} size={140} />
                  <div className="flex-1 space-y-4 w-full">
                    {categories.map((cat, i) => <CategoryBar key={cat.label} cat={cat} delay={i} />)}
                  </div>
                </div>
                <p className="text-[10px] text-[#F4EFE6]/20 mt-5 leading-relaxed">
                  Score reflects scan data patterns — educational wellness insight only. Not a medical assessment.
                </p>
              </section>
            )}

            {/* Wellness Focus Areas (AI tags) */}
            {tags.length > 0 && (
              <section className="rounded-2xl border border-white/10 bg-[#0C1919] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-[#BFA14A]" />
                  <p className="text-xs uppercase tracking-widest text-[#BFA14A] font-medium">Wellness Focus Areas</p>
                </div>
                <p className="text-sm text-[#F4EFE6]/50 mb-5 leading-relaxed">
                  Based on your submission, our system identified the following wellness areas as priorities for your report:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tags.map((tag) => {
                    const meta = TAG_META[tag];
                    if (!meta) return null;
                    return (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex items-start gap-3 p-3.5 rounded-xl border",
                          meta.color,
                        )}
                      >
                        <span className="text-lg leading-none shrink-0 mt-0.5">{meta.icon}</span>
                        <div>
                          <p className="text-sm font-semibold mb-0.5">{meta.label}</p>
                          <p className="text-[10px] opacity-70 leading-relaxed">{meta.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            )}

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
                  <AnimatePresence>
                    {showLangPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-full mt-1 bg-[#0C1919] border border-white/12 rounded-xl shadow-xl z-10 overflow-hidden min-w-[150px]"
                      >
                        {Object.entries(LANG_LABELS).map(([code, label]) => (
                          <button key={code}
                            onClick={() => { setLang(code); setShowLangPicker(false); }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm transition hover:bg-white/5",
                              lang === code ? "text-[#BFA14A]" : "text-[#F4EFE6]/60"
                            )}
                          >{label}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* PDF Download */}
            <section className="rounded-2xl border border-white/10 bg-[#0C1919] p-5">
              <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-4 font-medium">Your Report</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#F4EFE6]/80 font-medium">{reportLabel} — PDF</p>
                  <p className="text-xs text-[#F4EFE6]/35 mt-0.5">
                    Personalized wellness report · {LANG_LABELS[lang] ?? lang}
                  </p>
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
                    <p className="text-xs text-[#F4EFE6]/35 mt-0.5">AI-narrated · {LANG_LABELS[lang] ?? lang} · ~8 minutes</p>
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
                <ShieldCheck className="w-4 h-4 text-[#F4EFE6]/20 shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#F4EFE6]/30 leading-relaxed">
                  This report is for wellness education and informational purposes only. It is not a medical diagnosis,
                  treatment plan, or substitute for professional medical advice. Always consult a qualified healthcare
                  provider for health concerns.{" "}
                  <Link href="/disclaimer" className="underline underline-offset-2 hover:text-[#F4EFE6]/50 transition">
                    Full disclaimer
                  </Link>
                </p>
              </div>
            </section>

            {/* Feedback CTA */}
            <section className="rounded-2xl border border-[#0F5C5E]/30 bg-[#0F5C5E]/5 p-6 text-center">
              <p className="text-[#4ecdc4] text-sm font-medium mb-2">How was your experience?</p>
              <p className="text-[#F4EFE6]/45 text-sm mb-4">Your feedback helps Kathy improve future reports.</p>
              <Link
                href={`/feedback?id=${data.requestId}`}
                className="inline-block px-5 py-2 rounded-xl border border-[#4ecdc4]/30 text-[#4ecdc4]/80 text-sm hover:bg-[#0F5C5E]/15 hover:border-[#4ecdc4]/50 transition"
              >
                Leave Feedback ✦
              </Link>
            </section>

          </motion.div>
        )}
      </div>
    </div>
  );
}
