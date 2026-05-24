import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle2, Circle, Loader2, AlertCircle,
  CreditCard, FileText, MessageCircle, Clock, Lock,
  RefreshCw, Mail, Download, ExternalLink, Headphones
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { BioHarmonyScore } from "@/components/BioHarmonyScore";
import { ReportAudioPlayer } from "@/components/ReportAudioPlayer";
import { getPlanLabelWithPrice, planHasAudio, planHasScore } from "@/lib/pricing";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const AUTO_REFRESH_MS = 12_000;

const PIPELINE_STAGES = [
  { key: "queued",        label: "Request Queued",       desc: "Your submission has been received and is in the queue.",                    icon: "📥" },
  { key: "extracting",    label: "Extracting Data",       desc: "Your scan data is being extracted and prepared for analysis.",              icon: "🔍" },
  { key: "interpreting",  label: "AI Interpreting",       desc: "BioHarmony's AI engine is analyzing your scan data.",                   icon: "🧠" },
  { key: "generating",    label: "Generating Report",     desc: "Your personalized wellness narrative is being written.",                   icon: "✍️" },
  { key: "quality_check", label: "Quality Check",         desc: "Final review to ensure accuracy and BioHarmony standards.",               icon: "✅" },
  { key: "pdf_ready",     label: "PDF Created",           desc: "Your report has been compiled into a beautiful PDF.",                      icon: "📄" },
  { key: "audio_ready",   label: "Audio Narration Ready", desc: "Your audio narration has been generated and attached.",                   icon: "🎧" },
  { key: "delivered",     label: "Delivered",             desc: "Your report has been sent to your chosen delivery method.",               icon: "📬" },
] as const;

type PipelineStageKey = (typeof PIPELINE_STAGES)[number]["key"];

const STAGE_INDEX: Record<PipelineStageKey, number> = {
  queued: 0, extracting: 1, interpreting: 2, generating: 3,
  quality_check: 4, pdf_ready: 5, audio_ready: 6, delivered: 7,
};

const LANG_LABELS: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", pt: "Portuguese",
  de: "German", zh: "Chinese", ar: "Arabic", hi: "Hindi",
};

interface TrackResult {
  id: number;
  requestId: string;
  name: string;
  email: string;
  reportType: string;
  plan: string;
  language: string;
  whatsapp: boolean;
  fileName: string | null;
  status: string;
  pipelineStage: PipelineStageKey;
  paymentStatus: string;
  deliveredEmailSentAt: string | null;
  bioharmonyScore: number | null;
  scoreBreakdown: string | null;
  createdAt: string;
}

function formatRequestId(raw: string): string | null {
  const cleaned = raw.trim().toUpperCase().replace(/\s/g, "");
  const withPrefix = cleaned.startsWith("BH-")
    ? cleaned
    : cleaned.startsWith("BH")
      ? `BH-${cleaned.slice(2)}`
      : `BH-${cleaned}`;
  const match = withPrefix.match(/^BH-(\d{1,8})$/);
  if (!match) return null;
  return `BH-${parseInt(match[1]!, 10).toString().padStart(4, "0")}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PaymentBanner({ paymentStatus }: { paymentStatus: string }) {
  if (paymentStatus === "paid" || paymentStatus === "waived") return null;
  if (paymentStatus === "failed") {
    return (
      <div className="flex items-start gap-4 p-5 rounded-2xl border border-red-500/30 bg-red-500/8 mb-5">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-red-300 font-semibold text-sm mb-1">Payment Failed</p>
          <p className="text-[#F4EFE6]/55 text-sm leading-relaxed">
            Your payment could not be processed. Please contact us at{" "}
            <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A] underline underline-offset-2">
              info@bioharmonysolutions.ca
            </a>.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl border border-[#BFA14A]/30 bg-[#BFA14A]/6 mb-5">
      <CreditCard className="w-5 h-5 text-[#BFA14A] mt-0.5 shrink-0" />
      <div>
        <p className="text-[#BFA14A] font-semibold text-sm mb-1">Payment Pending</p>
        <p className="text-[#F4EFE6]/55 text-sm leading-relaxed">
          Processing will begin once payment is confirmed. Contact us at{" "}
          <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A] underline underline-offset-2">
            info@bioharmonysolutions.ca
          </a>.
        </p>
      </div>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { style: string; label: string }> = {
    paid:    { style: "bg-green-900/25 text-green-300 border border-green-700/30",    label: "Payment Confirmed" },
    pending: { style: "bg-[#BFA14A]/12 text-[#BFA14A] border border-[#BFA14A]/30",   label: "Payment Pending" },
    failed:  { style: "bg-red-900/25 text-red-300 border border-red-700/30",          label: "Payment Failed" },
    waived:  { style: "bg-purple-900/25 text-purple-300 border border-purple-700/30", label: "Payment Waived" },
  };
  const m = map[status] ?? map.pending!;
  return <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium", m.style)}>{m.label}</span>;
}

function LiveBadge({ lastUpdated }: { lastUpdated: Date | null }) {
  const [secondsAgo, setSecondsAgo] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (lastUpdated) setSecondsAgo(Math.round((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [lastUpdated]);
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ecdc4] opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ecdc4]" />
      </span>
      <span className="text-[10px] text-[#4ecdc4]/70 uppercase tracking-wider">
        Live{lastUpdated && secondsAgo > 2 && (
          <span className="text-[#F4EFE6]/22 normal-case tracking-normal ml-1">· updated {secondsAgo}s ago</span>
        )}
      </span>
    </div>
  );
}

// ── Delivered section ──────────────────────────────────────────────────────────

function AudioSection({ result }: { result: TrackResult }) {
  const isPremium = planHasAudio(result.plan);

  const audioScript = [
    `Hello ${result.name}, welcome to your BioHarmony wellness report.`,
    result.bioharmonyScore !== null
      ? `Your BioHarmony Intelligence Score is ${result.bioharmonyScore} out of 100.`
      : "",
    `This report covers your ${result.reportType.replace(/_/g, " ")} scan and has been carefully interpreted by Kathy Owens.`,
    `We hope the insights in your report help guide your wellness journey. Please reach out to us at info@bioharmonysolutions.ca if you have any questions.`,
  ].filter(Boolean).join(" ");

  if (isPremium) {
    return (
      <div className="mt-6 text-left">
        <ReportAudioPlayer
          cacheKey={`track-${result.requestId}`}
          scriptText={audioScript}
          clientName={result.name}
        />
      </div>
    );
  }

  return (
    <div className="mt-6 text-left">
      <div className="rounded-2xl border border-white/8 bg-white/[0.025] overflow-hidden">
        <div className="flex items-start gap-3 px-5 py-4">
          <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-4 h-4 text-[#F4EFE6]/25" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[#F4EFE6]/45 text-sm font-medium">Listen to Your Report</p>
              <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#BFA14A]/12 text-[#BFA14A] border border-[#BFA14A]/25">
                Premium
              </span>
            </div>
            <p className="text-[#F4EFE6]/28 text-xs leading-relaxed">
              Audio narration — your full report read aloud — is available on the Premium plan.
            </p>
          </div>
          <div className="flex-shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-[#F4EFE6]/18" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveredSection({ result }: { result: TrackResult }) {
  const [showContactMsg, setShowContactMsg] = useState(false);
  const sentAt = result.deliveredEmailSentAt
    ? new Date(result.deliveredEmailSentAt).toLocaleString("en-CA", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  const showScore = result.bioharmonyScore !== null && planHasScore(result.plan);
  const parsedBreakdown = (() => {
    if (!result.scoreBreakdown) return undefined;
    try { return JSON.parse(result.scoreBreakdown) as { label: string; value: number }[]; }
    catch { return undefined; }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0C1919] border border-green-700/25 rounded-2xl overflow-hidden"
    >
      <div className="h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      <div className="p-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                        bg-green-900/20 border border-green-700/30 mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>

        <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.3em] mb-2">Report Status</p>
        <h2 className="text-2xl font-serif text-[#F4EFE6] mb-2">Your Report Is Ready</h2>
        <p className="text-[#F4EFE6]/50 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          Your BioHarmony wellness report has been completed and{" "}
          {sentAt
            ? `an email was sent to ${result.email} on ${sentAt}.`
            : `will be sent to ${result.email} shortly.`}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => setShowContactMsg(!showContactMsg)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
                       bg-[#0F5C5E] border border-[#BFA14A]/25 text-[#F4EFE6] text-sm font-medium
                       shadow-[0_0_20px_rgba(191,161,74,0.18)] hover:shadow-[0_0_28px_rgba(191,161,74,0.3)]
                       transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            View My Report
          </button>
          <a
            href={`mailto:info@bioharmonysolutions.ca?subject=Re: My BioHarmony Report ${result.requestId}`}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
                       bg-white/[0.04] border border-white/10 text-[#F4EFE6]/70 text-sm
                       hover:border-white/20 hover:text-[#F4EFE6] transition-all duration-200"
          >
            <Mail className="w-4 h-4" />
            Contact Kathy
          </a>
        </div>

        <AnimatePresence>
          {showContactMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#0F5C5E]/15 border border-[#4ecdc4]/20 rounded-xl p-4 text-left mb-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#4ecdc4]/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-[#F4EFE6]/80 leading-relaxed">
                      Your report has been sent to{" "}
                      <span className="text-[#4ecdc4]">{result.email}</span>.
                      Please check your inbox and spam folder.
                    </p>
                    {result.whatsapp && (
                      <p className="text-xs text-[#F4EFE6]/45 mt-1">
                        WhatsApp delivery will also be sent to your registered number.
                      </p>
                    )}
                    {planHasAudio(result.plan) && (
                      <p className="text-xs text-[#F4EFE6]/45 mt-1">
                        Your audio narration is available below.
                      </p>
                    )}
                    <p className="text-xs text-[#F4EFE6]/35 mt-2">
                      Can't find it? Email us at{" "}
                      <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A] underline underline-offset-2">
                        info@bioharmonysolutions.ca
                      </a>{" "}
                      referencing {result.requestId}.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email sent confirmation */}
        {sentAt && (
          <p className="text-xs text-[#F4EFE6]/22 mb-0">
            Delivery email sent {sentAt}
          </p>
        )}
      </div>

      {/* BioHarmony Score — advanced & premium only */}
      {showScore && (
        <div className="border-t border-white/6 px-8 py-6">
          <BioHarmonyScore
            score={result.bioharmonyScore!}
            breakdown={parsedBreakdown}
          />
        </div>
      )}

      {/* Audio section */}
      <div className="border-t border-white/6 px-8 pb-8">
        <AudioSection result={result} />
      </div>
    </motion.div>
  );
}

// ── Pipeline stepper ───────────────────────────────────────────────────────────

function PipelineStepper({ stage, plan }: { stage: PipelineStageKey; plan: string }) {
  const currentIdx = STAGE_INDEX[stage] ?? 0;
  const isAudioPlan = planHasAudio(plan);
  return (
    <div className="space-y-0">
      {PIPELINE_STAGES.map((s, i) => {
        const isAudioStage = s.key === "audio_ready";
        const isSkipped = isAudioStage && !isAudioPlan;
        const isDone = isSkipped ? false : i < currentIdx;
        const isCurrent = !isSkipped && i === currentIdx;
        return (
          <div key={s.key} className={cn("flex gap-4", isSkipped && "opacity-25")}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all",
                isDone
                  ? "bg-[#BFA14A]/15 border border-[#BFA14A]/40 shadow-[0_0_12px_rgba(191,161,74,0.2)]"
                  : isCurrent
                    ? "bg-[#0F5C5E]/25 border-2 border-[#4ecdc4]/80 shadow-[0_0_16px_rgba(15,92,94,0.4)]"
                    : "bg-white/[0.03] border border-white/10"
              )}>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#BFA14A]" />
                ) : isCurrent ? (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ecdc4] opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4ecdc4]" />
                  </span>
                ) : (
                  <Circle className="w-4 h-4 text-white/15" />
                )}
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className={cn("w-px flex-1 my-1 min-h-[20px] transition-colors",
                  isDone ? "bg-[#BFA14A]/25" : "bg-white/6"
                )} />
              )}
            </div>
            <div className={cn("pb-5 pt-1.5", i === PIPELINE_STAGES.length - 1 && "pb-0")}>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={cn(
                  "text-sm font-medium leading-snug transition-colors",
                  isDone ? "text-[#BFA14A]" : isCurrent ? "text-[#F4EFE6]" : "text-[#F4EFE6]/25"
                )}>
                  {s.label}
                </p>
                {isCurrent && (
                  <span className="text-[10px] text-[#4ecdc4]/90 bg-[#0F5C5E]/20 border border-[#4ecdc4]/20 px-2 py-0.5 rounded-full uppercase tracking-wide font-medium">
                    In Progress
                  </span>
                )}
                {isSkipped && (
                  <span className="text-[10px] text-[#F4EFE6]/22 uppercase tracking-wide">Premium only</span>
                )}
              </div>
              {(isDone || isCurrent) && !isSkipped && (
                <p className={cn("text-xs mt-0.5 leading-relaxed",
                  isDone ? "text-[#F4EFE6]/30" : "text-[#F4EFE6]/55"
                )}>
                  {s.desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-white/6 last:border-0">
      <span className="text-xs text-[#F4EFE6]/35 uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-sm text-[#F4EFE6]/80 text-right">{value}</span>
    </div>
  );
}

// ── Result card ────────────────────────────────────────────────────────────────

function ResultCard({
  result, isLive, lastUpdated, refreshing,
}: {
  result: TrackResult; isLive: boolean; lastUpdated: Date | null; refreshing: boolean;
}) {
  const isDelivered = result.pipelineStage === "delivered";
  const stageIdx = STAGE_INDEX[result.pipelineStage] ?? 0;
  const progress = Math.round((stageIdx / (PIPELINE_STAGES.length - 1)) * 100);
  const submittedDate = new Date(result.createdAt).toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      <PaymentBanner paymentStatus={result.paymentStatus} />

      {/* Delivered hero — replaces header when done */}
      {isDelivered ? (
        <DeliveredSection result={result} />
      ) : (
        <div className="bg-[#0C1919] border border-white/10 rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#BFA14A]/50 to-transparent" />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.22em] mb-1.5">Report Status</p>
                <h2 className="text-xl font-serif text-[#F4EFE6]">{result.name}</h2>
                <p className="text-sm text-[#F4EFE6]/40 mt-1 font-mono tracking-wide">{result.requestId}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <PaymentStatusBadge status={result.paymentStatus} />
                {isLive && <LiveBadge lastUpdated={lastUpdated} />}
                {refreshing && <RefreshCw className="w-3.5 h-3.5 text-[#F4EFE6]/25 animate-spin" />}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Pipeline Progress</span>
                <span className="text-[10px] text-[#BFA14A]/60 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0F5C5E] to-[#BFA14A] rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-column content */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">

        {/* Stepper */}
        <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#BFA14A] font-medium">Pipeline Progress</p>
            {isLive && (
              <span className="text-[10px] text-[#F4EFE6]/25 italic">
                Auto-refreshes every ~{AUTO_REFRESH_MS / 1000}s
              </span>
            )}
          </div>
          <PipelineStepper stage={result.pipelineStage} plan={result.plan} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#BFA14A] mb-3 font-medium">Details</p>
            <DetailRow label="Report Type" value={result.reportType} />
            <DetailRow label="Plan" value={getPlanLabelWithPrice(result.plan)} />
            <DetailRow label="Language" value={LANG_LABELS[result.language] ?? result.language} />
            <DetailRow label="Submitted" value={submittedDate} />
            {result.fileName && <DetailRow label="File" value={result.fileName} />}
            <DetailRow label="Delivery" value={result.whatsapp ? "WhatsApp + Email" : "Email"} />
          </div>

          {!isDelivered && (
            <div className="bg-[#0C1919] border border-[#0F5C5E]/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-3.5 h-3.5 text-[#4ecdc4]/60" />
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#4ecdc4]/70 font-medium">Current Stage</p>
              </div>
              <p className="text-sm text-[#F4EFE6]/70 font-medium mb-1">
                {PIPELINE_STAGES[STAGE_INDEX[result.pipelineStage] ?? 0]?.label}
              </p>
              <p className="text-xs text-[#F4EFE6]/40 leading-relaxed">
                {PIPELINE_STAGES[STAGE_INDEX[result.pipelineStage] ?? 0]?.desc}
              </p>
            </div>
          )}

          <div className="bg-[#0C1919] border border-white/8 rounded-2xl p-5 text-center">
            <p className="text-xs text-[#F4EFE6]/35 mb-2">Questions about your report?</p>
            <a
              href="mailto:info@bioharmonysolutions.ca"
              className="text-sm text-[#4ecdc4] hover:text-[#4ecdc4]/70 transition-colors"
            >
              info@bioharmonysolutions.ca
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function TrackReport() {
  // Pre-fill ?id= from URL query param (used by the delivery email link)
  const [email, setEmail] = useState("");
  const [requestId, setRequestId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") ?? "";
  });
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [silentRefreshing, setSilentRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const emailRef = useRef(email);
  const requestIdRef = useRef(requestId);
  useEffect(() => { emailRef.current = email; }, [email]);
  useEffect(() => { requestIdRef.current = requestId; }, [requestId]);

  const doFetch = useCallback(async (silent = false) => {
    const formatted = formatRequestId(requestIdRef.current);
    if (!formatted) return;
    const numId = parseInt(formatted.replace("BH-", ""), 10);
    try {
      if (silent) setSilentRefreshing(true);
      else setLoading(true);
      const resp = await fetch(
        `${BASE}/api/scan-requests/track?id=${numId}&email=${encodeURIComponent(emailRef.current.trim())}`,
      );
      if (resp.ok) {
        const data = (await resp.json()) as TrackResult;
        setResult(data);
        setLastUpdated(new Date());
      }
    } catch { /* silent */ }
    finally {
      if (silent) setSilentRefreshing(false);
      else setLoading(false);
    }
  }, []);

  // Auto-refresh while pipeline is actively progressing (paid/waived, not yet delivered)
  const isLive = !!(
    result &&
    result.pipelineStage !== "delivered" &&
    (result.paymentStatus === "paid" || result.paymentStatus === "waived")
  );
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => { doFetch(true).catch(() => {}); }, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [isLive, doFetch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLastUpdated(null);
    const formatted = formatRequestId(requestId);
    if (!formatted) {
      setError("Invalid Request ID format. Use the format BH-0042 (found in your confirmation screen or email).");
      return;
    }
    setLoading(true);
    try {
      const numId = parseInt(formatted.replace("BH-", ""), 10);
      const resp = await fetch(
        `${BASE}/api/scan-requests/track?id=${numId}&email=${encodeURIComponent(email.trim())}`,
      );
      const data = (await resp.json()) as { error?: string } & Partial<TrackResult>;
      if (!resp.ok) {
        setError(data.error ?? "Could not find your request. Please check your ID and email.");
        return;
      }
      setResult(data as TrackResult);
      setLastUpdated(new Date());
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-[#F4EFE6] text-sm placeholder:text-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/50 transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#060D0D]">

      {/* Hero */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.3em] mb-4">BioHarmony Analytics</p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6] mb-4 leading-tight">Track Your Report</h1>
            <p className="text-[#F4EFE6]/50 text-lg leading-relaxed">
              Enter your email and Request ID to see exactly where your report is in our AI processing pipeline.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14">
        <div className="max-w-lg mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <form onSubmit={handleSubmit} className="bg-[#0C1919] border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="h-[2px] -mt-8 -mx-8 mb-8 rounded-t-2xl bg-gradient-to-r from-transparent via-[#BFA14A]/40 to-transparent" />
              <div>
                <label className="block text-xs text-[#F4EFE6]/45 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used at submission" className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs text-[#F4EFE6]/45 uppercase tracking-wider mb-2">Request ID</label>
                <input
                  type="text" required value={requestId} onChange={(e) => setRequestId(e.target.value)}
                  placeholder="e.g. BH-0042" className={`${inputCls} font-mono tracking-wider`}
                />
                <p className="text-xs text-[#F4EFE6]/22 mt-1.5 ml-1">Found on your confirmation screen or in your email.</p>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 text-sm text-red-400/80 bg-red-400/8 border border-red-400/18 rounded-xl px-4 py-3 overflow-hidden"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/20 text-[#F4EFE6] text-sm font-medium shadow-[0_0_20px_rgba(191,161,74,0.2)] hover:shadow-[0_0_32px_rgba(191,161,74,0.35)] disabled:opacity-60 transition-all duration-200"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Looking up your request…</>
                  : <><Search className="w-4 h-4" />Check Report Status</>}
              </button>
            </form>

            <div className="flex items-center justify-center gap-6 mt-5">
              {[
                { icon: <Lock className="w-3 h-3" />, label: "Secure lookup" },
                { icon: <FileText className="w-3 h-3" />, label: "Real-time status" },
                { icon: <MessageCircle className="w-3 h-3" />, label: "8-stage pipeline" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[#F4EFE6]/22 text-xs">
                  <span className="text-[#BFA14A]/35">{item.icon}</span>{item.label}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-[#F4EFE6]/22 mt-4">
              No Request ID?{" "}
              <Link href="/upload-scan" className="text-[#BFA14A]/55 hover:text-[#BFA14A] transition-colors underline underline-offset-2">
                Submit a new scan
              </Link>{" "}or email{" "}
              <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A]/55 hover:text-[#BFA14A] transition-colors">
                info@bioharmonysolutions.ca
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <section className="pb-20">
            <div className="max-w-3xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#F4EFE6]/25">Your Report</span>
                <div className="h-px flex-1 bg-white/8" />
              </div>
              <ResultCard result={result} isLive={isLive} lastUpdated={lastUpdated} refreshing={silentRefreshing} />
            </div>
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
