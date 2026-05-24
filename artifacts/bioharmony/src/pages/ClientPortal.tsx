import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { User, FileText, Clock, CheckCircle, Download, RefreshCw, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const PIPELINE_LABELS: Record<string, string> = {
  queued: "Queued", extracting: "Extracting Data", interpreting: "Interpreting",
  generating: "Generating Report", quality_check: "Quality Check",
  pdf_ready: "PDF Ready", audio_ready: "Audio Ready", delivered: "Delivered",
};
const PIPELINE_STAGES = ["queued","extracting","interpreting","generating","quality_check","pdf_ready","audio_ready","delivered"] as const;

const REPORT_TYPE_LABELS: Record<string, string> = {
  ao_scan: "AO Scan Analysis", inner_voice: "Inner Voice Analysis",
  pet_scan: "Pet Wellness Report", comprehensive: "Comprehensive Report",
};

interface ReportData {
  requestId: string; name: string; email: string; reportType: string;
  plan: string; language: string; status: string; pipelineStage: string;
  paymentStatus: string; bioharmonyScore: number | null; createdAt: string;
}

function StatusTimeline({ stage }: { stage: string }) {
  const idx = PIPELINE_STAGES.indexOf(stage as typeof PIPELINE_STAGES[number]);
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {PIPELINE_STAGES.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={s} className="flex items-center shrink-0">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full border transition-all",
              done ? "bg-[#4ecdc4] border-[#4ecdc4]" : active ? "bg-[#BFA14A] border-[#BFA14A] ring-2 ring-[#BFA14A]/30" : "bg-transparent border-white/15"
            )} />
            {i < PIPELINE_STAGES.length - 1 && (
              <div className={cn("h-px w-6 transition-all", i < idx ? "bg-[#4ecdc4]/60" : "bg-white/8")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ClientPortal() {
  const [email, setEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ReportData | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${BASE}/api/scan-requests/track?id=${encodeURIComponent(requestId.trim())}&email=${encodeURIComponent(email.trim())}`
      );
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        setError(body.error ?? "Could not find your report. Please check your details.");
        return;
      }
      const d = (await res.json()) as ReportData;
      setData(d);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDelivered = data?.pipelineStage === "delivered";
  const scoreLabel = data?.bioharmonyScore ? `${data.bioharmonyScore}/100` : "Pending";

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] py-16 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-3">BioHarmony Analytics</p>
          <h1 className="font-serif text-4xl text-[#F4EFE6] mb-3">Client Portal</h1>
          <p className="text-[#F4EFE6]/45 text-sm">Access your wellness reports and track your submission status.</p>
        </div>

        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div key="login" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-9 h-9 rounded-xl bg-[#BFA14A]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#BFA14A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F4EFE6]">Sign In</p>
                    <p className="text-xs text-[#F4EFE6]/40">Use the details from your confirmation email</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#F4EFE6]/50 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 text-sm focus:outline-none focus:border-[#BFA14A]/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#F4EFE6]/50 uppercase tracking-wider mb-2">Request ID</label>
                    <input type="text" required value={requestId} onChange={(e) => setRequestId(e.target.value)}
                      placeholder="BH-0001"
                      className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 text-sm focus:outline-none focus:border-[#BFA14A]/50 transition"
                    />
                    <p className="text-[10px] text-[#F4EFE6]/25 mt-1.5">Found in your submission confirmation email.</p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/15 border border-red-700/25">
                      <AlertTriangle className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-400/80">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-[#BFA14A] text-[#060D0D] rounded-xl font-semibold text-sm hover:bg-[#d4b456] transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : <>Access My Report <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>

              <div className="text-center mt-6 space-y-3">
                <p className="text-xs text-[#F4EFE6]/30">Don't have a report yet?</p>
                <Link href="/upload-scan" className="inline-block text-sm text-[#BFA14A]/70 hover:text-[#BFA14A] transition">
                  Submit a new scan →
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="report" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* Welcome card */}
              <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#BFA14A] uppercase tracking-widest mb-1">Welcome back</p>
                    <h2 className="font-serif text-2xl text-[#F4EFE6]">{data.name}</h2>
                    <p className="text-[#F4EFE6]/45 text-sm mt-1">{REPORT_TYPE_LABELS[data.reportType] ?? data.reportType}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">{data.requestId}</p>
                    <p className="text-xs text-[#F4EFE6]/40 mt-1 capitalize">{data.plan} Plan</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-6">
                <p className="text-xs uppercase tracking-widest text-[#BFA14A] mb-4 font-medium">Report Status</p>
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "text-sm font-semibold",
                    isDelivered ? "text-green-400" : "text-[#BFA14A]"
                  )}>
                    {isDelivered
                      ? "✓ Delivered"
                      : PIPELINE_LABELS[data.pipelineStage] ?? data.pipelineStage}
                  </span>
                  {!isDelivered && (
                    <button onClick={() => setData(null)} className="text-[10px] text-[#F4EFE6]/30 hover:text-[#F4EFE6]/60 flex items-center gap-1 transition">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                  )}
                </div>
                <StatusTimeline stage={data.pipelineStage} />
                {isDelivered && data.bioharmonyScore && (
                  <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                    <span className="text-xs text-[#F4EFE6]/40">BioHarmony Score</span>
                    <span className="text-[#BFA14A] font-bold">{scoreLabel}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isDelivered && (
                  <Link href={`/report/${data.requestId}?email=${encodeURIComponent(data.email)}`}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#BFA14A] text-[#060D0D] font-semibold text-sm hover:bg-[#d4b456] transition"
                  >
                    <FileText className="w-4 h-4" />
                    <div>
                      <p>View Full Report</p>
                      <p className="text-[11px] opacity-60 font-normal">Score · PDF · Audio</p>
                    </div>
                  </Link>
                )}
                {isDelivered && (
                  <button className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/12 text-[#F4EFE6]/70 text-sm hover:border-white/25 hover:text-[#F4EFE6] transition">
                    <Download className="w-4 h-4" />
                    <div className="text-left">
                      <p>Download PDF</p>
                      <p className="text-[11px] opacity-50 font-normal">Your wellness report</p>
                    </div>
                  </button>
                )}
                {!isDelivered && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/8 text-[#F4EFE6]/35 text-sm col-span-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <p>Your report will appear here once delivered. You'll receive an email notification.</p>
                  </div>
                )}
              </div>

              {/* Submit another */}
              <div className="pt-2 text-center">
                <Link href="/upload-scan" className="inline-flex items-center gap-2 text-sm text-[#F4EFE6]/40 hover:text-[#BFA14A]/70 transition">
                  Submit another scan <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <button onClick={() => setData(null)} className="w-full text-xs text-[#F4EFE6]/25 hover:text-[#F4EFE6]/50 transition pt-2">
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
