import { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  RefreshCw, LogOut, ChevronRight, AlertTriangle, CreditCard,
  Zap, RotateCcw, Pause, Play, X, CheckCircle, Activity
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const ADMIN_PASSWORD_KEY = "bh_admin_token";

// ── Constants ──────────────────────────────────────────────────────────────────

const VALID_STATUSES = ["new", "in_review", "in_progress", "completed", "delivered"] as const;
type Status = (typeof VALID_STATUSES)[number];

const PIPELINE_STAGES = [
  "queued", "extracting", "interpreting", "generating",
  "quality_check", "pdf_ready", "audio_ready", "delivered",
] as const;
type PipelineStage = (typeof PIPELINE_STAGES)[number];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "waived"] as const;
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

type AutoStatus = "auto" | "waiting" | "paused" | "error" | "done" | "manual";

const PIPELINE_LABELS: Record<PipelineStage, string> = {
  queued: "Queued", extracting: "Extracting", interpreting: "Interpreting",
  generating: "Generating", quality_check: "Quality Check",
  pdf_ready: "PDF Ready", audio_ready: "Audio Ready", delivered: "Delivered",
};

const PIPELINE_NEXT: Record<PipelineStage, PipelineStage | null> = {
  queued: "extracting", extracting: "interpreting", interpreting: "generating",
  generating: "quality_check", quality_check: "pdf_ready",
  pdf_ready: "audio_ready", audio_ready: "delivered", delivered: null,
};

const PIPELINE_STYLES: Record<PipelineStage, string> = {
  queued: "bg-white/8 text-[#F4EFE6]/50 border border-white/12",
  extracting: "bg-blue-900/30 text-blue-300 border border-blue-700/30",
  interpreting: "bg-purple-900/30 text-purple-300 border border-purple-700/30",
  generating: "bg-violet-900/30 text-violet-300 border border-violet-700/30",
  quality_check: "bg-[#BFA14A]/12 text-[#BFA14A] border border-[#BFA14A]/30",
  pdf_ready: "bg-[#0F5C5E]/30 text-[#4ecdc4] border border-[#0F5C5E]/40",
  audio_ready: "bg-teal-900/30 text-teal-300 border border-teal-700/30",
  delivered: "bg-green-900/30 text-green-300 border border-green-700/30",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-[#BFA14A]/12 text-[#BFA14A] border border-[#BFA14A]/25",
  paid: "bg-green-900/25 text-green-300 border border-green-700/25",
  failed: "bg-red-900/25 text-red-400 border border-red-700/25",
  waived: "bg-purple-900/25 text-purple-300 border border-purple-700/25",
};

const STATUS_LABELS: Record<Status, string> = {
  new: "New", in_review: "In Review", in_progress: "In Progress",
  completed: "Completed", delivered: "Delivered",
};

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-[#BFA14A]/12 text-[#BFA14A] border border-[#BFA14A]/25",
  in_review: "bg-blue-900/25 text-blue-300 border border-blue-700/25",
  in_progress: "bg-[#0F5C5E]/30 text-[#4ecdc4] border border-[#0F5C5E]/40",
  completed: "bg-green-900/25 text-green-300 border border-green-700/25",
  delivered: "bg-purple-900/25 text-purple-300 border border-purple-700/25",
};

const STATUS_NEXT: Record<Status, Status[]> = {
  new: ["in_review", "in_progress"], in_review: ["in_progress", "completed"],
  in_progress: ["completed"], completed: ["delivered"], delivered: [],
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface UnifiedRequest {
  id: number;
  source: "report" | "scan";
  name: string;
  email: string;
  phone?: string | null;
  reportType: string;
  language?: string | null;
  fileName?: string | null;
  whatsapp?: boolean | null;
  plan?: string | null;
  note?: string | null;
  status: Status;
  pipelineStage?: PipelineStage | null;
  paymentStatus?: PaymentStatus | null;
  pipelinePaused?: boolean | null;
  pipelineError?: string | null;
  stageEnteredAt?: string | null;
  deliveredEmailSentAt?: string | null;
  createdAt: string;
}

interface RawReportRequest {
  id: number; firstName: string; email: string;
  reportType: string; note?: string | null; status: string; createdAt: string;
}

interface RawScanRequest {
  id: number; name: string; email: string; phone?: string | null;
  reportType: string; language: string; fileName?: string | null;
  whatsapp?: boolean | null; plan?: string | null; note?: string | null;
  status: string; pipelineStage?: string | null; paymentStatus?: string | null;
  pipelinePaused?: boolean | null; pipelineError?: string | null;
  stageEnteredAt?: string | null; deliveredEmailSentAt?: string | null; createdAt: string;
}

// ── Normalizers ────────────────────────────────────────────────────────────────

function normalizeStatus(s: string): Status {
  return VALID_STATUSES.includes(s as Status) ? (s as Status) : "new";
}
function normalizePipelineStage(s: string | null | undefined): PipelineStage | null {
  if (!s) return null;
  return PIPELINE_STAGES.includes(s as PipelineStage) ? (s as PipelineStage) : null;
}
function normalizePaymentStatus(s: string | null | undefined): PaymentStatus | null {
  if (!s) return null;
  return PAYMENT_STATUSES.includes(s as PaymentStatus) ? (s as PaymentStatus) : null;
}

function normalize(r: RawReportRequest): UnifiedRequest {
  return {
    id: r.id, source: "report", name: r.firstName, email: r.email,
    reportType: r.reportType, note: r.note,
    status: normalizeStatus(r.status), createdAt: r.createdAt,
  };
}
function normalizeScan(s: RawScanRequest): UnifiedRequest {
  return {
    id: s.id, source: "scan", name: s.name, email: s.email, phone: s.phone,
    reportType: s.reportType, language: s.language, fileName: s.fileName,
    whatsapp: s.whatsapp, plan: s.plan, note: s.note,
    status: normalizeStatus(s.status),
    pipelineStage: normalizePipelineStage(s.pipelineStage),
    paymentStatus: normalizePaymentStatus(s.paymentStatus),
    pipelinePaused: s.pipelinePaused ?? false,
    pipelineError: s.pipelineError ?? null,
    stageEnteredAt: s.stageEnteredAt ?? null,
    deliveredEmailSentAt: s.deliveredEmailSentAt ?? null,
    createdAt: s.createdAt,
  };
}

// ── Automation status helper ───────────────────────────────────────────────────

function getAutoStatus(req: UnifiedRequest): AutoStatus {
  if (req.source !== "scan") return "manual";
  if (req.pipelineStage === "delivered") return "done";
  if (req.pipelineError) return "error";
  if (req.pipelinePaused) return "paused";
  if (req.paymentStatus === "paid" || req.paymentStatus === "waived") return "auto";
  return "waiting";
}

// ── Utility ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function stageElapsed(enteredAt: string | null | undefined): string | null {
  if (!enteredAt) return null;
  const secs = Math.round((Date.now() - new Date(enteredAt).getTime()) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.round(secs / 60)}m`;
}

// ── Badge components ───────────────────────────────────────────────────────────

function PipelineBadge({ stage }: { stage: PipelineStage | null | undefined }) {
  if (!stage) return <span className="text-xs text-[#F4EFE6]/20">—</span>;
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PIPELINE_STYLES[stage])}>
      {PIPELINE_LABELS[stage]}
    </span>
  );
}
function PaymentBadge({ status }: { status: PaymentStatus | null | undefined }) {
  if (!status) return <span className="text-xs text-[#F4EFE6]/20">—</span>;
  const labels: Record<PaymentStatus, string> = {
    pending: "Pending", paid: "Paid ✓", failed: "Failed ✗", waived: "Waived",
  };
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PAYMENT_STYLES[status])}>
      {labels[status]}
    </span>
  );
}
function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function AutoStatusDot({ autoStatus }: { autoStatus: AutoStatus }) {
  if (autoStatus === "manual") return null;
  const map: Record<AutoStatus, { dot: string; title: string }> = {
    auto:    { dot: "bg-[#4ecdc4] animate-pulse shadow-[0_0_6px_rgba(78,205,196,0.7)]", title: "Auto-running" },
    waiting: { dot: "bg-[#BFA14A]",                                                      title: "Awaiting payment" },
    paused:  { dot: "bg-white/30",                                                        title: "Paused" },
    error:   { dot: "bg-red-500 animate-pulse",                                           title: "Error" },
    done:    { dot: "bg-green-400",                                                        title: "Delivered" },
    manual:  { dot: "",                                                                    title: "" },
  };
  const m = map[autoStatus];
  return (
    <span
      title={m.title}
      className={cn("inline-block w-2 h-2 rounded-full shrink-0 mr-1", m.dot)}
    />
  );
}

function AutoStatusLabel({ autoStatus }: { autoStatus: AutoStatus }) {
  const map: Record<AutoStatus, { label: string; style: string } | null> = {
    auto:    { label: "Auto", style: "text-[#4ecdc4]/70" },
    waiting: { label: "Awaiting Payment", style: "text-[#BFA14A]/70" },
    paused:  { label: "Paused", style: "text-[#F4EFE6]/35" },
    error:   { label: "Error", style: "text-red-400/80" },
    done:    null,
    manual:  null,
  };
  const m = map[autoStatus];
  if (!m) return null;
  return <span className={cn("text-[10px] font-medium", m.style)}>{m.label}</span>;
}

function StatCard({ label, value, color, onClick, active }: {
  label: string; value: number; color: string;
  onClick?: () => void; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 min-w-[100px] rounded-xl border p-4 text-left transition-all",
        active ? "border-[#BFA14A] bg-[#BFA14A]/8" : "border-white/8 bg-[#0C1919] hover:border-white/18"
      )}
    >
      <div className={cn("text-2xl font-bold", color)}>{value}</div>
      <div className="text-xs text-[#F4EFE6]/40 mt-1">{label}</div>
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-[#F4EFE6]/35 min-w-[110px] shrink-0">{label}</span>
      <span className="text-[#F4EFE6]/85 break-all">{value}</span>
    </div>
  );
}

// ── Pipeline Panel ─────────────────────────────────────────────────────────────

function PipelinePanel({
  request, token, onUpdate,
}: {
  request: UnifiedRequest;
  token: string;
  onUpdate: (id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) => void;
}) {
  const [busy, setBusy] = useState(false);

  const patchRequest = useCallback(async (payload: Record<string, unknown>) => {
    setBusy(true);
    onUpdate(request.id, request.source, payload as Partial<UnifiedRequest>);
    try {
      await fetch(`${BASE}/api/admin/requests/${request.source}/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
    } catch { /* optimistic update already applied */ }
    setBusy(false);
  }, [request.id, request.source, token, onUpdate]);

  if (request.source !== "scan") return null;

  const currentStage = request.pipelineStage ?? "queued";
  const nextStage = PIPELINE_NEXT[currentStage];
  const stageIdx = PIPELINE_STAGES.indexOf(currentStage);
  const autoStatus = getAutoStatus(request);
  const elapsed = stageElapsed(request.stageEnteredAt);
  const isPaused = !!request.pipelinePaused;
  const hasError = !!request.pipelineError;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] font-medium">AI Pipeline</h3>
        <div className="flex items-center gap-1.5">
          <AutoStatusDot autoStatus={autoStatus} />
          <AutoStatusLabel autoStatus={autoStatus} />
        </div>
      </div>

      {/* Error banner */}
      {hasError && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-900/15 border border-red-700/25">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-red-300 font-medium mb-0.5">Pipeline Error</p>
            <p className="text-xs text-red-300/70">{request.pipelineError}</p>
          </div>
          <button
            disabled={busy}
            onClick={() => patchRequest({ pipelineError: null })}
            title="Clear error and resume"
            className="text-red-400/50 hover:text-red-300 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Stage timer */}
      {elapsed && autoStatus === "auto" && (
        <p className="text-[10px] text-[#F4EFE6]/25 italic">
          Current stage running for {elapsed}
        </p>
      )}

      {/* Stage selector */}
      <div className="space-y-1.5">
        {PIPELINE_STAGES.map((s, i) => {
          const isDone = i < stageIdx;
          const isCurrent = i === stageIdx;
          return (
            <button
              key={s}
              disabled={busy}
              onClick={() => patchRequest({ pipelineStage: s })}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                isCurrent
                  ? `${PIPELINE_STYLES[s]} ring-1 ring-inset ring-current/30`
                  : isDone
                    ? "bg-white/4 text-[#F4EFE6]/45 border-white/6"
                    : "bg-transparent text-[#F4EFE6]/22 border-white/5 hover:border-white/12 hover:text-[#F4EFE6]/45",
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isDone ? "bg-[#BFA14A]/40"
                    : isCurrent
                      ? autoStatus === "auto" ? "bg-current animate-pulse" : "bg-current"
                      : "bg-white/12"
                )} />
                {PIPELINE_LABELS[s]}
              </span>
              {isCurrent && <span className="opacity-50 text-[10px]">current</span>}
            </button>
          );
        })}
      </div>

      {/* Action buttons row */}
      <div className="flex gap-2 flex-wrap">
        {nextStage && (
          <button
            disabled={busy || isPaused || hasError}
            onClick={() => patchRequest({ pipelineStage: nextStage })}
            className="flex items-center gap-1.5 flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold bg-[#0F5C5E] text-[#F4EFE6] border border-[#4ecdc4]/20 hover:bg-[#0F5C5E]/80 transition disabled:opacity-40"
          >
            <Zap className="w-3 h-3" />
            Advance → {PIPELINE_LABELS[nextStage]}
          </button>
        )}
        <button
          disabled={busy}
          onClick={() => patchRequest({ pipelineStage: currentStage })}
          title="Re-trigger current stage"
          className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-white/10 text-[#F4EFE6]/50 hover:border-white/20 hover:text-[#F4EFE6]/70 transition disabled:opacity-40"
        >
          <RotateCcw className="w-3 h-3" />
          Retry
        </button>
      </div>

      {/* Pause / Resume automation */}
      <div className="border-t border-white/8 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Automation</span>
          {autoStatus === "auto" && <span className="text-[10px] text-[#4ecdc4]/60">Running</span>}
          {autoStatus === "paused" && <span className="text-[10px] text-[#F4EFE6]/30">Paused</span>}
        </div>
        <div className="flex gap-2">
          <button
            disabled={busy || isPaused}
            onClick={() => patchRequest({ pipelinePaused: true })}
            className="flex items-center gap-1.5 flex-1 py-2 px-3 rounded-lg text-xs font-medium border border-white/10 text-[#F4EFE6]/45 hover:border-white/22 hover:text-[#F4EFE6]/70 transition disabled:opacity-30"
          >
            <Pause className="w-3 h-3" />
            Pause
          </button>
          <button
            disabled={busy || !isPaused}
            onClick={() => patchRequest({ pipelinePaused: false })}
            className="flex items-center gap-1.5 flex-1 py-2 px-3 rounded-lg text-xs font-medium border border-[#4ecdc4]/20 text-[#4ecdc4]/50 hover:border-[#4ecdc4]/35 hover:text-[#4ecdc4]/80 transition disabled:opacity-30"
          >
            <Play className="w-3 h-3" />
            Resume
          </button>
          <button
            disabled={busy}
            onClick={() => patchRequest({ pipelineStage: "delivered", status: "delivered" })}
            title="Manually mark as delivered"
            className="flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-green-700/25 text-green-400/50 hover:border-green-700/40 hover:text-green-300 transition disabled:opacity-30"
          >
            <CheckCircle className="w-3 h-3" />
            Deliver
          </button>
        </div>
      </div>

      {/* Payment override */}
      <div className="border-t border-white/8 pt-3">
        <h4 className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider mb-2">Payment Override</h4>
        <div className="flex gap-1.5 flex-wrap">
          {PAYMENT_STATUSES.map((ps) => (
            <button
              key={ps}
              disabled={busy || request.paymentStatus === ps}
              onClick={() => patchRequest({ paymentStatus: ps })}
              className={cn(
                "flex-1 min-w-[60px] py-1.5 px-2 rounded-lg text-[10px] font-medium border transition-all capitalize",
                request.paymentStatus === ps
                  ? PAYMENT_STYLES[ps]
                  : "border-white/8 text-[#F4EFE6]/30 hover:border-white/18 hover:text-[#F4EFE6]/60 disabled:cursor-default"
              )}
            >
              {ps}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Email Delivery Section ─────────────────────────────────────────────────────

function EmailDeliverySection({
  request, token, onUpdate,
}: {
  request: UnifiedRequest;
  token: string;
  onUpdate: (id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const sentAt = request.deliveredEmailSentAt
    ? new Date(request.deliveredEmailSentAt).toLocaleString("en-CA", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  const isDelivered = request.pipelineStage === "delivered";

  async function handleResend() {
    setBusy(true);
    setResendSuccess(false);
    try {
      const resp = await fetch(
        `${BASE}/api/admin/requests/scan/${request.id}/resend-delivery-email`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      if (resp.ok) {
        const now = new Date().toISOString();
        onUpdate(request.id, "scan", { deliveredEmailSentAt: now });
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 4000);
      }
    } catch { /* ignore */ }
    setBusy(false);
  }

  return (
    <section>
      <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">
        Delivery Email
      </h3>

      <div className="bg-white/[0.02] border border-white/8 rounded-xl p-4 space-y-3">
        {/* Status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0",
              sentAt ? "bg-green-400" : isDelivered ? "bg-[#BFA14A]" : "bg-white/20"
            )} />
            <span className={cn(
              "text-xs font-medium",
              sentAt ? "text-green-300" : isDelivered ? "text-[#BFA14A]" : "text-[#F4EFE6]/35"
            )}>
              {sentAt
                ? `Sent ${sentAt}`
                : isDelivered
                  ? "Not yet sent"
                  : "Sends automatically when delivered"}
            </span>
          </div>
          {sentAt && (
            <span className="text-[10px] text-[#F4EFE6]/25 shrink-0">To: {request.email}</span>
          )}
        </div>

        {/* Subject preview */}
        <div className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/6">
          <p className="text-[10px] text-[#F4EFE6]/25 uppercase tracking-wider mb-0.5">Subject</p>
          <p className="text-xs text-[#F4EFE6]/60 font-mono">Your BioHarmony Report Is Ready</p>
        </div>

        {/* Success message */}
        {resendSuccess && (
          <p className="text-xs text-green-300/80 bg-green-900/15 border border-green-700/25 rounded-lg px-3 py-2">
            Email sent successfully to {request.email}
          </p>
        )}

        {/* Resend button — only available when delivered */}
        {isDelivered && (
          <button
            disabled={busy}
            onClick={handleResend}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border border-[#BFA14A]/20 text-[#BFA14A]/60 hover:border-[#BFA14A]/40 hover:text-[#BFA14A] transition disabled:opacity-40"
          >
            {busy
              ? <><span className="inline-block w-3 h-3 border border-current/40 border-t-current rounded-full animate-spin" />Sending…</>
              : <>{sentAt ? "↩ Resend Email" : "✉ Send Now"}</>
            }
          </button>
        )}
      </div>
    </section>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────

function DetailPanel({
  request, token, onClose, onUpdate,
}: {
  request: UnifiedRequest;
  token: string;
  onClose: () => void;
  onUpdate: (id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) => void;
}) {
  const [busy, setBusy] = useState(false);

  const langMap: Record<string, string> = {
    en: "English", es: "Spanish", fr: "French", pt: "Portuguese",
    de: "German", zh: "Chinese", ar: "Arabic", hi: "Hindi",
  };
  const planMap: Record<string, string> = {
    basic: "Basic — $55", advanced: "Advanced — $99", premium: "Premium — $149",
  };

  async function changeStatus(status: Status) {
    setBusy(true);
    onUpdate(request.id, request.source, { status });
    try {
      await fetch(`${BASE}/api/admin/requests/${request.source}/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
    } catch { /* optimistic */ }
    setBusy(false);
  }

  const autoStatus = getAutoStatus(request);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg h-full bg-[#0C1919] border-l border-white/10 overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0C1919]/96 backdrop-blur-sm flex items-center justify-between p-6 border-b border-white/10 z-10">
          <div>
            <h2 className="text-lg font-semibold text-[#F4EFE6]">{request.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium border",
                request.source === "scan"
                  ? "bg-[#0F5C5E]/25 text-[#4ecdc4] border-[#0F5C5E]/35"
                  : "bg-[#BFA14A]/10 text-[#BFA14A] border-[#BFA14A]/20"
              )}>
                {request.source === "scan" ? "Scan Upload" : "Report Request"}
              </span>
              <StatusBadge status={request.status} />
              {request.pipelineStage && <PipelineBadge stage={request.pipelineStage} />}
              {request.paymentStatus && <PaymentBadge status={request.paymentStatus} />}
            </div>
          </div>
          <button onClick={onClose} className="text-[#F4EFE6]/35 hover:text-[#F4EFE6] transition text-xl ml-4 shrink-0">✕</button>
        </div>

        <div className="flex-1 p-6 space-y-7">
          {/* Automation status banner */}
          {autoStatus === "error" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-red-900/15 border border-red-700/25">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300">Pipeline error — review before advancing.</p>
            </div>
          )}
          {autoStatus === "auto" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F5C5E]/15 border border-[#4ecdc4]/20">
              <Activity className="w-4 h-4 text-[#4ecdc4] shrink-0" />
              <p className="text-xs text-[#4ecdc4]/80">
                Auto-progressing through pipeline. Stage running for {stageElapsed(request.stageEnteredAt) ?? "…"}.
              </p>
            </div>
          )}
          {autoStatus === "waiting" && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#BFA14A]/8 border border-[#BFA14A]/20">
              <CreditCard className="w-4 h-4 text-[#BFA14A] shrink-0" />
              <p className="text-xs text-[#BFA14A]/80">Waiting for payment before pipeline starts.</p>
            </div>
          )}

          {/* Client Info */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">Client Info</h3>
            <div className="space-y-2">
              <DetailRow label="Name" value={request.name} />
              <DetailRow label="Email" value={request.email} />
              {request.phone && (
                <DetailRow label="Phone" value={request.phone + (request.whatsapp ? "  ✓ WhatsApp" : "")} />
              )}
            </div>
          </section>

          {/* Submission Details */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">Submission</h3>
            <div className="space-y-2">
              <DetailRow label="Report Type" value={request.reportType} />
              {request.plan && <DetailRow label="Plan" value={planMap[request.plan] ?? request.plan} />}
              {request.language && <DetailRow label="Language" value={langMap[request.language] ?? request.language} />}
              {request.fileName && <DetailRow label="File" value={request.fileName} />}
              <DetailRow label="Submitted" value={formatDate(request.createdAt)} />
              <DetailRow label="Request ID" value={`BH-${request.id.toString().padStart(4, "0")}`} />
            </div>
          </section>

          {request.note && (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">Client Notes</h3>
              <p className="text-sm text-[#F4EFE6]/65 bg-white/5 rounded-xl p-3 border border-white/8 leading-relaxed">{request.note}</p>
            </section>
          )}

          {/* Pipeline control (scan only) */}
          {request.source === "scan" && (
            <PipelinePanel request={request} token={token} onUpdate={onUpdate} />
          )}

          {/* Delivery email status (scan only) */}
          {request.source === "scan" && (
            <EmailDeliverySection request={request} token={token} onUpdate={onUpdate} />
          )}

          {/* Legacy status override */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">Status Override</h3>
            <div className="grid grid-cols-2 gap-2">
              {VALID_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy || request.status === s}
                  onClick={() => changeStatus(s)}
                  className={cn(
                    "py-2 px-3 rounded-lg text-xs font-medium text-left transition-all border",
                    request.status === s
                      ? `${STATUS_STYLES[s]} cursor-default`
                      : "border-white/8 text-[#F4EFE6]/50 hover:border-white/18 hover:text-[#F4EFE6]/75 hover:bg-white/5 disabled:cursor-default"
                  )}
                >
                  {STATUS_LABELS[s]}
                  {request.status === s && <span className="ml-1 opacity-40">●</span>}
                </button>
              ))}
            </div>
          </section>

          {STATUS_NEXT[request.status].length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {STATUS_NEXT[request.status].map((ns) => (
                <button
                  key={ns}
                  disabled={busy}
                  onClick={() => changeStatus(ns)}
                  className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#BFA14A] text-[#060D0D] hover:bg-[#d4b456] transition disabled:opacity-50"
                >
                  Mark {STATUS_LABELS[ns]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Auth Gate ──────────────────────────────────────────────────────────────────

function AuthGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.trim()) return;
    onAuth(pw.trim());
    setError("Wrong password. Try again.");
    setPw("");
  }
  return (
    <div className="min-h-screen bg-[#060D0D] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="text-[#BFA14A] text-xs tracking-[0.3em] uppercase mb-2">BioHarmony Solutions</div>
          <h1 className="text-2xl font-light text-[#F4EFE6]">Admin Dashboard</h1>
        </div>
        <form onSubmit={submit} className="bg-[#0C1919] border border-white/10 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-xs text-[#F4EFE6]/45 mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password" value={pw} onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white/5 border border-white/12 rounded-lg px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/60 transition"
              placeholder="Enter admin password" autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-lg bg-[#BFA14A] text-[#060D0D] font-semibold hover:bg-[#d4b456] transition">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(ADMIN_PASSWORD_KEY));
  const [requests, setRequests] = useState<UnifiedRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "report" | "scan">("all");
  const [payFilter, setPayFilter] = useState<PaymentStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UnifiedRequest | null>(null);
  const [globalPaused, setGlobalPaused] = useState(false);
  const [togglingGlobal, setTogglingGlobal] = useState(false);

  const fetchData = useCallback(async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const [leadsResp, statusResp] = await Promise.all([
        fetch(`${BASE}/api/admin/leads`, { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch(`${BASE}/api/admin/pipeline/status`, { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);
      if (leadsResp.status === 401) {
        sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
        setToken(null);
        return;
      }
      if (!leadsResp.ok) throw new Error("Failed to fetch");

      const data = await leadsResp.json() as {
        reportRequests?: RawReportRequest[];
        scanRequests?: RawScanRequest[];
      };
      const unified: UnifiedRequest[] = [
        ...(data.reportRequests ?? []).map(normalize),
        ...(data.scanRequests ?? []).map(normalizeScan),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequests(unified);

      if (statusResp.ok) {
        const statusData = await statusResp.json() as { globalPaused: boolean };
        setGlobalPaused(statusData.globalPaused);
      }
    } catch {
      setError("Could not load requests. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleAuth(pw: string) {
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, pw);
    setToken(pw);
    fetchData(pw);
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setToken(null);
    setRequests([]);
  }

  useEffect(() => {
    if (token) fetchData(token);
  }, []);

  async function toggleGlobalPipeline() {
    if (!token) return;
    setTogglingGlobal(true);
    const endpoint = globalPaused ? "global-resume" : "global-pause";
    try {
      const resp = await fetch(`${BASE}/api/admin/pipeline/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        setGlobalPaused(!globalPaused);
      }
    } catch { /* ignore */ }
    setTogglingGlobal(false);
  }

  function handleUpdate(id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) {
    setRequests((prev) => prev.map((r) => r.id === id && r.source === source ? { ...r, ...patch } : r));
    if (selected?.id === id && selected?.source === source) {
      setSelected((prev) => prev ? { ...prev, ...patch } : prev);
    }
  }

  const stats = useMemo(() => {
    const total = requests.length;
    const autoRunning = requests.filter((r) => getAutoStatus(r) === "auto").length;
    const waitingPay = requests.filter((r) => getAutoStatus(r) === "waiting").length;
    const errors = requests.filter((r) => getAutoStatus(r) === "error").length;
    const paid = requests.filter((r) => r.paymentStatus === "paid").length;
    const delivered = requests.filter((r) => r.pipelineStage === "delivered" || r.status === "delivered").length;
    const byStatus = VALID_STATUSES.reduce((acc, s) => {
      acc[s] = requests.filter((r) => r.status === s).length;
      return acc;
    }, {} as Record<Status, number>);
    return { total, autoRunning, waitingPay, errors, paid, delivered, ...byStatus };
  }, [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (sourceFilter !== "all") list = list.filter((r) => r.source === sourceFilter);
    if (payFilter !== "all") list = list.filter((r) => r.paymentStatus === payFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.reportType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, statusFilter, sourceFilter, payFilter, search]);

  if (!token) return <AuthGate onAuth={handleAuth} />;

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6]">

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#060D0D]/96 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[#BFA14A] text-xs tracking-[0.25em] uppercase font-medium">BioHarmony</span>
            <span className="text-white/15">·</span>
            <span className="text-[#F4EFE6]/50 text-xs">Operations Center</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Global pipeline toggle */}
            <button
              disabled={togglingGlobal}
              onClick={toggleGlobalPipeline}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition",
                globalPaused
                  ? "border-[#4ecdc4]/30 text-[#4ecdc4]/60 hover:border-[#4ecdc4]/50 hover:text-[#4ecdc4]"
                  : "border-[#BFA14A]/25 text-[#BFA14A]/60 hover:border-[#BFA14A]/45 hover:text-[#BFA14A]"
              )}
              title={globalPaused ? "Resume all pipeline automation" : "Pause all pipeline automation"}
            >
              {globalPaused
                ? <><Play className="w-3 h-3" />Resume All</>
                : <><Pause className="w-3 h-3" />Pause All</>
              }
            </button>

            <button
              onClick={() => token && fetchData(token)}
              className="flex items-center gap-1.5 text-xs text-[#F4EFE6]/35 hover:text-[#F4EFE6]/70 transition px-3 py-1.5 rounded border border-white/8 hover:border-white/18"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-[#F4EFE6]/35 hover:text-red-400 transition px-3 py-1.5 rounded border border-white/8 hover:border-red-900/40"
            >
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-7">

        {/* Global pause banner */}
        {globalPaused && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/12">
            <Pause className="w-4 h-4 text-[#F4EFE6]/40 shrink-0" />
            <p className="text-sm text-[#F4EFE6]/60">
              Pipeline automation is globally paused. No requests will auto-advance until you resume.
            </p>
            <button
              onClick={toggleGlobalPipeline}
              className="ml-auto text-xs text-[#4ecdc4]/60 hover:text-[#4ecdc4] transition underline underline-offset-2 shrink-0"
            >
              Resume
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="All Requests" value={stats.total} color="text-[#F4EFE6]" onClick={() => setStatusFilter("all")} active={statusFilter === "all"} />
          <StatCard label="Auto-Running" value={stats.autoRunning} color="text-[#4ecdc4]" />
          <StatCard label="Await Payment" value={stats.waitingPay} color="text-[#BFA14A]" onClick={() => setPayFilter(payFilter === "pending" ? "all" : "pending")} active={payFilter === "pending"} />
          {stats.errors > 0 && (
            <StatCard label="Errors" value={stats.errors} color="text-red-400" />
          )}
          <StatCard label="Paid" value={stats.paid} color="text-green-300" onClick={() => setPayFilter(payFilter === "paid" ? "all" : "paid")} active={payFilter === "paid"} />
          <StatCard label="Delivered" value={stats.delivered} color="text-emerald-300" onClick={() => setStatusFilter("delivered")} active={statusFilter === "delivered"} />
        </div>

        {/* Payment alert */}
        {stats.waitingPay > 0 && payFilter !== "pending" && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#BFA14A]/6 border border-[#BFA14A]/20 cursor-pointer"
            onClick={() => setPayFilter("pending")}
          >
            <CreditCard className="w-4 h-4 text-[#BFA14A] shrink-0" />
            <p className="text-sm text-[#BFA14A]/80">
              <span className="font-semibold text-[#BFA14A]">{stats.waitingPay}</span>
              {" "}request{stats.waitingPay !== 1 ? "s" : ""} awaiting payment — pipeline will start automatically once confirmed.{" "}
              <span className="text-[#BFA14A]/55 text-xs underline underline-offset-2">Filter</span>
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email or report type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0C1919] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-[#F4EFE6] placeholder-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/40 transition"
          />
          <div className="flex gap-2 shrink-0 flex-wrap">
            {(["all", "report", "scan"] as const).map((s) => (
              <button key={s} onClick={() => setSourceFilter(s)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition border",
                  sourceFilter === s
                    ? "bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
                    : "bg-[#0C1919] text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/65"
                )}
              >
                {s === "all" ? "All" : s === "report" ? "Reports" : "Scans"}
              </button>
            ))}
            {payFilter !== "all" && (
              <button onClick={() => setPayFilter("all")}
                className="px-3 py-2 rounded-lg text-xs font-medium transition border bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
              >
                Payment: {payFilter} ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-24 text-[#F4EFE6]/35">Loading requests…</div>
        ) : error ? (
          <div className="text-center py-24 text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-[#F4EFE6]/25">
            {requests.length === 0 ? "No submissions yet." : "No requests match your filters."}
          </div>
        ) : (
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <div className="hidden lg:grid grid-cols-[1fr_1.3fr_0.9fr_1.2fr_0.7fr_0.8fr_auto] gap-3 px-5 py-3 bg-white/4 border-b border-white/8 text-[10px] uppercase tracking-wider text-[#F4EFE6]/30 font-medium">
              <span>Client</span>
              <span>Email</span>
              <span>Report Type</span>
              <span>Pipeline</span>
              <span>Payment</span>
              <span>Submitted</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-white/6">
              {filtered.map((req) => {
                const autoStatus = getAutoStatus(req);
                return (
                  <button
                    key={`${req.source}-${req.id}`}
                    onClick={() => setSelected(req)}
                    className="w-full text-left px-5 py-4 hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Desktop */}
                    <div className="hidden lg:grid grid-cols-[1fr_1.3fr_0.9fr_1.2fr_0.7fr_0.8fr_auto] gap-3 items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <AutoStatusDot autoStatus={autoStatus} />
                          <span className="text-sm font-medium text-[#F4EFE6]/85 truncate">{req.name}</span>
                        </div>
                        <span className="text-[10px] text-[#F4EFE6]/25 ml-3.5">BH-{req.id.toString().padStart(4, "0")}</span>
                      </div>
                      <span className="text-sm text-[#F4EFE6]/55 truncate">{req.email}</span>
                      <span className="text-sm text-[#F4EFE6]/65 truncate">{req.reportType}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PipelineBadge stage={req.pipelineStage} />
                        <AutoStatusLabel autoStatus={autoStatus} />
                      </div>
                      <PaymentBadge status={req.paymentStatus} />
                      <span className="text-xs text-[#F4EFE6]/35">{formatDate(req.createdAt)}</span>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} />
                        <ChevronRight className="w-3.5 h-3.5 text-[#F4EFE6]/20 group-hover:text-[#F4EFE6]/50 transition-colors" />
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <AutoStatusDot autoStatus={autoStatus} />
                          <div>
                            <div className="text-sm font-medium text-[#F4EFE6]/85">{req.name}</div>
                            <div className="text-xs text-[#F4EFE6]/40 mt-0.5">{req.email}</div>
                          </div>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-[#F4EFE6]/40">{req.reportType}</span>
                        {req.pipelineStage && <PipelineBadge stage={req.pipelineStage} />}
                        {req.paymentStatus && <PaymentBadge status={req.paymentStatus} />}
                        <AutoStatusLabel autoStatus={autoStatus} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center text-xs text-[#F4EFE6]/18 pb-4">
          {filtered.length} of {requests.length} requests
        </div>
      </div>

      {selected && token && (
        <DetailPanel
          request={selected}
          token={token}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
