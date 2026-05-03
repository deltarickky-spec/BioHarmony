import { useState, useEffect, useMemo } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const ADMIN_PASSWORD_KEY = "bh_admin_token";

const VALID_STATUSES = ["new", "in_review", "in_progress", "completed", "delivered"] as const;
type Status = (typeof VALID_STATUSES)[number];

const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  in_review: "In Review",
  in_progress: "In Progress",
  completed: "Completed",
  delivered: "Delivered",
};

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-[#BFA14A]/15 text-[#BFA14A] border border-[#BFA14A]/30",
  in_review: "bg-blue-900/30 text-blue-300 border border-blue-700/30",
  in_progress: "bg-[#0F5C5E]/40 text-[#4ecdc4] border border-[#0F5C5E]/50",
  completed: "bg-green-900/30 text-green-300 border border-green-700/30",
  delivered: "bg-purple-900/30 text-purple-300 border border-purple-700/30",
};

const STATUS_NEXT: Record<Status, Status[]> = {
  new: ["in_review", "in_progress"],
  in_review: ["in_progress", "completed"],
  in_progress: ["completed"],
  completed: ["delivered"],
  delivered: [],
};

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
  note?: string | null;
  status: Status;
  createdAt: string;
}

interface RawReportRequest {
  id: number;
  firstName: string;
  email: string;
  reportType: string;
  note?: string | null;
  status: string;
  createdAt: string;
}

interface RawScanRequest {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  reportType: string;
  language: string;
  fileName?: string | null;
  whatsapp?: boolean | null;
  note?: string | null;
  status: string;
  createdAt: string;
}

function normalizeStatus(s: string): Status {
  if (VALID_STATUSES.includes(s as Status)) return s as Status;
  return "new";
}

function normalize(report: RawReportRequest): UnifiedRequest {
  return {
    id: report.id,
    source: "report",
    name: report.firstName,
    email: report.email,
    reportType: report.reportType,
    note: report.note,
    status: normalizeStatus(report.status),
    createdAt: report.createdAt,
  };
}

function normalizeScan(scan: RawScanRequest): UnifiedRequest {
  return {
    id: scan.id,
    source: "scan",
    name: scan.name,
    email: scan.email,
    phone: scan.phone,
    reportType: scan.reportType,
    language: scan.language,
    fileName: scan.fileName,
    whatsapp: scan.whatsapp,
    note: scan.note,
    status: normalizeStatus(scan.status),
    createdAt: scan.createdAt,
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function StatCard({
  label,
  value,
  color,
  onClick,
  active,
}: {
  label: string;
  value: number;
  color: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[120px] rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-[#BFA14A] bg-[#BFA14A]/10"
          : "border-white/10 bg-[#0C1919] hover:border-white/20"
      }`}
    >
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-[#F4EFE6]/50 mt-1">{label}</div>
    </button>
  );
}

function DetailPanel({
  request,
  onClose,
  onStatusChange,
}: {
  request: UnifiedRequest;
  onClose: () => void;
  onStatusChange: (id: number, source: "report" | "scan", status: Status) => void;
}) {
  const [updating, setUpdating] = useState(false);

  async function changeStatus(status: Status) {
    setUpdating(true);
    onStatusChange(request.id, request.source, status);
    setUpdating(false);
  }

  const langMap: Record<string, string> = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    de: "German",
    zh: "Chinese",
    ar: "Arabic",
    hi: "Hindi",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative z-10 w-full max-w-lg h-full bg-[#0C1919] border-l border-white/10 overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-[#F4EFE6]">{request.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                  request.source === "scan"
                    ? "bg-[#0F5C5E]/30 text-[#4ecdc4] border-[#0F5C5E]/40"
                    : "bg-[#BFA14A]/10 text-[#BFA14A] border-[#BFA14A]/20"
                }`}
              >
                {request.source === "scan" ? "Scan Upload" : "Report Request"}
              </span>
              <StatusBadge status={request.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#F4EFE6]/40 hover:text-[#F4EFE6] transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 p-6 space-y-6">
          <section>
            <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">
              Client Info
            </h3>
            <div className="space-y-2">
              <DetailRow label="Name" value={request.name} />
              <DetailRow label="Email" value={request.email} />
              {request.phone && (
                <DetailRow
                  label="Phone"
                  value={
                    request.phone +
                    (request.whatsapp ? " ✓ WhatsApp" : "")
                  }
                />
              )}
            </div>
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">
              Submission Details
            </h3>
            <div className="space-y-2">
              <DetailRow label="Report Type" value={request.reportType} />
              {request.language && (
                <DetailRow
                  label="Language"
                  value={langMap[request.language] ?? request.language}
                />
              )}
              {request.fileName && (
                <DetailRow label="Uploaded File" value={request.fileName} />
              )}
              <DetailRow label="Submitted" value={formatDate(request.createdAt)} />
            </div>
          </section>

          {request.note && (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">
                Notes
              </h3>
              <p className="text-sm text-[#F4EFE6]/70 bg-white/5 rounded-lg p-3 border border-white/10 leading-relaxed">
                {request.note}
              </p>
            </section>
          )}

          {/* Status Management */}
          <section>
            <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">
              Update Status
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {VALID_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={updating || request.status === s}
                  onClick={() => changeStatus(s)}
                  className={`py-2.5 px-4 rounded-lg text-sm font-medium text-left flex items-center justify-between transition-all ${
                    request.status === s
                      ? `${STATUS_STYLES[s]} opacity-100 cursor-default`
                      : "border border-white/10 text-[#F4EFE6]/60 hover:border-white/25 hover:text-[#F4EFE6]/90 hover:bg-white/5"
                  } disabled:cursor-default`}
                >
                  <span>{STATUS_LABELS[s]}</span>
                  {request.status === s && (
                    <span className="text-xs opacity-70">Current</span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Quick actions for most common next steps */}
          {STATUS_NEXT[request.status].length > 0 && (
            <section>
              <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] mb-3 font-medium">
                Quick Actions
              </h3>
              <div className="flex gap-2 flex-wrap">
                {STATUS_NEXT[request.status].map((nextStatus) => (
                  <button
                    key={nextStatus}
                    disabled={updating}
                    onClick={() => changeStatus(nextStatus)}
                    className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#BFA14A] text-[#060D0D] hover:bg-[#d4b456] transition-colors disabled:opacity-50"
                  >
                    Mark {STATUS_LABELS[nextStatus]}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-[#F4EFE6]/40 min-w-[110px] shrink-0">{label}</span>
      <span className="text-[#F4EFE6]/90 break-all">{value}</span>
    </div>
  );
}

// ── Auth Gate ─────────────────────────────────────────────────────────────────

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
          <div className="text-[#BFA14A] text-sm tracking-[0.3em] uppercase mb-2">
            BioHarmony Solutions
          </div>
          <h1 className="text-2xl font-light text-[#F4EFE6]">Admin Dashboard</h1>
        </div>
        <form
          onSubmit={submit}
          className="bg-[#0C1919] border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-xs text-[#F4EFE6]/50 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/30 focus:outline-none focus:border-[#BFA14A]/60 transition"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#BFA14A] text-[#060D0D] font-semibold hover:bg-[#d4b456] transition"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(ADMIN_PASSWORD_KEY)
  );
  const [requests, setRequests] = useState<UnifiedRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "report" | "scan">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UnifiedRequest | null>(null);

  async function fetchData(authToken: string) {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${BASE}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (resp.status === 401) {
        sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
        setToken(null);
        return;
      }
      if (!resp.ok) throw new Error("Failed to fetch");
      const data = await resp.json();
      const unified: UnifiedRequest[] = [
        ...(data.reportRequests ?? []).map(normalize),
        ...(data.scanRequests ?? []).map(normalizeScan),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequests(unified);
    } catch {
      setError("Could not load requests. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

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

  async function handleStatusChange(id: number, source: "report" | "scan", status: Status) {
    if (!token) return;

    setRequests((prev) =>
      prev.map((r) => (r.id === id && r.source === source ? { ...r, status } : r))
    );
    if (selected?.id === id && selected?.source === source) {
      setSelected((prev) => (prev ? { ...prev, status } : prev));
    }

    try {
      await fetch(`${BASE}/api/admin/requests/${source}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch {
      // silently ignore — UI is already updated optimistically
    }
  }

  const stats = useMemo(() => {
    const total = requests.length;
    const byStatus = VALID_STATUSES.reduce(
      (acc, s) => {
        acc[s] = requests.filter((r) => r.status === s).length;
        return acc;
      },
      {} as Record<Status, number>
    );
    return { total, ...byStatus };
  }, [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (sourceFilter !== "all") list = list.filter((r) => r.source === sourceFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.reportType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, statusFilter, sourceFilter, search]);

  if (!token) return <AuthGate onAuth={handleAuth} />;

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#060D0D]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[#BFA14A] text-sm tracking-[0.25em] uppercase font-medium">
              BioHarmony
            </div>
            <span className="text-white/20">·</span>
            <span className="text-[#F4EFE6]/60 text-sm">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => token && fetchData(token)}
              className="text-xs text-[#F4EFE6]/40 hover:text-[#F4EFE6]/80 transition px-3 py-1.5 rounded border border-white/10 hover:border-white/20"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-[#F4EFE6]/40 hover:text-red-400 transition px-3 py-1.5 rounded border border-white/10 hover:border-red-900/40"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="flex gap-3 flex-wrap">
          <StatCard
            label="All Requests"
            value={stats.total}
            color="text-[#F4EFE6]"
            onClick={() => setStatusFilter("all")}
            active={statusFilter === "all"}
          />
          <StatCard
            label="New"
            value={stats.new}
            color="text-[#BFA14A]"
            onClick={() => setStatusFilter("new")}
            active={statusFilter === "new"}
          />
          <StatCard
            label="In Review"
            value={stats.in_review}
            color="text-blue-300"
            onClick={() => setStatusFilter("in_review")}
            active={statusFilter === "in_review"}
          />
          <StatCard
            label="In Progress"
            value={stats.in_progress}
            color="text-[#4ecdc4]"
            onClick={() => setStatusFilter("in_progress")}
            active={statusFilter === "in_progress"}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="text-green-300"
            onClick={() => setStatusFilter("completed")}
            active={statusFilter === "completed"}
          />
          <StatCard
            label="Delivered"
            value={stats.delivered}
            color="text-purple-300"
            onClick={() => setStatusFilter("delivered")}
            active={statusFilter === "delivered"}
          />
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email or report type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#0C1919] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#F4EFE6] placeholder-[#F4EFE6]/30 focus:outline-none focus:border-[#BFA14A]/50 transition"
          />
          <div className="flex gap-2 shrink-0">
            {(["all", "report", "scan"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition border ${
                  sourceFilter === s
                    ? "bg-[#BFA14A]/15 text-[#BFA14A] border-[#BFA14A]/40"
                    : "bg-[#0C1919] text-[#F4EFE6]/50 border-white/10 hover:border-white/20 hover:text-[#F4EFE6]/70"
                }`}
              >
                {s === "all" ? "All Types" : s === "report" ? "Report Requests" : "Scan Uploads"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-24 text-[#F4EFE6]/40">Loading requests…</div>
        ) : error ? (
          <div className="text-center py-24 text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-[#F4EFE6]/30">
            {requests.length === 0
              ? "No submissions yet."
              : "No requests match your filters."}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-[#F4EFE6]/40 font-medium">
              <span>Client</span>
              <span>Email</span>
              <span>Report Type</span>
              <span>Source</span>
              <span>Submitted</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-white/8">
              {filtered.map((req) => (
                <button
                  key={`${req.source}-${req.id}`}
                  onClick={() => setSelected(req)}
                  className="w-full text-left px-5 py-4 hover:bg-white/5 transition-colors"
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] gap-4 items-center">
                    <span className="text-sm font-medium text-[#F4EFE6]/90 truncate">
                      {req.name}
                    </span>
                    <span className="text-sm text-[#F4EFE6]/60 truncate">{req.email}</span>
                    <span className="text-sm text-[#F4EFE6]/70 truncate">{req.reportType}</span>
                    <span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                          req.source === "scan"
                            ? "bg-[#0F5C5E]/30 text-[#4ecdc4] border-[#0F5C5E]/40"
                            : "bg-[#BFA14A]/10 text-[#BFA14A] border-[#BFA14A]/20"
                        }`}
                      >
                        {req.source === "scan" ? "Scan" : "Report"}
                      </span>
                    </span>
                    <span className="text-xs text-[#F4EFE6]/40">{formatDate(req.createdAt)}</span>
                    <StatusBadge status={req.status} />
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-[#F4EFE6]/90">{req.name}</div>
                        <div className="text-xs text-[#F4EFE6]/50 mt-0.5">{req.email}</div>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#F4EFE6]/50">
                      <span>{req.reportType}</span>
                      <span>·</span>
                      <span>{req.source === "scan" ? "Scan Upload" : "Report Request"}</span>
                      <span>·</span>
                      <span>{formatDate(req.createdAt)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-xs text-[#F4EFE6]/20 pb-4">
          Showing {filtered.length} of {requests.length} total submissions
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <DetailPanel
          request={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
