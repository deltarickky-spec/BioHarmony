import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw, Copy, Check, Loader2, LogOut, Users, Calendar,
  ArrowUpDown, UploadCloud, MessageSquare, Phone, Globe, FileText, MessageCircle,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const SESSION_KEY = "bh_admin_token";

interface ReportRequest {
  id: number;
  firstName: string;
  email: string;
  reportType: string;
  note: string | null;
  createdAt: string;
}

interface ScanRequest {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  reportType: string;
  language: string;
  fileName: string | null;
  whatsapp: boolean | null;
  note: string | null;
  createdAt: string;
}

const REPORT_TYPE_DISPLAY: Record<string, string> = {
  inner_voice: "Inner Voice",
  vitals: "Vitals",
  comprehensive: "Comprehensive",
  body_systems: "Body Systems",
};

const LANG_DISPLAY: Record<string, string> = {
  en: "English", es: "Español", fr: "Français",
  pt: "Português", de: "Deutsch", it: "Italiano",
};

const BADGE: Record<string, string> = {
  "Basic Report": "bg-[#0F5C5E]/30 text-[#4ecdc4] border-[#0F5C5E]/40",
  "Advanced Case": "bg-[#BFA14A]/15 text-[#d4b76a] border-[#BFA14A]/30",
  "Pet Report": "bg-purple-900/30 text-purple-300 border-purple-700/30",
  inner_voice: "bg-[#0F5C5E]/30 text-[#4ecdc4] border-[#0F5C5E]/40",
  vitals: "bg-[#BFA14A]/15 text-[#d4b76a] border-[#BFA14A]/30",
  comprehensive: "bg-purple-900/30 text-purple-300 border-purple-700/30",
  body_systems: "bg-blue-900/30 text-blue-300 border-blue-700/30",
};

function badgeClass(type: string) {
  return BADGE[type] ?? "bg-white/10 text-[#F4EFE6]/60 border-white/15";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function countToday(items: { createdAt: string }[]) {
  const today = new Date().toDateString();
  return items.filter((i) => new Date(i.createdAt).toDateString() === today).length;
}

function countThisWeek(items: { createdAt: string }[]) {
  const weekAgo = new Date(Date.now() - 7 * 86_400_000);
  return items.filter((i) => new Date(i.createdAt) >= weekAgo).length;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="ml-1.5 p-1 rounded-md text-[#F4EFE6]/30 hover:text-[#BFA14A]/80 hover:bg-white/5 transition-all duration-150"
      title="Copy email"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

/* ── Auth gate ─────────────────────────────────────────── */
function AuthGate({ onAuth }: { onAuth: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${password}` },
      });
      if (res.status === 401) { setError("Incorrect password. Try again."); setLoading(false); return; }
      if (!res.ok) throw new Error("Server error");
      sessionStorage.setItem(SESSION_KEY, password);
      onAuth(password);
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060D0D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }} className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] mb-2">Admin Access</p>
          <h1 className="text-2xl font-serif text-[#F4EFE6]">BioHarmony Leads</h1>
        </div>
        <div className="bg-[#0C1919] border border-white/10 rounded-2xl overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#BFA14A]/50 to-transparent" />
          <form onSubmit={submit} className="p-7 space-y-4">
            <div>
              <label className="block text-[#F4EFE6]/50 text-xs mb-1.5 ml-0.5">Password</label>
              <input
                type="password" required autoFocus value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-[#F4EFE6] text-sm placeholder:text-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/50 transition-all duration-200"
              />
            </div>
            {error && (
              <p className="text-red-400/80 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/25 text-[#F4EFE6] text-sm font-medium hover:bg-[#0F5C5E]/80 disabled:opacity-60 transition-all duration-200 shadow-[0_0_16px_rgba(191,161,74,0.15)]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Empty state ───────────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 text-[#F4EFE6]/25 text-sm">{message}</div>
  );
}

/* ── Report Requests table ─────────────────────────────── */
function ReportRequestsTable({ rows }: { rows: ReportRequest[] }) {
  if (rows.length === 0) return <EmptyState message="No report requests yet. Share the sample reports to start collecting interest." />;
  return (
    <div className="bg-[#0C1919] border border-white/8 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              {["Date", "Name", "Email", "Report Type", "Note"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[#F4EFE6]/35 text-xs font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="border-b border-white/[0.05] hover:bg-white/[0.025] transition-colors duration-150 last:border-0"
                >
                  <td className="px-5 py-4 text-[#F4EFE6]/40 text-xs whitespace-nowrap">
                    <span title={formatDate(row.createdAt)} className="cursor-help">{formatDateShort(row.createdAt)}</span>
                  </td>
                  <td className="px-5 py-4 text-[#F4EFE6]/85 text-sm font-medium">{row.firstName}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      <a href={`mailto:${row.email}`} className="text-[#BFA14A]/80 text-sm hover:text-[#BFA14A] transition-colors duration-150">{row.email}</a>
                      <CopyButton text={row.email} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClass(row.reportType)}`}>
                      {row.reportType}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#F4EFE6]/40 text-sm max-w-xs">
                    {row.note
                      ? <span className="line-clamp-2 leading-relaxed" title={row.note}>{row.note}</span>
                      : <span className="text-[#F4EFE6]/20 italic text-xs">—</span>}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Scan Requests table ───────────────────────────────── */
function ScanRequestsTable({ rows }: { rows: ScanRequest[] }) {
  if (rows.length === 0) return <EmptyState message="No scan uploads yet. Visitors will appear here once they submit via the Upload Scan page." />;
  return (
    <div className="bg-[#0C1919] border border-white/8 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-white/8">
              {["Date", "Name", "Contact", "Report Type", "Language", "File", "Details"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[#F4EFE6]/35 text-xs font-medium uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="border-b border-white/[0.05] hover:bg-white/[0.025] transition-colors duration-150 last:border-0"
                >
                  <td className="px-5 py-4 text-[#F4EFE6]/40 text-xs whitespace-nowrap">
                    <span title={formatDate(row.createdAt)} className="cursor-help">{formatDateShort(row.createdAt)}</span>
                  </td>

                  <td className="px-5 py-4 text-[#F4EFE6]/85 text-sm font-medium whitespace-nowrap">{row.name}</td>

                  <td className="px-5 py-4 min-w-[200px]">
                    <div className="flex items-center mb-0.5">
                      <a href={`mailto:${row.email}`} className="text-[#BFA14A]/80 text-sm hover:text-[#BFA14A] transition-colors duration-150">{row.email}</a>
                      <CopyButton text={row.email} />
                    </div>
                    {row.phone && (
                      <div className="flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3 text-[#F4EFE6]/25 flex-shrink-0" />
                        <span className="text-[#F4EFE6]/40 text-xs">{row.phone}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClass(row.reportType)}`}>
                      {REPORT_TYPE_DISPLAY[row.reportType] ?? row.reportType}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-[#F4EFE6]/25 flex-shrink-0" />
                      <span className="text-[#F4EFE6]/60 text-xs">{LANG_DISPLAY[row.language] ?? row.language}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {row.fileName
                      ? (
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-[#BFA14A]/40 flex-shrink-0" />
                          <span className="text-[#F4EFE6]/60 text-xs truncate max-w-[120px]" title={row.fileName}>{row.fileName}</span>
                        </div>
                      )
                      : <span className="text-[#F4EFE6]/20 italic text-xs">—</span>}
                  </td>

                  <td className="px-5 py-4 min-w-[180px]">
                    <div className="space-y-1.5">
                      {row.whatsapp && (
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="w-3 h-3 text-[#25D366] flex-shrink-0" />
                          <span className="text-[#25D366]/70 text-xs">WhatsApp</span>
                        </div>
                      )}
                      {row.note && (
                        <div className="flex items-start gap-1.5">
                          <MessageSquare className="w-3 h-3 text-[#F4EFE6]/25 flex-shrink-0 mt-0.5" />
                          <span className="text-[#F4EFE6]/40 text-xs line-clamp-2 leading-relaxed" title={row.note}>{row.note}</span>
                        </div>
                      )}
                      {!row.whatsapp && !row.note && <span className="text-[#F4EFE6]/20 italic text-xs">—</span>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main dashboard ────────────────────────────────────── */
function LeadsDashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [reportRequests, setReportRequests] = useState<ReportRequest[]>([]);
  const [scanRequests, setScanRequests] = useState<ScanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"reports" | "scans">("reports");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onSignOut(); return; }
      if (!res.ok) throw new Error("Server error");
      const data = (await res.json()) as { reportRequests: ReportRequest[]; scanRequests: ScanRequest[] };
      setReportRequests(data.reportRequests ?? []);
      setScanRequests(data.scanRequests ?? []);
      setLastRefresh(new Date());
    } catch {
      setError("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [token, onSignOut]);

  useEffect(() => { void fetchAll(); }, [fetchAll]);

  const allItems = [...reportRequests, ...scanRequests];
  const totalToday = countToday(allItems);
  const totalThisWeek = countThisWeek(allItems);

  const tabs = [
    { id: "reports" as const, label: "Report Requests", icon: MessageSquare, count: reportRequests.length },
    { id: "scans" as const, label: "Scan Uploads", icon: UploadCloud, count: scanRequests.length },
  ];

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6]">
      {/* Top bar */}
      <div className="border-b border-white/8 bg-[#060D0D]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F5C5E]/40 border border-[#0F5C5E]/30 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-[#4ecdc4]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#F4EFE6]">Client Leads</h1>
              <p className="text-[#F4EFE6]/35 text-xs">BioHarmony Solutions Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-[#F4EFE6]/25 text-xs hidden sm:block">
                Updated {lastRefresh.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={() => void fetchAll()} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-[#F4EFE6]/60 text-xs hover:text-[#F4EFE6]/90 hover:bg-white/[0.08] disabled:opacity-50 transition-all duration-150"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#F4EFE6]/35 text-xs hover:text-[#F4EFE6]/70 hover:bg-white/[0.04] transition-all duration-150"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: allItems.length, icon: Users, sub: "all sources" },
            { label: "This Week", value: totalThisWeek, icon: ArrowUpDown, sub: "last 7 days" },
            { label: "Today", value: totalToday, icon: Calendar, sub: "new today" },
            { label: "Sources", value: `${reportRequests.length} / ${scanRequests.length}`, icon: UploadCloud, sub: "requests · uploads" },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="bg-[#0C1919] border border-white/8 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-[#BFA14A]/60" />
                <p className="text-[#F4EFE6]/40 text-xs">{label}</p>
              </div>
              <p className="text-2xl font-semibold text-[#F4EFE6]">{value}</p>
              <p className="text-[#F4EFE6]/25 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 -mb-px ${
                activeTab === tab.id
                  ? "border-[#BFA14A] text-[#F4EFE6]"
                  : "border-transparent text-[#F4EFE6]/40 hover:text-[#F4EFE6]/70"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-semibold border ${
                activeTab === tab.id
                  ? "bg-[#BFA14A]/15 text-[#BFA14A] border-[#BFA14A]/30"
                  : "bg-white/[0.06] text-[#F4EFE6]/35 border-white/10"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table area */}
        {error ? (
          <div className="text-center py-16 text-red-400/70 text-sm">{error}</div>
        ) : loading && allItems.length === 0 ? (
          <div className="flex items-center justify-center py-20 gap-3 text-[#F4EFE6]/30">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading leads…</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "reports" ? (
              <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <ReportRequestsTable rows={reportRequests} />
              </motion.div>
            ) : (
              <motion.div key="scans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                <ScanRequestsTable rows={scanRequests} />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function AdminLeads() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));
  function handleSignOut() { sessionStorage.removeItem(SESSION_KEY); setToken(null); }
  if (!token) return <AuthGate onAuth={(t) => setToken(t)} />;
  return <LeadsDashboard token={token} onSignOut={handleSignOut} />;
}
