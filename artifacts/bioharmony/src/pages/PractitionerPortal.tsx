import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Upload, FileText, Download, Star, Zap, Users, Crown,
  ChevronRight, Lock, CheckCircle, Clock, BarChart3, Palette, ImageIcon, Save,
  Link2, Copy, ExternalLink, TrendingUp, DollarSign, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRACTITIONER_KEY = "bh_practitioner_token";
const PRACTITIONER_PASSWORD = "practitioner2025";

const TIERS = [
  {
    id: "starter",
    label: "Starter",
    price: "$29",
    interval: "/mo",
    credits: 3,
    color: "teal",
    badge: "",
    features: [
      "3 reports per month",
      "Consumer + Pet scan reports",
      "Email delivery to clients",
      "BioHarmony branded PDF",
      "Standard 48-hour turnaround",
    ],
    highlight: false,
  },
  {
    id: "professional",
    label: "Professional",
    price: "$145",
    interval: "/mo",
    credits: 5,
    color: "gold",
    badge: "Most Popular",
    features: [
      "5 reports per month",
      "All report types",
      "WhatsApp + Email delivery",
      "BioHarmony Score included",
      "Priority 24-hour turnaround",
      "Monthly client analytics",
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: "$270",
    interval: "/mo",
    credits: 10,
    color: "purple",
    badge: "",
    features: [
      "10 reports per month",
      "All report types + Audio",
      "Multi-language delivery",
      "Full BioHarmony Score",
      "Same-day rush turnaround",
      "Dedicated account support",
    ],
    highlight: false,
  },
  {
    id: "whitelabel",
    label: "White-Label Add-on",
    price: "$97",
    interval: "/mo",
    credits: 0,
    color: "indigo",
    badge: "Add-on",
    features: [
      "Your practice branding on reports",
      "Custom logo + color scheme",
      "Remove BioHarmony branding",
      "Client sees your brand",
      "Requires a base subscription",
    ],
    highlight: false,
  },
] as const;

const MOCK_COMPLETED = [
  { id: "BH-0031", name: "Sarah J.", type: "Inner Voice", plan: "Professional", stage: "Delivered", date: "Apr 29, 2026" },
  { id: "BH-0028", name: "Michael T.", type: "Vitals Report", plan: "Professional", stage: "Delivered", date: "Apr 25, 2026" },
  { id: "BH-0019", name: "Bella (Pet)", type: "Pet Scan", plan: "Starter", stage: "Delivered", date: "Apr 18, 2026" },
] as const;

function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.trim() === PRACTITIONER_PASSWORD) {
      sessionStorage.setItem(PRACTITIONER_KEY, "1");
      onAuth();
    } else {
      setError("Incorrect password. Please try again or contact support.");
      setPw("");
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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#BFA14A]/12 border border-[#BFA14A]/25 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-[#BFA14A]" />
          </div>
          <p className="text-[#BFA14A] text-xs uppercase tracking-[0.25em] mb-2">BioHarmony Solutions</p>
          <h1 className="text-2xl font-serif text-[#F4EFE6]">Practitioner Portal</h1>
          <p className="text-[#F4EFE6]/40 text-sm mt-2">For licensed wellness practitioners only</p>
        </div>
        <form onSubmit={submit} className="bg-[#0C1919] border border-white/10 rounded-2xl p-8 space-y-5">
          <div className="h-[2px] -mt-8 -mx-8 mb-8 rounded-t-2xl bg-gradient-to-r from-transparent via-[#BFA14A]/35 to-transparent" />
          <div>
            <label className="block text-xs text-[#F4EFE6]/45 mb-2 uppercase tracking-wider">Access Code</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/60 transition"
              placeholder="Enter your practitioner code"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400/80 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3.5 rounded-xl bg-[#BFA14A] text-[#060D0D] font-semibold hover:bg-[#d4b456] transition text-sm">
            Enter Portal
          </button>
          <p className="text-center text-xs text-[#F4EFE6]/25">
            Need access?{" "}
            <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A]/55 hover:text-[#BFA14A] transition">
              Contact us
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function CreditMeter({ used, total, tier }: { used: number; total: number; tier: string }) {
  const remaining = total - used;
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  return (
    <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em] mb-1">Monthly Credits</p>
          <p className="text-3xl font-bold text-[#F4EFE6]">{remaining}<span className="text-[#F4EFE6]/30 text-lg font-normal"> / {total}</span></p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#0F5C5E]/20 border border-[#0F5C5E]/30 flex items-center justify-center">
          <Zap className="w-5 h-5 text-[#4ecdc4]" />
        </div>
      </div>
      <div className="w-full h-2 bg-white/8 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            pct > 60 ? "bg-gradient-to-r from-[#0F5C5E] to-[#4ecdc4]"
              : pct > 25 ? "bg-gradient-to-r from-[#BFA14A] to-[#d4b456]"
                : "bg-gradient-to-r from-red-700 to-red-500"
          )}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#F4EFE6]/35">{used} used this month</p>
        <span className="text-xs text-[#BFA14A]/60 capitalize">{tier} plan</span>
      </div>
    </div>
  );
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface ReferralDashboard {
  id: number;
  name: string;
  referralCode: string;
  commissionRate: number;
  totalReferrals: number;
  completedReports: number;
  revenueGenerated: number;
  earnedCommission: number;
  pendingPayout: number;
  totalPaid: number;
  recentReferrals: Array<{
    reportType: string;
    plan: string | null;
    pipelineStage: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

export default function PractitionerPortal() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PRACTITIONER_KEY) === "1");
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "plans" | "brand" | "referrals">("overview");

  // Referrals tab state
  const [refCodeInput, setRefCodeInput] = useState("");
  const [refDashboard, setRefDashboard] = useState<ReferralDashboard | null>(null);
  const [refLoading, setRefLoading] = useState(false);
  const [refError, setRefError] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function loadRefDashboard() {
    const code = refCodeInput.trim().toUpperCase();
    if (!code) { setRefError("Enter your referral code."); return; }
    setRefLoading(true);
    setRefError("");
    try {
      const res = await fetch(`${BASE}/api/practitioners/dashboard/${encodeURIComponent(code)}`);
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setRefError(body.error ?? "Code not found.");
        return;
      }
      setRefDashboard(await res.json() as ReferralDashboard);
    } catch {
      setRefError("Connection error. Please try again.");
    } finally {
      setRefLoading(false);
    }
  }

  function copyToClipboard(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  }
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [brandAccent, setBrandAccent] = useState("#BFA14A");
  const [brandSaved, setBrandSaved] = useState(false);

  function saveBrand() {
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2500);
  }

  if (!authed) return <AuthGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#060D0D]">

      {/* Header */}
      <div className="bg-[#060D0D]/96 backdrop-blur-md border-b border-white/8 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#BFA14A] text-xs uppercase tracking-[0.25em] font-medium">BioHarmony</span>
            <span className="text-white/15">·</span>
            <span className="text-[#F4EFE6]/50 text-xs">Practitioner Studio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#BFA14A] shadow-[0_0_8px_rgba(191,161,74,0.6)]" />
            <span className="text-xs text-[#F4EFE6]/40">Professional Plan</span>
            <button
              onClick={() => { sessionStorage.removeItem(PRACTITIONER_KEY); setAuthed(false); }}
              className="text-xs text-[#F4EFE6]/25 hover:text-[#F4EFE6]/55 ml-3 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.25em] mb-2">Welcome Back</p>
            <h1 className="font-serif text-3xl md:text-4xl text-[#F4EFE6] mb-2">Practitioner Studio</h1>
            <p className="text-[#F4EFE6]/45 text-base">
              Submit reports, track your pipeline, and manage your practice — all from one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-0">
            {([
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "reports", label: "My Reports", icon: FileText },
              { id: "referrals", label: "Referrals", icon: Link2 },
              { id: "plans", label: "Plans & Billing", icon: Crown },
              { id: "brand", label: "Branding", icon: Palette },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-4 text-sm border-b-2 transition-all",
                  activeTab === tab.id
                    ? "border-[#BFA14A] text-[#BFA14A]"
                    : "border-transparent text-[#F4EFE6]/40 hover:text-[#F4EFE6]/65"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <CreditMeter used={2} total={5} tier="Professional" />

                {/* Quick stats */}
                <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-6 space-y-4">
                  <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em]">This Month</p>
                  {[
                    { label: "Reports Submitted", value: "2", icon: FileText, color: "text-[#4ecdc4]" },
                    { label: "Reports Delivered", value: "2", icon: CheckCircle, color: "text-green-300" },
                    { label: "Avg. Turnaround", value: "18 hrs", icon: Clock, color: "text-[#BFA14A]" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <s.icon className={cn("w-4 h-4", s.color)} />
                        <span className="text-sm text-[#F4EFE6]/55">{s.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#F4EFE6]/85">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Plan status */}
                <div className="bg-[#0C1919] border border-[#BFA14A]/20 rounded-2xl p-6">
                  <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em] mb-3">Your Plan</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold text-[#F4EFE6]">$145</span>
                    <span className="text-[#F4EFE6]/35 text-sm">/month</span>
                  </div>
                  <p className="text-[#BFA14A] font-semibold mb-4">Professional</p>
                  <div className="space-y-2 mb-5">
                    {["5 reports/month", "Priority turnaround", "BioHarmony Score", "WhatsApp delivery"].map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-[#0F5C5E] shrink-0" />
                        <span className="text-xs text-[#F4EFE6]/55">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("plans")}
                    className="w-full text-center text-xs text-[#BFA14A]/55 hover:text-[#BFA14A] transition underline underline-offset-2"
                  >
                    View upgrade options
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="bg-gradient-to-r from-[#0F5C5E]/20 to-[#BFA14A]/8 border border-[#BFA14A]/20 rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] mb-2">Ready to submit?</p>
                  <h3 className="font-serif text-xl text-[#F4EFE6] mb-1">Upload a new client scan</h3>
                  <p className="text-[#F4EFE6]/45 text-sm">
                    You have <span className="text-[#BFA14A] font-medium">3 credits remaining</span> this month.
                    Our AI pipeline processes reports within 24 hours.
                  </p>
                </div>
                <Link
                  href="/upload-scan"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/20 text-[#F4EFE6] text-sm font-semibold shadow-[0_0_20px_rgba(191,161,74,0.2)] hover:shadow-[0_0_32px_rgba(191,161,74,0.4)] transition-all whitespace-nowrap"
                >
                  <Upload className="w-4 h-4" /> Submit Report
                </Link>
              </div>

              {/* Recent reports */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-[#F4EFE6]/70 uppercase tracking-wider text-xs">Recent Deliveries</h3>
                  <button onClick={() => setActiveTab("reports")} className="text-xs text-[#BFA14A]/50 hover:text-[#BFA14A] transition flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {MOCK_COMPLETED.slice(0, 2).map((r) => (
                    <div key={r.id} className="flex items-center justify-between px-4 py-3.5 bg-[#0C1919] border border-white/8 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-green-900/20 border border-green-700/25 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-300" />
                        </div>
                        <div>
                          <p className="text-sm text-[#F4EFE6]/80 font-medium">{r.name}</p>
                          <p className="text-xs text-[#F4EFE6]/35">{r.type} · {r.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#F4EFE6]/30 hidden sm:block">{r.date}</span>
                        <button className="flex items-center gap-1.5 text-xs text-[#4ecdc4]/60 hover:text-[#4ecdc4] transition">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── REPORTS TAB ─── */}
          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#F4EFE6]">My Reports</h2>
                <Link
                  href="/upload-scan"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F5C5E] text-[#F4EFE6] text-sm font-medium border border-[#BFA14A]/20 hover:shadow-[0_0_20px_rgba(191,161,74,0.25)] transition-all"
                >
                  <Upload className="w-3.5 h-3.5" /> Submit New
                </Link>
              </div>

              <div className="rounded-xl border border-white/8 overflow-hidden">
                <div className="hidden md:grid grid-cols-[0.5fr_1fr_1fr_0.8fr_1fr_0.6fr_auto] gap-3 px-5 py-3 bg-white/4 border-b border-white/8 text-[10px] uppercase tracking-wider text-[#F4EFE6]/30 font-medium">
                  <span>ID</span>
                  <span>Client</span>
                  <span>Type</span>
                  <span>Plan</span>
                  <span>Date</span>
                  <span>Stage</span>
                  <span>PDF</span>
                </div>
                {MOCK_COMPLETED.map((r) => (
                  <div key={r.id} className="flex md:grid md:grid-cols-[0.5fr_1fr_1fr_0.8fr_1fr_0.6fr_auto] gap-3 items-center px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <span className="font-mono text-xs text-[#BFA14A]/60">{r.id}</span>
                    <span className="text-sm text-[#F4EFE6]/80">{r.name}</span>
                    <span className="text-sm text-[#F4EFE6]/55">{r.type}</span>
                    <span className="text-xs text-[#F4EFE6]/45">{r.plan}</span>
                    <span className="text-xs text-[#F4EFE6]/35">{r.date}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/20 text-green-300 border border-green-700/20 w-fit">{r.stage}</span>
                    <button className="flex items-center gap-1 text-xs text-[#4ecdc4]/60 hover:text-[#4ecdc4] transition">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center pt-8 pb-4">
                <p className="text-xs text-[#F4EFE6]/20">PDF downloads will be enabled once your report is fully delivered.</p>
              </div>
            </motion.div>
          )}

          {/* ─── REFERRALS TAB ─── */}
          {activeTab === "referrals" && (
            <motion.div
              key="referrals"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-7"
            >
              <div>
                <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">Referral Dashboard</h2>
                <p className="text-[#F4EFE6]/40 text-sm">
                  Track the clients you've referred to BioHarmony and view your earned commissions.
                </p>
              </div>

              {/* Code lookup */}
              {!refDashboard && (
                <div className="max-w-md">
                  <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-7 space-y-5">
                    <div className="h-[2px] -mt-7 -mx-7 mb-7 rounded-t-2xl bg-gradient-to-r from-transparent via-[#BFA14A]/30 to-transparent" />
                    <div className="w-12 h-12 rounded-xl bg-[#BFA14A]/10 border border-[#BFA14A]/20 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-[#BFA14A]" />
                    </div>
                    <div>
                      <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em] mb-1">Your Referral Code</p>
                      <p className="text-[#F4EFE6]/60 text-sm leading-relaxed">
                        Enter the referral code assigned to you by BioHarmony to view your affiliate stats and shareable link.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={refCodeInput}
                        onChange={(e) => { setRefCodeInput(e.target.value.toUpperCase()); setRefError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && loadRefDashboard()}
                        placeholder="e.g. DRSMITH or WELLNESS-JEN"
                        className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] font-mono placeholder-[#F4EFE6]/20 focus:outline-none focus:border-[#BFA14A]/50 transition text-sm uppercase tracking-wider"
                      />
                      {refError && <p className="text-red-400/75 text-xs">{refError}</p>}
                      <button
                        onClick={loadRefDashboard}
                        disabled={refLoading || !refCodeInput.trim()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BFA14A] text-[#060D0D] text-sm font-semibold hover:bg-[#d4b456] transition disabled:opacity-40"
                      >
                        {refLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</> : <><TrendingUp className="w-4 h-4" /> View Dashboard</>}
                      </button>
                    </div>
                    <p className="text-[10px] text-[#F4EFE6]/20">
                      Don't have a referral code?{" "}
                      <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A]/50 hover:text-[#BFA14A] transition">Contact us</a>
                    </p>
                  </div>
                </div>
              )}

              {/* Dashboard — shown after successful code lookup */}
              {refDashboard && (() => {
                const shareUrl = `${window.location.origin}${BASE}/upload-scan?ref=${refDashboard.referralCode}`;
                return (
                  <div className="space-y-6">
                    {/* Welcome bar */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em] mb-0.5">Affiliate Dashboard</p>
                        <h3 className="text-xl font-serif text-[#F4EFE6]">{refDashboard.name}</h3>
                      </div>
                      <button
                        onClick={() => { setRefDashboard(null); setRefCodeInput(""); }}
                        className="text-xs text-[#F4EFE6]/25 hover:text-[#F4EFE6]/55 transition underline underline-offset-2"
                      >
                        Switch code
                      </button>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Total Referrals", value: refDashboard.totalReferrals.toString(), icon: Users, color: "text-[#4ecdc4]" },
                        { label: "Reports Delivered", value: refDashboard.completedReports.toString(), icon: CheckCircle, color: "text-green-300" },
                        { label: "Commission Earned", value: `$${refDashboard.earnedCommission}`, icon: DollarSign, color: "text-[#BFA14A]" },
                        { label: "Pending Payout", value: refDashboard.pendingPayout > 0 ? `$${refDashboard.pendingPayout}` : "—", icon: TrendingUp, color: refDashboard.pendingPayout > 0 ? "text-amber-300" : "text-[#F4EFE6]/25" },
                      ].map((s) => (
                        <div key={s.label} className="bg-[#0C1919] border border-white/10 rounded-2xl p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em]">{s.label}</p>
                            <s.icon className={cn("w-4 h-4", s.color)} />
                          </div>
                          <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Commission rate info */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#BFA14A]/5 border border-[#BFA14A]/15">
                      <DollarSign className="w-4 h-4 text-[#BFA14A] shrink-0" />
                      <p className="text-sm text-[#F4EFE6]/55">
                        Your commission rate is <span className="text-[#BFA14A] font-semibold">{refDashboard.commissionRate}%</span> of net revenue from delivered reports.
                        Total revenue generated: <span className="text-[#F4EFE6]/70 font-medium">${refDashboard.revenueGenerated}</span>
                        {refDashboard.totalPaid > 0 && <> · Total paid out: <span className="text-green-300/70 font-medium">${refDashboard.totalPaid}</span></>}
                      </p>
                    </div>

                    {/* Shareable link */}
                    <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-6 space-y-4">
                      <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em]">Your Shareable Link</p>
                      <p className="text-[#F4EFE6]/45 text-sm">Share this link with clients — your referral code will be attached automatically.</p>

                      {/* Referral code copy */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider mb-2">Referral Code</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#BFA14A] font-mono text-sm tracking-[0.15em]">
                              {refDashboard.referralCode}
                            </code>
                            <button
                              onClick={() => copyToClipboard(refDashboard.referralCode, "code")}
                              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/12 text-xs text-[#F4EFE6]/50 hover:text-[#F4EFE6]/80 hover:border-white/25 transition whitespace-nowrap"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              {copied === "code" ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider mb-2">Shareable URL</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#4ecdc4]/70 font-mono text-xs truncate">
                              {shareUrl}
                            </code>
                            <button
                              onClick={() => copyToClipboard(shareUrl, "link")}
                              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/12 text-xs text-[#F4EFE6]/50 hover:text-[#F4EFE6]/80 hover:border-white/25 transition whitespace-nowrap"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              {copied === "link" ? "Copied!" : "Copy"}
                            </button>
                            <a
                              href={shareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/12 text-xs text-[#F4EFE6]/50 hover:text-[#4ecdc4] hover:border-[#4ecdc4]/30 transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent referrals */}
                    {refDashboard.recentReferrals.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 mb-4">Recent Referrals</p>
                        <div className="rounded-xl border border-white/8 overflow-hidden">
                          <div className="hidden sm:grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr] gap-3 px-5 py-3 bg-white/4 border-b border-white/8 text-[10px] uppercase tracking-wider text-[#F4EFE6]/25">
                            <span>Report Type</span>
                            <span>Plan</span>
                            <span>Stage</span>
                            <span>Date</span>
                          </div>
                          {refDashboard.recentReferrals.map((r, i) => (
                            <div key={i} className="flex sm:grid sm:grid-cols-[1fr_0.8fr_0.8fr_0.8fr] gap-3 items-center px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                              <span className="text-sm text-[#F4EFE6]/75">{r.reportType}</span>
                              <span className="text-xs text-[#F4EFE6]/45 capitalize">{r.plan ?? "basic"}</span>
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full w-fit border",
                                r.pipelineStage === "delivered"
                                  ? "bg-green-900/20 text-green-300 border-green-700/20"
                                  : "bg-white/5 text-[#F4EFE6]/40 border-white/8"
                              )}>
                                {r.pipelineStage}
                              </span>
                              <span className="text-xs text-[#F4EFE6]/30">
                                {new Date(r.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {refDashboard.recentReferrals.length === 0 && (
                      <div className="text-center py-10 text-[#F4EFE6]/25 text-sm">
                        No referrals yet. Share your link to get started.
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ─── PLANS TAB ─── */}
          {activeTab === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">Plans &amp; Billing</h2>
                <p className="text-[#F4EFE6]/40 text-sm">All plans include personalized BioHarmony reports, client delivery, and practitioner support.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      "relative rounded-2xl p-6 border transition-all",
                      tier.highlight
                        ? "border-[#BFA14A]/45 bg-[#BFA14A]/6 shadow-[0_0_40px_rgba(191,161,74,0.15)]"
                        : "border-white/10 bg-[#0C1919]/80 hover:border-white/18"
                    )}
                  >
                    {tier.badge && (
                      <span className={cn(
                        "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap",
                        tier.badge === "Most Popular"
                          ? "bg-[#BFA14A] text-[#060D0D]"
                          : "bg-[#0F5C5E] text-[#F4EFE6]"
                      )}>
                        {tier.badge}
                      </span>
                    )}
                    <p className={cn(
                      "text-xs uppercase tracking-wider font-semibold mb-1",
                      tier.highlight ? "text-[#BFA14A]" : "text-[#F4EFE6]/50"
                    )}>
                      {tier.label}
                    </p>
                    <div className="flex items-baseline gap-0.5 mb-4">
                      <span className="text-2xl font-bold text-[#F4EFE6]">{tier.price}</span>
                      <span className="text-[#F4EFE6]/30 text-sm">{tier.interval}</span>
                    </div>
                    {tier.credits > 0 && (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/8">
                        <Zap className="w-3.5 h-3.5 text-[#4ecdc4]" />
                        <span className="text-xs text-[#F4EFE6]/60">
                          <span className="font-semibold text-[#F4EFE6]/80">{tier.credits}</span> reports/month
                        </span>
                      </div>
                    )}
                    <div className="space-y-2 mb-5">
                      {tier.features.map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle className={cn("w-3.5 h-3.5 mt-0.5 shrink-0", tier.highlight ? "text-[#BFA14A]" : "text-[#0F5C5E]")} />
                          <span className="text-xs text-[#F4EFE6]/55 leading-relaxed">{f}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className={cn(
                        "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
                        tier.highlight
                          ? "bg-[#BFA14A] text-[#060D0D] hover:bg-[#d4b456]"
                          : tier.id === "professional"
                            ? "bg-white/5 text-[#F4EFE6]/50 cursor-default text-xs"
                            : "bg-transparent border border-white/15 text-[#F4EFE6]/55 hover:border-white/30 hover:text-[#F4EFE6]/80"
                      )}
                    >
                      {tier.id === "professional" ? "Current Plan" : "Upgrade"}
                    </button>
                  </div>
                ))}
              </div>

              {/* White-label note */}
              <div className="bg-[#0C1919] border border-white/8 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#BFA14A]/10 border border-[#BFA14A]/20 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-[#BFA14A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F4EFE6]/80 mb-1">About White-Label Reporting</p>
                  <p className="text-sm text-[#F4EFE6]/45 leading-relaxed">
                    With the white-label add-on, your clients receive reports branded with your practice logo, colors, and name —
                    with no visible BioHarmony branding. Requires any paid base subscription.
                    Contact us to enable: {" "}
                    <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A] hover:text-[#d4b456] transition underline underline-offset-2">
                      info@bioharmonysolutions.ca
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/6">
                <Users className="w-4 h-4 text-[#F4EFE6]/30 mt-0.5 shrink-0" />
                <p className="text-xs text-[#F4EFE6]/35 leading-relaxed">
                  Stripe payment integration coming soon — billing will be processed securely. All plans include a 7-day trial period.
                  Contact us at{" "}
                  <a href="mailto:info@bioharmonysolutions.ca" className="text-[#BFA14A]/55 hover:text-[#BFA14A] transition">
                    info@bioharmonysolutions.ca
                  </a>
                  {" "}to get started immediately.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "brand" && (
            <motion.div key="brand" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-7">

              {/* Intro */}
              <div>
                <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">White-Label Branding</h2>
                <p className="text-[#F4EFE6]/45 text-sm leading-relaxed">
                  Customise how your clients receive their reports. Your logo, business name and accent colour will appear on all delivered PDFs and client portal pages.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Left — inputs */}
                <div className="space-y-5">

                  {/* Business name */}
                  <div>
                    <label className="block text-xs text-[#F4EFE6]/45 uppercase tracking-wider mb-2">Practice / Business Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Harmony Wellness Studio"
                      className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/50 transition text-sm"
                    />
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label className="block text-xs text-[#F4EFE6]/45 uppercase tracking-wider mb-2">Logo URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={brandLogo}
                        onChange={(e) => setBrandLogo(e.target.value)}
                        placeholder="https://your-site.com/logo.png"
                        className="flex-1 bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/50 transition text-sm"
                      />
                      {brandLogo && (
                        <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
                          <img src={brandLogo} alt="logo preview" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-[#F4EFE6]/25 mt-1.5">PNG or SVG with transparent background works best.</p>
                  </div>

                  {/* Accent colour */}
                  <div>
                    <label className="block text-xs text-[#F4EFE6]/45 uppercase tracking-wider mb-2">Accent Colour</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandAccent}
                        onChange={(e) => setBrandAccent(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-white/15 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={brandAccent}
                        onChange={(e) => setBrandAccent(e.target.value)}
                        className="w-28 bg-white/5 border border-white/12 rounded-lg px-3 py-2 text-[#F4EFE6] text-sm font-mono focus:outline-none focus:border-[#BFA14A]/50 transition uppercase"
                        maxLength={7}
                      />
                      {/* Preset swatches */}
                      <div className="flex gap-1.5">
                        {["#BFA14A","#0F5C5E","#6366f1","#e85d75","#10b981"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            title={c}
                            onClick={() => setBrandAccent(c)}
                            className={cn("w-6 h-6 rounded-full border-2 transition", brandAccent.toLowerCase() === c.toLowerCase() ? "border-white/70 scale-110" : "border-transparent hover:border-white/40")}
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save */}
                  <button
                    type="button"
                    onClick={saveBrand}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200",
                      brandSaved
                        ? "bg-emerald-900/30 border border-emerald-700/40 text-emerald-300"
                        : "bg-[#BFA14A] text-[#060D0D] hover:bg-[#d4b456] shadow-[0_0_20px_rgba(191,161,74,0.3)]"
                    )}
                  >
                    {brandSaved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Branding</>}
                  </button>
                </div>

                {/* Right — live preview */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 mb-3">Report Header Preview</p>
                  <div className="rounded-2xl border border-white/10 bg-[#0C1919] overflow-hidden">
                    {/* Mock report header */}
                    <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between" style={{ borderBottomColor: `${brandAccent}22` }}>
                      <div className="flex items-center gap-3">
                        {brandLogo ? (
                          <img src={brandLogo} alt="" className="h-8 w-auto object-contain" onError={() => {}} />
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${brandAccent}22`, border: `1px solid ${brandAccent}44` }}>
                            <ImageIcon className="w-4 h-4" style={{ color: brandAccent }} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#F4EFE6]">{brandName || "Your Practice Name"}</p>
                          <p className="text-[10px] text-[#F4EFE6]/35">Wellness Report</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#F4EFE6]/30">Client Copy</p>
                        <p className="text-[10px] font-mono" style={{ color: brandAccent }}>BH-0001</p>
                      </div>
                    </div>
                    <div className="px-6 py-4 space-y-2">
                      <div className="h-2 rounded-full bg-white/8 w-3/4" />
                      <div className="h-2 rounded-full bg-white/5 w-1/2" />
                      <div className="mt-4 h-1 rounded-full w-full" style={{ background: `${brandAccent}33` }} />
                    </div>
                    <div className="px-6 pb-4 flex items-center justify-between">
                      <p className="text-[10px] text-[#F4EFE6]/20">Non-diagnostic wellness insight only</p>
                      <div className="text-[10px] px-2 py-0.5 rounded-full text-[#F4EFE6]/30" style={{ background: `${brandAccent}15`, border: `1px solid ${brandAccent}25` }}>
                        {brandName || "Your Brand"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-white/3 border border-white/6">
                    <Palette className="w-3.5 h-3.5 text-[#F4EFE6]/30 mt-0.5 shrink-0" />
                    <p className="text-xs text-[#F4EFE6]/35 leading-relaxed">
                      White-label delivery is applied to all new reports after saving. Existing delivered reports are not retroactively updated.
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
