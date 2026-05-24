import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  RefreshCw, LogOut, ChevronRight, AlertTriangle, CreditCard,
  Zap, RotateCcw, Pause, Play, X, CheckCircle, Activity, Gift, Ban, DollarSign,
  TrendingUp, Mail, MailCheck, Star, Flag, Settings, Download, BarChart2, BellRing, Tag, Percent,
  Users, Plus, Copy, ExternalLink
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { PLANS, getPlanPrice, getPlanLabel, getPlanLabelWithPrice } from "@/lib/pricing";

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
  adminNote?: string | null;
  starred?: boolean;
  flagged?: boolean;
  referralSource?: string | null;
  referrerEmail?: string | null;
  paymentReminderSentAt?: string | null;
  promoCode?: string | null;
  discountAmount?: number | null;
  tags?: string[] | null;
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
  reportType: string; note?: string | null; adminNote?: string | null;
  starred?: boolean; flagged?: boolean; referralSource?: string | null;
  status: string; createdAt: string;
}

interface RawScanRequest {
  id: number; name: string; email: string; phone?: string | null;
  reportType: string; language: string; fileName?: string | null;
  whatsapp?: boolean | null; plan?: string | null; note?: string | null; adminNote?: string | null;
  starred?: boolean; flagged?: boolean; referralSource?: string | null;
  paymentReminderSentAt?: string | null;
  promoCode?: string | null; discountAmount?: number | null;
  referrerEmail?: string | null;
  tags?: string[] | null;
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
    reportType: r.reportType, note: r.note, adminNote: r.adminNote,
    starred: r.starred ?? false, flagged: r.flagged ?? false,
    referralSource: r.referralSource ?? null,
    status: normalizeStatus(r.status), createdAt: r.createdAt,
  };
}
function normalizeScan(s: RawScanRequest): UnifiedRequest {
  return {
    id: s.id, source: "scan", name: s.name, email: s.email, phone: s.phone,
    reportType: s.reportType, language: s.language, fileName: s.fileName,
    whatsapp: s.whatsapp, plan: s.plan, note: s.note, adminNote: s.adminNote,
    starred: s.starred ?? false, flagged: s.flagged ?? false,
    referralSource: s.referralSource ?? null,
    referrerEmail: s.referrerEmail ?? null,
    paymentReminderSentAt: s.paymentReminderSentAt ?? null,
    promoCode: s.promoCode ?? null,
    discountAmount: s.discountAmount ?? null,
    tags: s.tags ?? [],
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

const SPECIES_EMOJI: Record<string, string> = {
  Dog: "🐕", Cat: "🐈", Horse: "🐴", Other: "🐾",
};

function parsePetInfo(note: string | null | undefined): {
  petName?: string; species?: string; age?: string; breed?: string; ownerNotes?: string;
} | null {
  if (!note) return null;
  const lines = note.split("\n");
  const get = (key: string) => {
    const line = lines.find(l => l.startsWith(`${key}: `));
    return line ? line.slice(key.length + 2).trim() : undefined;
  };
  const petName = get("PET NAME");
  if (!petName) return null;
  const ownerNotesIdx = note.indexOf("\nOWNER NOTES: ");
  const ownerNotes = ownerNotesIdx !== -1 ? note.slice(ownerNotesIdx + 14).trim() : undefined;
  return {
    petName,
    species: get("SPECIES"),
    age: get("AGE"),
    breed: get("BREED"),
    ownerNotes,
  };
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

// ── Revenue Summary ────────────────────────────────────────────────────────────

const PLAN_PRICES: Record<string, number> = Object.fromEntries(PLANS.map((p) => [p.id, p.price]));

const TAG_COLORS: Record<string, string> = {
  stress: "bg-rose-900/30 text-rose-300 border-rose-700/30",
  digestion: "bg-green-900/25 text-green-300 border-green-700/25",
  sleep: "bg-indigo-900/30 text-indigo-300 border-indigo-700/30",
  inflammation: "bg-orange-900/25 text-orange-300 border-orange-700/25",
  hormones: "bg-purple-900/25 text-purple-300 border-purple-700/25",
  energy: "bg-[#BFA14A]/10 text-[#BFA14A] border-[#BFA14A]/25",
};
const ALL_TAGS = ["stress", "digestion", "sleep", "inflammation", "hormones", "energy"] as const;
const PLAN_LABELS: Record<string, string> = Object.fromEntries(PLANS.map((p) => [p.id, p.label]));
const PLAN_COLORS: Record<string, string> = {
  individual: "text-[#4ecdc4]",
  package:    "text-[#BFA14A]",
  pet:        "text-purple-300",
};
const PLAN_KIND: Record<string, "individual" | "package" | "pet"> = Object.fromEntries(PLANS.map((p) => [p.id, p.kind]));

function detectPlan(req: UnifiedRequest): string | null {
  const raw = (req.plan ?? "").trim();
  if (raw && PLAN_PRICES[raw] !== undefined) return raw;
  // legacy aliases
  if (raw === "basic") return "vitals";
  if (raw === "advanced") return "comprehensive";
  if (raw === "premium") return "ultimate-wellness";
  return null;
}

function RevenueSummary({ requests }: { requests: UnifiedRequest[] }) {
  const revenue = useMemo(() => {
    const paidScans = requests.filter(
      (r) => r.source === "scan" && (r.paymentStatus === "paid")
    );
    const byKindGroup: Record<"individual" | "package" | "pet", { count: number; total: number }> = {
      individual: { count: 0, total: 0 },
      package:    { count: 0, total: 0 },
      pet:        { count: 0, total: 0 },
    };
    const byKind = {
      pet:   { count: 0, total: 0 },
      human: { count: 0, total: 0 },
    };
    let grand = 0;
    for (const r of paidScans) {
      const plan = detectPlan(r);
      if (plan && PLAN_PRICES[plan] !== undefined) {
        const group = PLAN_KIND[plan] ?? "individual";
        byKindGroup[group].count++;
        byKindGroup[group].total += PLAN_PRICES[plan];
        grand += PLAN_PRICES[plan];
        const kind = r.reportType === "pet_scan" || group === "pet" ? "pet" : "human";
        byKind[kind].count++;
        byKind[kind].total += PLAN_PRICES[plan];
      }
    }
    return { byKindGroup, byKind, grand, totalPaid: paidScans.length };
  }, [requests]);

  if (revenue.totalPaid === 0) return null;

  const hasPetRevenue = revenue.byKind.pet.count > 0;

  return (
    <div className="rounded-xl border border-white/8 bg-[#0C1919] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-[#BFA14A]" />
          <span className="text-xs font-semibold text-[#F4EFE6]/70 uppercase tracking-widest">Revenue</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-[#BFA14A]">${revenue.grand.toLocaleString("en-CA")}</span>
          <span className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">CAD</span>
          <span className="text-xs text-[#F4EFE6]/25 ml-2">({revenue.totalPaid} paid)</span>
        </div>
      </div>

      {/* Per-plan breakdown */}
      <div className="grid grid-cols-3 divide-x divide-white/8">
        {(["individual", "package", "pet"] as const).map((group) => {
          const { count, total } = revenue.byKindGroup[group];
          const label = group === "individual" ? "Individual Scans" : group === "package" ? "Packages" : "Pet Scans";
          return (
            <div key={group} className="px-5 py-4 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30">{label}</span>
              <span className={cn("text-lg font-bold", PLAN_COLORS[group])}>
                {count > 0 ? `$${total.toLocaleString("en-CA")}` : "—"}
              </span>
              <span className="text-[10px] text-[#F4EFE6]/30">
                {count} {count === 1 ? "scan" : "scans"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pet vs Human breakdown — only when there are pet scan clients */}
      {hasPetRevenue && (
        <div className="border-t border-white/8 grid grid-cols-2 divide-x divide-white/8">
          {/* Pet scans */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🐾</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 leading-none mb-1">Pet Scans</p>
                <p className="text-xs text-[#F4EFE6]/35">
                  {revenue.byKind.pet.count} {revenue.byKind.pet.count === 1 ? "client" : "clients"}
                </p>
              </div>
            </div>
            <span className="text-base font-bold text-[#BFA14A]/80">
              ${revenue.byKind.pet.total.toLocaleString("en-CA")}
            </span>
          </div>

          {/* Human scans */}
          <div className="px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">👤</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 leading-none mb-1">Human Scans</p>
                <p className="text-xs text-[#F4EFE6]/35">
                  {revenue.byKind.human.count} {revenue.byKind.human.count === 1 ? "client" : "clients"}
                </p>
              </div>
            </div>
            <span className="text-base font-bold text-[#4ecdc4]/80">
              {revenue.byKind.human.count > 0
                ? `$${revenue.byKind.human.total.toLocaleString("en-CA")}`
                : "—"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Referral Analytics ─────────────────────────────────────────────────────────

const REFERRAL_PALETTE: Record<string, string> = {
  "Instagram":        "#e1306c",
  "Facebook":         "#1877f2",
  "TikTok":           "#69c9d0",
  "YouTube":          "#ff0000",
  "Google Search":    "#4285f4",
  "Friend / Referral":"#BFA14A",
  "Podcast":          "#a855f7",
  "Practitioner":     "#0F5C5E",
  "Other":            "#6b7280",
  "Direct / Unknown": "#374151",
};

function getWeekLabel(daysAgo: number) {
  if (daysAgo === 0) return "This wk";
  if (daysAgo === 1) return "Last wk";
  return `${daysAgo}w ago`;
}

function ReferralAnalytics({ requests }: { requests: UnifiedRequest[] }) {
  const [open, setOpen] = useState(false);

  const bySource = useMemo(() => {
    const map: Record<string, { count: number; paid: number; revenue: number }> = {};
    for (const r of requests) {
      const key = r.referralSource?.trim() || "Direct / Unknown";
      if (!map[key]) map[key] = { count: 0, paid: 0, revenue: 0 };
      map[key].count++;
      if (r.paymentStatus === "paid" || r.paymentStatus === "waived") {
        map[key].paid++;
        map[key].revenue += getPlanPrice(r.plan);
      }
    }
    return Object.entries(map)
      .map(([source, d]) => ({
        source,
        ...d,
        convRate: d.count > 0 ? Math.round((d.paid / d.count) * 100) : 0,
        color: REFERRAL_PALETTE[source] ?? "#6b7280",
      }))
      .sort((a, b) => b.count - a.count);
  }, [requests]);

  const pieData = useMemo(
    () => bySource.filter((s) => s.source !== "Direct / Unknown" || bySource.length === 1),
    [bySource]
  );

  // Weekly trend — last 8 weeks bucketed by week number
  const weeklyData = useMemo(() => {
    const buckets: { week: string; count: number; revenue: number }[] = Array.from({ length: 8 }, (_, i) => ({
      week: getWeekLabel(7 - i),
      count: 0,
      revenue: 0,
    }));
    const now = Date.now();
    for (const r of requests) {
      const weeksAgo = Math.floor((now - new Date(r.createdAt).getTime()) / (7 * 86400000));
      const idx = 7 - weeksAgo;
      if (idx < 0 || idx > 7) continue;
      buckets[idx].count++;
      if (r.paymentStatus === "paid" || r.paymentStatus === "waived") {
        buckets[idx].revenue += getPlanPrice(r.plan);
      }
    }
    return buckets;
  }, [requests]);

  const totalRevenue = bySource.reduce((s, r) => s + r.revenue, 0);
  const topSource = bySource.find((s) => s.source !== "Direct / Unknown");
  const maxCount = bySource[0]?.count ?? 1;

  if (requests.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-[#0C1919]/60 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <BarChart2 className="w-4 h-4 text-[#BFA14A]" />
          <span className="text-sm font-medium text-[#F4EFE6]/80">Referral Analytics</span>
          {topSource && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BFA14A]/10 border border-[#BFA14A]/20 text-[#BFA14A]/70">
              Top: {topSource.source}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {totalRevenue > 0 && (
            <span className="text-xs text-[#F4EFE6]/35">${totalRevenue.toLocaleString("en-CA")} tracked revenue</span>
          )}
          <span className={cn("text-[#F4EFE6]/30 text-xs transition-transform duration-200", open ? "rotate-180" : "")}>▾</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 p-6 grid lg:grid-cols-3 gap-8">

          {/* Col 1 — Horizontal bar breakdown */}
          <div className="lg:col-span-1 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 mb-4">Source Breakdown</p>
            {bySource.length === 0 ? (
              <p className="text-sm text-[#F4EFE6]/25">No referral data yet. The "How did you hear about us?" field on the upload form will populate this.</p>
            ) : bySource.map((s) => (
              <div key={s.source}>
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-[#F4EFE6]/70 min-w-0 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                    {s.source}
                  </span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] text-emerald-400/60">{s.convRate}%</span>
                    <span className="text-[10px] text-[#BFA14A]/70 font-medium">${s.revenue}</span>
                    <span className="text-xs text-[#F4EFE6]/50 w-4 text-right">{s.count}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-white/6 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(3, Math.round((s.count / maxCount) * 100))}%`, background: s.color, opacity: 0.65 }}
                  />
                </div>
              </div>
            ))}

            {/* Legend */}
            {bySource.length > 0 && (
              <div className="pt-3 border-t border-white/6 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Sources</p>
                  <p className="text-base font-bold text-[#F4EFE6]/70">{bySource.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Avg Conv.</p>
                  <p className="text-base font-bold text-emerald-400/70">
                    {bySource.length > 0 ? Math.round(bySource.reduce((s, r) => s + r.convRate, 0) / bySource.length) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Revenue</p>
                  <p className="text-base font-bold text-[#BFA14A]/80">${totalRevenue}</p>
                </div>
              </div>
            )}
          </div>

          {/* Col 2 — Weekly bar chart */}
          <div className="lg:col-span-1">
            <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 mb-4">Weekly Submissions</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={18} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 9, fill: "rgba(244,239,230,0.28)" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "rgba(244,239,230,0.28)" }}
                  axisLine={false} tickLine={false} allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ background: "#0C1919", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 11, color: "#F4EFE6" }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  formatter={(v, n) => [v, n === "count" ? "Submissions" : "Revenue $"]}
                />
                <Bar dataKey="count" name="count" fill="#BFA14A" opacity={0.75} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Col 3 — Pie chart + top channel card */}
          <div className="lg:col-span-1">
            <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 mb-4">Channel Mix</p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0C1919", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 11, color: "#F4EFE6" }}
                    formatter={(v, n) => [`${v} submissions`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-[#F4EFE6]/20 text-sm">No channel data yet</div>
            )}

            {topSource && (
              <div className="mt-2 flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: topSource.color }} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#F4EFE6]/65 truncate">{topSource.source}</p>
                  <p className="text-[10px] text-[#F4EFE6]/35">
                    {topSource.count} submissions · {topSource.convRate}% conv · ${topSource.revenue} rev
                  </p>
                </div>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#BFA14A]/10 text-[#BFA14A]/70 font-medium shrink-0">#1</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Affiliates Panel ────────────────────────────────────────────────────────────

interface PractitionerRow {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  commissionRate: number;
  tier: string | null;
  active: boolean;
  notes: string | null;
  totalPaid: number;
  totalReferrals: number;
  completedReports: number;
  revenueGenerated: number;
  earnedCommission: number;
  pendingPayout: number;
  createdAt: string;
}

function AffiliatesPanel({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<PractitionerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", referralCode: "", commissionRate: "10", tier: "professional" });
  const [payoutTarget, setPayoutTarget] = useState<PractitionerRow | null>(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payingOut, setPayingOut] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function fetchData() {
    setLoading(true);
    setFetchErr(null);
    try {
      const res = await fetch(`${BASE}/api/admin/practitioners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load");
      setRows(await res.json() as PractitionerRow[]);
    } catch {
      setFetchErr("Could not load affiliate data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && rows.length === 0 && !loading) fetchData();
  }, [open]);

  async function createPractitioner() {
    setCreating(true);
    setCreateErr("");
    try {
      const res = await fetch(`${BASE}/api/admin/practitioners`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, commissionRate: parseInt(form.commissionRate, 10) }),
      });
      const body = await res.json() as { error?: string };
      if (!res.ok) { setCreateErr(body.error ?? "Failed to create"); return; }
      setShowCreate(false);
      setForm({ name: "", email: "", referralCode: "", commissionRate: "10", tier: "professional" });
      fetchData();
    } catch {
      setCreateErr("Connection error");
    } finally {
      setCreating(false);
    }
  }

  async function recordPayout(row: PractitionerRow) {
    const amount = parseInt(payoutAmount, 10);
    if (!amount || amount <= 0) return;
    setPayingOut(true);
    try {
      const res = await fetch(`${BASE}/api/admin/practitioners/${row.id}/payout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount }),
      });
      if (res.ok) { setPayoutTarget(null); setPayoutAmount(""); fetchData(); }
    } catch { /* ignore */ } finally {
      setPayingOut(false);
    }
  }

  async function toggleActive(row: PractitionerRow) {
    await fetch(`${BASE}/api/admin/practitioners/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ active: !row.active }),
    });
    fetchData();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const totalPending = rows.reduce((s, r) => s + r.pendingPayout, 0);
  const totalEarned = rows.reduce((s, r) => s + r.earnedCommission, 0);

  return (
    <div className="rounded-xl border border-white/8 bg-[#0C1919]/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-[#BFA14A]" />
          <span className="text-sm font-medium text-[#F4EFE6]/80">Affiliate Partners</span>
          {rows.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BFA14A]/10 border border-[#BFA14A]/20 text-[#BFA14A]/70">
              {rows.length} partner{rows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {totalPending > 0 && (
            <span className="text-xs text-amber-400/70">${totalPending} pending payout</span>
          )}
          <span className={cn("text-[#F4EFE6]/30 text-xs transition-transform duration-200", open ? "rotate-180" : "")}>▾</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 p-6 space-y-5">

          {/* Summary cards */}
          {rows.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Partners", value: rows.length.toString(), color: "text-[#F4EFE6]/70" },
                { label: "Commissions Earned", value: `$${totalEarned}`, color: "text-[#BFA14A]" },
                { label: "Pending Payout", value: totalPending > 0 ? `$${totalPending}` : "—", color: totalPending > 0 ? "text-amber-400" : "text-[#F4EFE6]/25" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/6">
                  <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-[#BFA14A]/30 text-[#BFA14A]/80 hover:bg-[#BFA14A]/8 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Partner
            </button>
            <button onClick={fetchData} className="text-[10px] text-[#F4EFE6]/25 hover:text-[#F4EFE6]/50 transition flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {/* Create form */}
          {showCreate && (
            <div className="rounded-xl border border-[#BFA14A]/20 bg-[#BFA14A]/4 p-5 space-y-4">
              <p className="text-xs uppercase tracking-wider text-[#BFA14A] font-medium">New Affiliate Partner</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: "name", label: "Full Name", placeholder: "Dr. Jane Smith" },
                  { key: "email", label: "Email", placeholder: "jane@clinic.com" },
                  { key: "referralCode", label: "Referral Code (UPPERCASE)", placeholder: "DRJANE" },
                  { key: "commissionRate", label: "Commission %", placeholder: "10" },
                ] as const).map((f) => (
                  <div key={f.key}>
                    <label className="block text-[10px] text-[#F4EFE6]/35 uppercase tracking-wider mb-1">{f.label}</label>
                    <input
                      value={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: f.key === "referralCode" ? e.target.value.toUpperCase() : e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-[#F4EFE6] placeholder:text-[#F4EFE6]/20 focus:outline-none focus:border-[#BFA14A]/40 transition"
                    />
                  </div>
                ))}
              </div>
              {createErr && <p className="text-red-400/80 text-xs">{createErr}</p>}
              <div className="flex gap-2">
                <button
                  onClick={createPractitioner}
                  disabled={creating || !form.name || !form.email || !form.referralCode}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#BFA14A] text-[#060D0D] text-xs font-semibold hover:bg-[#d4b456] transition disabled:opacity-40"
                >
                  {creating ? "Creating…" : "Create Partner"}
                </button>
                <button
                  onClick={() => { setShowCreate(false); setCreateErr(""); }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs text-[#F4EFE6]/40 hover:text-[#F4EFE6]/60 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Payout inline form */}
          {payoutTarget && (
            <div className="rounded-xl border border-amber-700/30 bg-amber-900/10 p-5 space-y-3">
              <p className="text-xs uppercase tracking-wider text-amber-300 font-medium">
                Record Payout — {payoutTarget.name}
              </p>
              <p className="text-xs text-[#F4EFE6]/45">
                Pending: <span className="text-amber-300 font-semibold">${payoutTarget.pendingPayout}</span>
                {" · "}Total paid so far: <span className="text-[#F4EFE6]/60">${payoutTarget.totalPaid}</span>
              </p>
              <div className="flex gap-2 items-center">
                <span className="text-[#F4EFE6]/40 text-sm">$</span>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder={payoutTarget.pendingPayout.toString()}
                  className="w-28 bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-sm text-[#F4EFE6] focus:outline-none focus:border-amber-500/40 transition"
                />
                <button
                  onClick={() => recordPayout(payoutTarget)}
                  disabled={payingOut}
                  className="px-4 py-2 rounded-lg bg-amber-700/40 text-amber-200 border border-amber-700/40 text-xs font-semibold hover:bg-amber-700/60 transition disabled:opacity-40"
                >
                  {payingOut ? "Saving…" : "Mark Paid"}
                </button>
                <button
                  onClick={() => { setPayoutTarget(null); setPayoutAmount(""); }}
                  className="text-[#F4EFE6]/25 hover:text-[#F4EFE6]/50 transition text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading && <p className="text-xs text-[#F4EFE6]/30 text-center py-4">Loading partners…</p>}
          {fetchErr && <p className="text-xs text-red-400/70 text-center">{fetchErr}</p>}

          {/* Table */}
          {!loading && rows.length > 0 && (
            <div className="space-y-2 overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[1.2fr_1fr_0.6fr_0.55fr_0.55fr_0.65fr_0.7fr_auto] gap-2 text-[10px] uppercase tracking-wider text-[#F4EFE6]/25 px-3 pb-2 border-b border-white/6">
                  <span>Partner</span>
                  <span>Code</span>
                  <span className="text-right">Refs</span>
                  <span className="text-right">Done</span>
                  <span className="text-right">Rev</span>
                  <span className="text-right">Commission</span>
                  <span className="text-right">Pending</span>
                  <span></span>
                </div>

                {rows.map((r) => (
                  <div
                    key={r.id}
                    className={cn(
                      "grid grid-cols-[1.2fr_1fr_0.6fr_0.55fr_0.55fr_0.65fr_0.7fr_auto] gap-2 items-center px-3 py-3 rounded-xl border mt-1.5",
                      r.active ? "bg-white/[0.025] border-white/8" : "opacity-40 bg-transparent border-white/4"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#F4EFE6]/80 truncate">{r.name}</p>
                      <p className="text-[10px] text-[#F4EFE6]/30 truncate">{r.email}</p>
                    </div>

                    <div className="flex items-center gap-1 min-w-0">
                      <code className="text-xs font-mono text-[#BFA14A]/80 truncate">{r.referralCode}</code>
                      <button
                        onClick={() => copyCode(r.referralCode)}
                        className="shrink-0 text-[#F4EFE6]/20 hover:text-[#BFA14A]/60 transition p-0.5"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      {copiedCode === r.referralCode && <span className="text-[10px] text-[#BFA14A]/60 shrink-0">✓</span>}
                    </div>

                    <p className="text-sm font-bold text-right text-[#F4EFE6]/60">{r.totalReferrals}</p>
                    <p className="text-sm font-bold text-right text-[#F4EFE6]/60">{r.completedReports}</p>
                    <p className="text-sm font-bold text-right text-[#F4EFE6]/70">${r.revenueGenerated}</p>
                    <p className={cn("text-sm font-bold text-right", r.earnedCommission > 0 ? "text-[#BFA14A]" : "text-[#F4EFE6]/20")}>
                      {r.earnedCommission > 0 ? `$${r.earnedCommission}` : "—"}
                      <span className="block text-[10px] font-normal text-[#F4EFE6]/25">{r.commissionRate}%</span>
                    </p>

                    <div className="text-right">
                      {r.pendingPayout > 0 ? (
                        <button
                          onClick={() => { setPayoutTarget(r); setPayoutAmount(r.pendingPayout.toString()); }}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 transition underline underline-offset-2"
                        >
                          ${r.pendingPayout}
                        </button>
                      ) : (
                        <span className="text-xs text-green-400/40">✓ Paid</span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleActive(r)}
                      title={r.active ? "Deactivate" : "Activate"}
                      className="p-1 rounded text-[#F4EFE6]/20 hover:text-[#F4EFE6]/55 transition"
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && rows.length === 0 && !showCreate && (
            <p className="text-sm text-[#F4EFE6]/25 text-center py-4">
              No affiliate partners yet. Click "Add Partner" to register your first referral partner.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Promo Code Analytics ───────────────────────────────────────────────────────

const KNOWN_PROMO_CODES = ["WELLNESS20", "FIRST10", "PRACTITIONER"] as const;

function PromoAnalytics({ requests }: { requests: UnifiedRequest[] }) {
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const map: Record<string, { count: number; totalDiscount: number; revenue: number; lastUsed: string | null }> = {};
    // Initialise all known codes with zeroes so they always show
    for (const c of KNOWN_PROMO_CODES) {
      map[c] = { count: 0, totalDiscount: 0, revenue: 0, lastUsed: null };
    }
    for (const r of requests) {
      if (!r.promoCode) continue;
      const key = r.promoCode.toUpperCase();
      if (!map[key]) map[key] = { count: 0, totalDiscount: 0, revenue: 0, lastUsed: null };
      map[key].count++;
      map[key].totalDiscount += r.discountAmount ?? 0;
      if (r.paymentStatus === "paid" || r.paymentStatus === "waived") {
        const gross = getPlanPrice(r.plan);
        map[key].revenue += gross - (r.discountAmount ?? 0);
      }
      if (!map[key].lastUsed || r.createdAt > map[key].lastUsed!) {
        map[key].lastUsed = r.createdAt;
      }
    }
    return Object.entries(map)
      .map(([code, d]) => ({ code, ...d }))
      .sort((a, b) => b.count - a.count);
  }, [requests]);

  const totalUses = stats.reduce((s, c) => s + c.count, 0);
  const totalDiscount = stats.reduce((s, c) => s + c.totalDiscount, 0);

  return (
    <div className="rounded-xl border border-white/8 bg-[#0C1919]/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-[#BFA14A]" />
          <span className="text-sm font-medium text-[#F4EFE6]/80">Promo Code Usage</span>
          {totalUses > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#BFA14A]/10 border border-[#BFA14A]/20 text-[#BFA14A]/70">
              {totalUses} {totalUses === 1 ? "use" : "uses"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {totalDiscount > 0 && (
            <span className="text-xs text-[#F4EFE6]/35">${totalDiscount} total discounts given</span>
          )}
          <span className={cn("text-[#F4EFE6]/30 text-xs transition-transform duration-200", open ? "rotate-180" : "")}>▾</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 p-6 space-y-3">

          {/* Header row */}
          <div className="grid grid-cols-5 gap-2 text-[10px] uppercase tracking-wider text-[#F4EFE6]/25 px-1 pb-1 border-b border-white/6">
            <span className="col-span-2">Code</span>
            <span className="text-right">Uses</span>
            <span className="text-right">Discounts</span>
            <span className="text-right">Net Revenue</span>
          </div>

          {stats.map((c) => {
            const isKnown = (KNOWN_PROMO_CODES as readonly string[]).includes(c.code);
            return (
              <div key={c.code} className={cn(
                "grid grid-cols-5 gap-2 items-center px-3 py-3 rounded-xl border",
                c.count > 0
                  ? "bg-white/[0.025] border-white/8"
                  : "bg-transparent border-white/4 opacity-50"
              )}>
                {/* Code + description */}
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    c.count > 0 ? "bg-[#BFA14A]" : "bg-white/20"
                  )} />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-semibold text-[#F4EFE6]/80 truncate">{c.code}</p>
                    <p className="text-[10px] text-[#F4EFE6]/30">
                      {c.code === "WELLNESS20" ? "20% off" : c.code === "FIRST10" ? "$10 off" : c.code === "PRACTITIONER" ? "30% off" : "custom"}
                      {isKnown ? " · active" : ""}
                    </p>
                  </div>
                </div>

                {/* Uses */}
                <div className="text-right">
                  <p className={cn("text-sm font-bold", c.count > 0 ? "text-[#F4EFE6]/70" : "text-[#F4EFE6]/20")}>
                    {c.count}
                  </p>
                </div>

                {/* Total discount */}
                <div className="text-right">
                  <p className={cn("text-sm font-bold", c.totalDiscount > 0 ? "text-red-400/60" : "text-[#F4EFE6]/20")}>
                    {c.totalDiscount > 0 ? `−$${c.totalDiscount}` : "—"}
                  </p>
                </div>

                {/* Net revenue */}
                <div className="text-right">
                  <p className={cn("text-sm font-bold", c.revenue > 0 ? "text-emerald-400/70" : "text-[#F4EFE6]/20")}>
                    {c.revenue > 0 ? `$${c.revenue}` : "—"}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Summary footer */}
          <div className="pt-3 border-t border-white/6 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Total Uses</p>
              <p className="text-base font-bold text-[#F4EFE6]/70">{totalUses}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Discounts Given</p>
              <p className="text-base font-bold text-red-400/60">{totalDiscount > 0 ? `$${totalDiscount}` : "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Net Revenue</p>
              <p className="text-base font-bold text-emerald-400/70">
                ${stats.reduce((s, c) => s + c.revenue, 0)}
              </p>
            </div>
          </div>

          {totalUses === 0 && (
            <p className="text-sm text-[#F4EFE6]/25 text-center py-2">
              No promo codes used yet. Clients enter codes on the upload form.
            </p>
          )}
        </div>
      )}
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

    </section>
  );
}

// ── Payment Section ────────────────────────────────────────────────────────────

function PaymentSection({
  request, token, onUpdate,
}: {
  request: UnifiedRequest;
  token: string;
  onUpdate: (id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState<PaymentStatus | null>(null);

  const current = request.paymentStatus ?? "pending";

  async function setPayment(ps: PaymentStatus) {
    if (busy || current === ps) return;
    setBusy(true);
    onUpdate(request.id, request.source, { paymentStatus: ps });
    try {
      await fetch(`${BASE}/api/admin/requests/${request.source}/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus: ps }),
      });
      setConfirmed(ps);
      setTimeout(() => setConfirmed(null), 3000);
    } catch { /* optimistic update already applied */ }
    setBusy(false);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] font-medium">Payment</h3>
        <PaymentBadge status={current} />
      </div>

      {confirmed && (
        <p className="text-xs text-green-300/80 bg-green-900/15 border border-green-700/25 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
          <CheckCircle className="w-3 h-3 shrink-0" />
          Payment status updated to <span className="font-semibold capitalize">{confirmed}</span>
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        {/* Confirm Paid */}
        <button
          disabled={busy || current === "paid"}
          onClick={() => setPayment("paid")}
          className={cn(
            "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all",
            current === "paid"
              ? "bg-green-900/25 text-green-300 border-green-700/35 cursor-default"
              : "border-green-700/20 text-green-400/55 hover:bg-green-900/15 hover:border-green-700/40 hover:text-green-300 disabled:opacity-40"
          )}
        >
          <DollarSign className="w-4 h-4" />
          <span>Confirm Paid</span>
        </button>

        {/* Waive — Complimentary */}
        <button
          disabled={busy || current === "waived"}
          onClick={() => setPayment("waived")}
          className={cn(
            "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all",
            current === "waived"
              ? "bg-purple-900/25 text-purple-300 border-purple-700/35 cursor-default"
              : "border-purple-700/20 text-purple-400/55 hover:bg-purple-900/15 hover:border-purple-700/40 hover:text-purple-300 disabled:opacity-40"
          )}
        >
          <Gift className="w-4 h-4" />
          <span>Waive</span>
        </button>

        {/* Mark Failed */}
        <button
          disabled={busy || current === "failed"}
          onClick={() => setPayment("failed")}
          className={cn(
            "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-medium transition-all",
            current === "failed"
              ? "bg-red-900/25 text-red-400 border-red-700/35 cursor-default"
              : "border-red-700/15 text-red-400/40 hover:bg-red-900/12 hover:border-red-700/30 hover:text-red-400/80 disabled:opacity-40"
          )}
        >
          <Ban className="w-4 h-4" />
          <span>Failed</span>
        </button>
      </div>

      {current === "pending" && (
        <p className="text-[10px] text-[#F4EFE6]/28 mt-2 leading-relaxed">
          Pipeline starts automatically when payment is confirmed. Use <span className="text-purple-300/70">Waive</span> for complimentary reports.
        </p>
      )}
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

// ── Payment Reminder Section ───────────────────────────────────────────────────

function PaymentReminderSection({
  request, token, onUpdate,
}: {
  request: UnifiedRequest;
  token: string;
  onUpdate: (id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const sentAt = request.paymentReminderSentAt
    ? new Date(request.paymentReminderSentAt).toLocaleString("en-CA", {
        month: "short", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  async function handleResend() {
    setBusy(true);
    setResult(null);
    try {
      const resp = await fetch(
        `${BASE}/api/admin/requests/scan/${request.id}/resend-payment-reminder`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
      );
      if (resp.ok) {
        const now = new Date().toISOString();
        onUpdate(request.id, "scan", { paymentReminderSentAt: now });
        setResult("success");
        setTimeout(() => setResult(null), 4000);
      } else {
        setResult("error");
      }
    } catch { setResult("error"); }
    setBusy(false);
  }

  return (
    <section>
      <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium flex items-center gap-2">
        <BellRing className="w-3 h-3" />
        Payment Reminder
      </h3>

      <div className="bg-white/[0.02] border border-white/8 rounded-xl p-4 space-y-3">
        {/* Status row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0",
              sentAt ? "bg-[#BFA14A]" : "bg-white/20"
            )} />
            <span className={cn(
              "text-xs font-medium",
              sentAt ? "text-[#BFA14A]" : "text-[#F4EFE6]/35"
            )}>
              {sentAt ? `Sent ${sentAt}` : "Not yet sent — sends automatically after 24 hrs"}
            </span>
          </div>
          {sentAt && (
            <span className="text-[10px] text-[#F4EFE6]/25 shrink-0">To: {request.email}</span>
          )}
        </div>

        {/* Subject preview */}
        <div className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/6">
          <p className="text-[10px] text-[#F4EFE6]/25 uppercase tracking-wider mb-0.5">Subject</p>
          <p className="text-xs text-[#F4EFE6]/60 font-mono">Complete Your BioHarmony Report</p>
        </div>

        {/* WhatsApp note */}
        {request.whatsapp && (
          <p className="text-[10px] text-[#F4EFE6]/35 bg-white/[0.02] rounded-lg px-3 py-2 border border-white/6">
            WhatsApp message will also be logged when reminder fires.
          </p>
        )}

        {/* Result message */}
        {result === "success" && (
          <p className="text-xs text-green-300/80 bg-green-900/15 border border-green-700/25 rounded-lg px-3 py-2">
            Reminder sent to {request.email}
          </p>
        )}
        {result === "error" && (
          <p className="text-xs text-red-300/80 bg-red-900/15 border border-red-700/25 rounded-lg px-3 py-2">
            Send failed — check server logs
          </p>
        )}

        {/* Send / Resend button */}
        <button
          disabled={busy}
          onClick={handleResend}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border border-[#BFA14A]/20 text-[#BFA14A]/60 hover:border-[#BFA14A]/40 hover:text-[#BFA14A] transition disabled:opacity-40"
        >
          {busy
            ? <><span className="inline-block w-3 h-3 border border-current/40 border-t-current rounded-full animate-spin" />Sending…</>
            : <><BellRing className="w-3 h-3" />{sentAt ? "↩ Resend Reminder" : "✉ Send Reminder Now"}</>
          }
        </button>
      </div>
    </section>
  );
}

// ── Kathy's Internal Notes ─────────────────────────────────────────────────────

function KathyNotesSection({
  request, token, onUpdate,
}: {
  request: UnifiedRequest;
  token: string;
  onUpdate: (id: number, source: "report" | "scan", patch: Partial<UnifiedRequest>) => void;
}) {
  const [draft, setDraft] = useState(request.adminNote ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(request.adminNote ?? "");
    setSaveState("idle");
  }, [request.id, request.adminNote]);

  async function save() {
    const trimmed = draft.trim();
    const current = (request.adminNote ?? "").trim();
    if (trimmed === current) return;
    setSaveState("saving");
    try {
      await fetch(`${BASE}/api/admin/requests/${request.source}/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminNote: trimmed || null }),
      });
      onUpdate(request.id, request.source, { adminNote: trimmed || null });
      setSaveState("saved");
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaveState("idle"), 3000);
    } catch {
      setSaveState("idle");
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] font-medium flex items-center gap-1.5">
          <span>✏️</span> Kathy's Notes
        </h3>
        {saveState === "saving" && (
          <span className="text-[10px] text-[#F4EFE6]/30 animate-pulse">Saving…</span>
        )}
        {saveState === "saved" && (
          <span className="text-[10px] text-green-400/60 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Saved
          </span>
        )}
      </div>
      <textarea
        value={draft}
        onChange={(e) => { setDraft(e.target.value); setSaveState("idle"); }}
        onBlur={save}
        rows={4}
        placeholder="Internal notes — only visible here, never shown to clients…"
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4EFE6]/80 placeholder-[#F4EFE6]/20 resize-none focus:outline-none focus:border-[#BFA14A]/40 transition leading-relaxed"
      />
      <p className="text-[10px] text-[#F4EFE6]/20 mt-1.5">Saves automatically when you click away.</p>
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
  const planMap = (p: string | null) => getPlanLabelWithPrice(p);

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
          <div className="flex items-center gap-2 ml-4 shrink-0">
            {/* Star / Flag toggles in drawer header */}
            <button
              title={request.starred ? "Unstar" : "Star this client"}
              onClick={() => quickToggleStar(request)}
              className={cn("p-1.5 rounded-lg transition border", request.starred ? "border-[#BFA14A]/40 bg-[#BFA14A]/10 text-[#BFA14A]" : "border-white/8 text-white/20 hover:border-[#BFA14A]/30 hover:text-[#BFA14A]/70")}
            >
              <Star className={cn("w-3.5 h-3.5", request.starred ? "fill-[#BFA14A]" : "")} />
            </button>
            <button
              title={request.flagged ? "Unflag" : "Flag for review"}
              onClick={() => quickToggleFlag(request)}
              className={cn("p-1.5 rounded-lg transition border", request.flagged ? "border-red-700/40 bg-red-900/15 text-red-400" : "border-white/8 text-white/20 hover:border-red-700/30 hover:text-red-400/70")}
            >
              <Flag className={cn("w-3.5 h-3.5", request.flagged ? "fill-red-400" : "")} />
            </button>
            <button onClick={onClose} className="p-1.5 text-[#F4EFE6]/35 hover:text-[#F4EFE6] transition">✕</button>
          </div>
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
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#BFA14A]/8 border border-[#BFA14A]/20">
              <CreditCard className="w-4 h-4 text-[#BFA14A] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#BFA14A]/90 font-medium mb-1">Awaiting Payment</p>
                <p className="text-xs text-[#BFA14A]/60 leading-relaxed">Pipeline starts automatically once payment is confirmed. For complimentary reports, waive the payment below.</p>
              </div>
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
              {request.plan && <DetailRow label="Plan" value={planMap(request.plan)} />}
              {request.language && <DetailRow label="Language" value={langMap[request.language] ?? request.language} />}
              {request.fileName && <DetailRow label="File" value={request.fileName} />}
              <DetailRow label="Submitted" value={formatDate(request.createdAt)} />
              <DetailRow label="Request ID" value={`BH-${request.id.toString().padStart(4, "0")}`} />
              {request.referralSource && <DetailRow label="Referred via" value={request.referralSource} />}
              {request.referrerEmail && <DetailRow label="Referrer Email" value={request.referrerEmail} />}
              {request.tags && request.tags.length > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#F4EFE6]/30 text-sm shrink-0">Tags</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {request.tags.map((t) => (
                      <span key={t} className={cn("text-[10px] px-2 py-0.5 rounded-full border capitalize", TAG_COLORS[t] ?? "bg-white/5 text-[#F4EFE6]/40 border-white/10")}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {request.promoCode && (
                <DetailRow
                  label="Promo Code"
                  value={`${request.promoCode}${request.discountAmount != null ? ` (−$${request.discountAmount})` : ""}`}
                />
              )}
            </div>
          </section>

          {request.note && (() => {
            const pet = request.reportType === "pet_scan" ? parsePetInfo(request.note) : null;
            if (pet) {
              return (
                <section>
                  <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">Pet Details</h3>
                  <div className="rounded-2xl border border-[#BFA14A]/20 bg-[#BFA14A]/5 overflow-hidden">
                    {/* Pet header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
                      <span className="text-2xl">{SPECIES_EMOJI[pet.species ?? ""] ?? "🐾"}</span>
                      <div>
                        <p className="text-base font-semibold text-[#F4EFE6]">{pet.petName}</p>
                        {pet.species && <p className="text-xs text-[#F4EFE6]/45">{pet.species}</p>}
                      </div>
                    </div>
                    {/* Fields */}
                    <div className="px-4 py-3 space-y-2">
                      {pet.age && <DetailRow label="Age" value={pet.age} />}
                      {pet.breed && <DetailRow label="Breed" value={pet.breed} />}
                    </div>
                  </div>
                  {pet.ownerNotes && (
                    <div className="mt-3">
                      <p className="text-[10px] text-[#F4EFE6]/35 uppercase tracking-widest mb-1.5">Owner's Notes</p>
                      <p className="text-sm text-[#F4EFE6]/65 bg-white/5 rounded-xl p-3 border border-white/8 leading-relaxed">{pet.ownerNotes}</p>
                    </div>
                  )}
                </section>
              );
            }
            return (
              <section>
                <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">Client Notes</h3>
                <p className="text-sm text-[#F4EFE6]/65 bg-white/5 rounded-xl p-3 border border-white/8 leading-relaxed">{request.note}</p>
              </section>
            );
          })()}

          {/* Payment (scan only) */}
          {request.source === "scan" && (
            <PaymentSection request={request} token={token} onUpdate={onUpdate} />
          )}

          {/* Pipeline control (scan only) */}
          {request.source === "scan" && (
            <PipelinePanel request={request} token={token} onUpdate={onUpdate} />
          )}

          {/* Payment reminder (scan only, pending payment) */}
          {request.source === "scan" && request.paymentStatus === "pending" && (
            <PaymentReminderSection request={request} token={token} onUpdate={onUpdate} />
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

          {/* Kathy's internal notes */}
          <KathyNotesSection request={request} token={token} onUpdate={onUpdate} />

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
          <div className="text-[#BFA14A] text-xs tracking-[0.3em] uppercase mb-2">BioHarmony Analytics</div>
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
  const [petOnly, setPetOnly] = useState(false);
  const [starOnly, setStarOnly] = useState(false);
  const [flagOnly, setFlagOnly] = useState(false);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
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

  async function quickSetPayment(req: UnifiedRequest, ps: PaymentStatus) {
    if (!token) return;
    handleUpdate(req.id, req.source, { paymentStatus: ps });
    try {
      await fetch(`${BASE}/api/admin/requests/${req.source}/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentStatus: ps }),
      });
    } catch { /* optimistic update already applied */ }
  }

  async function quickToggleStar(req: UnifiedRequest) {
    if (!token) return;
    const next = !req.starred;
    handleUpdate(req.id, req.source, { starred: next });
    try {
      await fetch(`${BASE}/api/admin/requests/${req.source}/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ starred: next }),
      });
    } catch { /* optimistic */ }
  }

  async function quickToggleFlag(req: UnifiedRequest) {
    if (!token) return;
    const next = !req.flagged;
    handleUpdate(req.id, req.source, { flagged: next });
    try {
      await fetch(`${BASE}/api/admin/requests/${req.source}/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ flagged: next }),
      });
    } catch { /* optimistic */ }
  }

  function exportCSV() {
    const headers = ["ID","Source","Name","Email","Report Type","Plan","Pipeline","Payment","Status","Starred","Flagged","Referral","Submitted"];
    const rows = filtered.map((r) => [
      `BH-${r.id.toString().padStart(4,"0")}`,
      r.source,
      r.name,
      r.email,
      r.reportType,
      r.plan ?? "",
      r.pipelineStage ?? "",
      r.paymentStatus ?? "",
      r.status,
      r.starred ? "★" : "",
      r.flagged ? "⚑" : "",
      r.referralSource ?? "",
      new Date(r.createdAt).toLocaleDateString("en-CA"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `bioharmony-requests-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
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

  const petCount = useMemo(() => requests.filter((r) => r.reportType === "pet_scan").length, [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (sourceFilter !== "all") list = list.filter((r) => r.source === sourceFilter);
    if (payFilter !== "all") list = list.filter((r) => r.paymentStatus === payFilter);
    if (petOnly) list = list.filter((r) => r.reportType === "pet_scan");
    if (starOnly) list = list.filter((r) => r.starred);
    if (flagOnly) list = list.filter((r) => r.flagged);
    if (tagFilter.length > 0) list = list.filter((r) => tagFilter.every((t) => r.tags?.includes(t)));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.reportType.toLowerCase().includes(q) ||
          (r.reportType === "pet_scan" && parsePetInfo(r.note)?.petName?.toLowerCase().includes(q))
      );
    }
    return list;
  }, [requests, statusFilter, sourceFilter, payFilter, petOnly, starOnly, flagOnly, tagFilter, search]);

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
              onClick={exportCSV}
              className="flex items-center gap-1.5 text-xs text-[#F4EFE6]/35 hover:text-[#4ecdc4]/80 transition px-3 py-1.5 rounded border border-white/8 hover:border-[#4ecdc4]/25"
              title="Export filtered results to CSV"
            >
              <Download className="w-3 h-3" /> Export
            </button>
            <Link
              href="/admin/settings"
              className="flex items-center gap-1.5 text-xs text-[#F4EFE6]/35 hover:text-[#BFA14A]/80 transition px-3 py-1.5 rounded border border-white/8 hover:border-[#BFA14A]/30"
            >
              <Settings className="w-3 h-3" /> Settings
            </Link>
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

        {/* Revenue summary */}
        <RevenueSummary requests={requests} />

        {/* Referral analytics */}
        <ReferralAnalytics requests={requests} />

        {/* Affiliate partners */}
        {token && <AffiliatesPanel token={token} />}

        {/* Promo code analytics */}
        <PromoAnalytics requests={requests} />

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
              <button key={s} onClick={() => { setSourceFilter(s); if (s !== "all") setPetOnly(false); }}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition border",
                  sourceFilter === s && !petOnly
                    ? "bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
                    : "bg-[#0C1919] text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/65"
                )}
              >
                {s === "all" ? "All" : s === "report" ? "Reports" : "Scans"}
              </button>
            ))}

            {/* Pet filter chip */}
            {petCount > 0 && (
              <button
                onClick={() => { setPetOnly((v) => !v); setSourceFilter("all"); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition border",
                  petOnly
                    ? "bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
                    : "bg-[#0C1919] text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/65"
                )}
              >
                <span>🐾</span>
                <span>Pets</span>
                <span className={cn(
                  "ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold leading-none",
                  petOnly ? "bg-[#BFA14A]/20 text-[#BFA14A]" : "bg-white/10 text-[#F4EFE6]/40"
                )}>{petCount}</span>
              </button>
            )}

            {payFilter !== "all" && (
              <button onClick={() => setPayFilter("all")}
                className="px-3 py-2 rounded-lg text-xs font-medium transition border bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
              >
                Payment: {payFilter} ✕
              </button>
            )}

            {/* Tag filter chips */}
            {ALL_TAGS.map((t) => {
              const active = tagFilter.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => setTagFilter((prev) => active ? prev.filter((x) => x !== t) : [...prev, t])}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium transition border capitalize",
                    active
                      ? `${TAG_COLORS[t]} opacity-100`
                      : "bg-[#0C1919] text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/65"
                  )}
                >
                  {t}
                </button>
              );
            })}

            {/* Star / Flag filter chips */}
            <button
              onClick={() => { setStarOnly((v) => !v); if (!starOnly) setFlagOnly(false); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition border",
                starOnly
                  ? "bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
                  : "bg-[#0C1919] text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/65"
              )}
            >
              <Star className={cn("w-3 h-3", starOnly ? "fill-[#BFA14A]" : "")} /> Starred
            </button>
            <button
              onClick={() => { setFlagOnly((v) => !v); if (!flagOnly) setStarOnly(false); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition border",
                flagOnly
                  ? "bg-red-900/20 text-red-400 border-red-700/35"
                  : "bg-[#0C1919] text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/65"
              )}
            >
              <Flag className={cn("w-3 h-3", flagOnly ? "fill-red-400" : "")} /> Flagged
            </button>
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
            <div className="hidden lg:grid grid-cols-[1fr_1.3fr_0.9fr_1.2fr_1fr_0.8fr_auto] gap-3 px-5 py-3 bg-white/4 border-b border-white/8 text-[10px] uppercase tracking-wider text-[#F4EFE6]/30 font-medium">
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
                    <div className="hidden lg:grid grid-cols-[1fr_1.3fr_0.9fr_1.2fr_1fr_0.8fr_auto] gap-3 items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <AutoStatusDot autoStatus={autoStatus} />
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-[#F4EFE6]/85 truncate block">{req.name}</span>
                            {req.reportType === "pet_scan" && (() => {
                              const pet = parsePetInfo(req.note);
                              if (!pet?.petName) return null;
                              return (
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#BFA14A]/70 mt-0.5">
                                  <span>{SPECIES_EMOJI[pet.species ?? ""] ?? "🐾"}</span>
                                  <span className="font-medium">{pet.petName}</span>
                                  {pet.species && <span className="text-[#F4EFE6]/30">· {pet.species}</span>}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                          <span className="text-[10px] text-[#F4EFE6]/25 ml-3.5">BH-{req.id.toString().padStart(4, "0")}</span>
                        {req.tags && req.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 ml-3.5">
                            {req.tags.map((t) => (
                              <span key={t} className={cn("text-[9px] px-1.5 py-0.5 rounded-full border capitalize", TAG_COLORS[t] ?? "bg-white/5 text-[#F4EFE6]/40 border-white/10")}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-[#F4EFE6]/55 truncate">{req.email}</span>
                      <span className="text-sm text-[#F4EFE6]/65 truncate">{req.reportType}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PipelineBadge stage={req.pipelineStage} />
                        <AutoStatusLabel autoStatus={autoStatus} />
                      </div>
                      {/* Payment cell — shows badge + quick actions for pending */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <PaymentBadge status={req.paymentStatus} />
                        {/* Reminder sent indicator */}
                        {req.source === "scan" && req.paymentStatus === "pending" && req.paymentReminderSentAt && (
                          <span
                            title={`Payment reminder sent ${formatDate(req.paymentReminderSentAt)}`}
                            className="shrink-0"
                          >
                            <BellRing className="w-3 h-3 text-[#BFA14A]/60" />
                          </span>
                        )}
                        {req.paymentStatus === "pending" && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              title="Confirm Paid"
                              onClick={(e) => { e.stopPropagation(); quickSetPayment(req, "paid"); }}
                              className="flex items-center gap-1 text-[10px] px-1.5 py-1 rounded border border-green-700/30 text-green-400/60 hover:bg-green-900/20 hover:text-green-300 hover:border-green-700/50 transition"
                            >
                              <DollarSign className="w-2.5 h-2.5" />Paid
                            </button>
                            <button
                              title="Waive (Complimentary)"
                              onClick={(e) => { e.stopPropagation(); quickSetPayment(req, "waived"); }}
                              className="flex items-center gap-1 text-[10px] px-1.5 py-1 rounded border border-purple-700/30 text-purple-400/60 hover:bg-purple-900/20 hover:text-purple-300 hover:border-purple-700/50 transition"
                            >
                              <Gift className="w-2.5 h-2.5" />Waive
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-[#F4EFE6]/35">{formatDate(req.createdAt)}</span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={req.status} />
                        {/* Email delivery indicator — scan delivered rows only */}
                        {req.source === "scan" && req.pipelineStage === "delivered" && (
                          req.deliveredEmailSentAt
                            ? <span title={`Delivery email sent ${formatDate(req.deliveredEmailSentAt)}`} className="shrink-0">
                                <MailCheck className="w-3.5 h-3.5 text-green-400/70" />
                              </span>
                            : <span title="Delivered — delivery email not yet sent" className="shrink-0">
                                <Mail className="w-3.5 h-3.5 text-[#BFA14A]/50 animate-pulse" />
                              </span>
                        )}
                        {/* Star / Flag quick-toggle */}
                        <button
                          title={req.starred ? "Unstar" : "Star"}
                          onClick={(e) => { e.stopPropagation(); quickToggleStar(req); }}
                          className={cn(
                            "opacity-0 group-hover:opacity-100 transition-all p-0.5 rounded",
                            req.starred ? "opacity-100 text-[#BFA14A]" : "text-white/20 hover:text-[#BFA14A]"
                          )}
                        >
                          <Star className={cn("w-3.5 h-3.5", req.starred ? "fill-[#BFA14A]" : "")} />
                        </button>
                        <button
                          title={req.flagged ? "Unflag" : "Flag for review"}
                          onClick={(e) => { e.stopPropagation(); quickToggleFlag(req); }}
                          className={cn(
                            "opacity-0 group-hover:opacity-100 transition-all p-0.5 rounded",
                            req.flagged ? "opacity-100 text-red-400" : "text-white/20 hover:text-red-400"
                          )}
                        >
                          <Flag className={cn("w-3.5 h-3.5", req.flagged ? "fill-red-400" : "")} />
                        </button>
                        <ChevronRight className="w-3.5 h-3.5 text-[#F4EFE6]/20 group-hover:text-[#F4EFE6]/50 transition-colors" onClick={(e) => { e.stopPropagation(); setSelected(req); }} />
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <AutoStatusDot autoStatus={autoStatus} />
                          <div>
                            <div className="text-sm font-medium text-[#F4EFE6]/85">{req.name}</div>
                            {req.reportType === "pet_scan" && (() => {
                              const pet = parsePetInfo(req.note);
                              if (!pet?.petName) return null;
                              return (
                                <div className="flex items-center gap-1 text-[10px] text-[#BFA14A]/70 mt-0.5">
                                  <span>{SPECIES_EMOJI[pet.species ?? ""] ?? "🐾"}</span>
                                  <span className="font-medium">{pet.petName}</span>
                                  {pet.species && <span className="text-[#F4EFE6]/30">· {pet.species}</span>}
                                </div>
                              );
                            })()}
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
