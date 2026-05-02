import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Copy, Check, Loader2, LogOut, Users, Calendar, ArrowUpDown } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const SESSION_KEY = "bh_admin_token";

interface Lead {
  id: number;
  firstName: string;
  email: string;
  reportType: string;
  note: string | null;
  createdAt: string;
}

const BADGE_COLORS: Record<string, string> = {
  "Basic Report": "bg-[#0F5C5E]/30 text-[#4ecdc4] border-[#0F5C5E]/40",
  "Advanced Case": "bg-[#BFA14A]/15 text-[#d4b76a] border-[#BFA14A]/30",
  "Pet Report": "bg-purple-900/30 text-purple-300 border-purple-700/30",
};

function badgeClass(type: string) {
  return BADGE_COLORS[type] ?? "bg-white/10 text-[#F4EFE6]/60 border-white/15";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      onClick={copy}
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
      if (res.status === 401) {
        setError("Incorrect password. Try again.");
        setLoading(false);
        return;
      }
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
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
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-[#F4EFE6] text-sm placeholder:text-[#F4EFE6]/25 focus:outline-none focus:border-[#BFA14A]/50 transition-all duration-200"
              />
            </div>
            {error && (
              <p className="text-red-400/80 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
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

/* ── Leads table ───────────────────────────────────────── */
function LeadsTable({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { onSignOut(); return; }
      if (!res.ok) throw new Error("Server error");
      const data = (await res.json()) as { leads: Lead[] };
      setLeads(data.leads);
      setLastRefresh(new Date());
    } catch {
      setError("Failed to load leads. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [token, onSignOut]);

  useEffect(() => { void fetchLeads(); }, [fetchLeads]);

  const today = leads.filter((l) => {
    const d = new Date(l.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const thisWeek = leads.filter((l) => {
    const d = new Date(l.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6]">
      {/* Header */}
      <div className="border-b border-white/8 bg-[#060D0D]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F5C5E]/40 border border-[#0F5C5E]/30 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-[#4ecdc4]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#F4EFE6]">Report Requests</h1>
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
              onClick={() => void fetchLeads()}
              disabled={loading}
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
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Leads", value: leads.length, icon: Users },
            { label: "This Week", value: thisWeek, icon: ArrowUpDown },
            { label: "Today", value: today, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#0C1919] border border-white/8 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-[#BFA14A]/60" />
                <p className="text-[#F4EFE6]/40 text-xs">{label}</p>
              </div>
              <p className="text-2xl font-semibold text-[#F4EFE6]">{value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {error ? (
          <div className="text-center py-16 text-red-400/70 text-sm">{error}</div>
        ) : loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-20 gap-3 text-[#F4EFE6]/30">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading leads…</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20 text-[#F4EFE6]/30 text-sm">
            No leads yet. Share the sample reports to start collecting interest.
          </div>
        ) : (
          <div className="bg-[#0C1919] border border-white/8 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/8">
                    {["Date", "Name", "Email", "Report Type", "Note"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-[#F4EFE6]/35 text-xs font-medium uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {leads.map((lead, i) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        className="border-b border-white/[0.05] hover:bg-white/[0.025] transition-colors duration-150 last:border-0"
                      >
                        <td className="px-5 py-4 text-[#F4EFE6]/40 text-xs whitespace-nowrap">
                          <span title={formatDate(lead.createdAt)} className="cursor-help">
                            {formatDateShort(lead.createdAt)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#F4EFE6]/85 text-sm font-medium">
                          {lead.firstName}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-[#BFA14A]/80 text-sm hover:text-[#BFA14A] transition-colors duration-150"
                            >
                              {lead.email}
                            </a>
                            <CopyButton text={lead.email} />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${badgeClass(lead.reportType)}`}>
                            {lead.reportType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#F4EFE6]/40 text-sm max-w-xs">
                          {lead.note ? (
                            <span className="line-clamp-2 leading-relaxed" title={lead.note}>
                              {lead.note}
                            </span>
                          ) : (
                            <span className="text-[#F4EFE6]/20 italic text-xs">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function AdminLeads() {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY)
  );

  function handleAuth(t: string) { setToken(t); }
  function handleSignOut() {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  }

  if (!token) return <AuthGate onAuth={handleAuth} />;
  return <LeadsTable token={token} onSignOut={handleSignOut} />;
}
