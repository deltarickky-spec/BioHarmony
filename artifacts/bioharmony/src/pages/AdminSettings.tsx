import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  Settings, DollarSign, Clock, Globe, Mail, Webhook,
  Lock, AlertTriangle, Send, CheckCircle2, XCircle, Loader2, RefreshCw,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const ADMIN_KEY = "bh_admin_token";
const ADMIN_PASSWORD = "bioharmony2025";

interface SettingRowProps {
  label: string;
  value: string;
  note?: string;
  badge?: string;
}
function SettingRow({ label, value, note, badge }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6 last:border-0">
      <div className="min-w-0">
        <p className="text-sm text-[#F4EFE6]/70">{label}</p>
        {note && <p className="text-[10px] text-[#F4EFE6]/30 mt-0.5">{note}</p>}
      </div>
      <div className="text-right shrink-0 flex items-center gap-2">
        {badge && (
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#BFA14A]/10 text-[#BFA14A]/70">{badge}</span>
        )}
        <span className="text-sm text-[#F4EFE6]/85 font-medium">{value}</span>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0C1919] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/8 bg-white/[0.02]">
        <Icon className="w-3.5 h-3.5 text-[#BFA14A]" />
        <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] font-medium">{title}</h3>
      </div>
      <div className="px-5">{children}</div>
    </section>
  );
}

function WebhookRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  return (
    <div className="py-3 border-b border-white/6 last:border-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0F5C5E]/40 text-[#4ecdc4] font-mono">{method}</span>
        <code className="text-xs text-[#F4EFE6]/70 font-mono">/api{path}</code>
      </div>
      <p className="text-[11px] text-[#F4EFE6]/35">{desc}</p>
    </div>
  );
}

interface EmailStatus {
  keyPresent: boolean;
  fromAddress: string;
  replyTo: string;
  testRecipient: string;
  lastTest: { sentAt: string; success: boolean; mode: "resend" | "mock"; error?: string } | null;
}

interface TestResult {
  success: boolean;
  mode: "resend" | "mock";
  error?: string | null;
  sentAt: string;
}

function EmailStatusBadge({ ok }: { ok: boolean }) {
  return ok
    ? <span className="flex items-center gap-1 text-green-400 text-xs font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Yes</span>
    : <span className="flex items-center gap-1 text-red-400/80 text-xs font-medium"><XCircle className="w-3.5 h-3.5" /> No</span>;
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function AdminSettings() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(ADMIN_KEY));
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [emailStatusLoading, setEmailStatusLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  async function fetchEmailStatus() {
    setEmailStatusLoading(true);
    try {
      const res = await fetch(`${BASE}/api/admin/email-status`, {
        headers: { Authorization: `Bearer ${ADMIN_PASSWORD}` },
      });
      if (res.ok) setEmailStatus(await res.json() as EmailStatus);
    } finally {
      setEmailStatusLoading(false);
    }
  }

  useEffect(() => {
    if (token) fetchEmailStatus();
  }, [token]);

  async function sendTestEmail() {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(`${BASE}/api/admin/email-test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${ADMIN_PASSWORD}` },
      });
      const body = await res.json() as TestResult;
      setTestResult(body);
      await fetchEmailStatus();
    } catch {
      setTestResult({ success: false, mode: "resend", error: "Connection error", sentAt: new Date().toISOString() });
    } finally {
      setTestLoading(false);
    }
  }

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, pw);
      setToken(pw);
    } else {
      setPwError("Incorrect password.");
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#060D0D] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-3">BioHarmony Solutions</p>
            <h1 className="font-serif text-3xl text-[#F4EFE6]">Admin Settings</h1>
          </div>
          <form onSubmit={handleAuth} className="bg-[#0C1919] rounded-2xl border border-white/10 p-8 space-y-4">
            <div>
              <label className="block text-xs text-[#F4EFE6]/50 uppercase tracking-wider mb-2">Password</label>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required
                placeholder="Enter admin password"
                className="w-full bg-white/5 border border-white/12 rounded-xl px-4 py-3 text-[#F4EFE6] placeholder-[#F4EFE6]/25 text-sm focus:outline-none focus:border-[#BFA14A]/50 transition"
              />
              {pwError && <p className="text-xs text-red-400/70 mt-1.5">{pwError}</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-[#BFA14A] text-[#060D0D] rounded-xl font-semibold text-sm hover:bg-[#d4b456] transition">
              Enter Settings
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] pb-24">

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#060D0D]/96 backdrop-blur-md border-b border-white/8">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#BFA14A] text-xs tracking-[0.25em] uppercase">BioHarmony</span>
            <span className="text-white/15">·</span>
            <span className="text-[#F4EFE6]/50 text-xs">Settings</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs text-[#F4EFE6]/35 hover:text-[#F4EFE6]/70 transition">
              ← Dashboard
            </Link>
            <button onClick={() => { sessionStorage.removeItem(ADMIN_KEY); setToken(null); }}
              className="text-xs text-[#F4EFE6]/25 hover:text-red-400/60 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10 space-y-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#F4EFE6] mb-2">Platform Settings</h1>
          <p className="text-[#F4EFE6]/40 text-sm">Configuration reference for the BioHarmony platform.</p>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#BFA14A]/6 border border-[#BFA14A]/20">
          <AlertTriangle className="w-4 h-4 text-[#BFA14A] shrink-0 mt-0.5" />
          <p className="text-sm text-[#BFA14A]/80">Settings are currently read-only. Values reflect the current platform configuration.</p>
        </div>

        {/* Email Delivery System */}
        <section className="rounded-2xl border border-white/10 bg-[#0C1919] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-[#BFA14A]" />
              <h3 className="text-xs uppercase tracking-widest text-[#BFA14A] font-medium">Email Delivery System</h3>
            </div>
            <button
              onClick={fetchEmailStatus}
              disabled={emailStatusLoading}
              className="text-[#F4EFE6]/25 hover:text-[#F4EFE6]/60 transition"
              title="Refresh status"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", emailStatusLoading && "animate-spin")} />
            </button>
          </div>

          <div className="px-5">
            {/* Config rows */}
            <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6">
              <p className="text-sm text-[#F4EFE6]/70">Resend API Key</p>
              {emailStatus
                ? <EmailStatusBadge ok={emailStatus.keyPresent} />
                : <span className="text-xs text-[#F4EFE6]/25">Loading…</span>
              }
            </div>

            <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6">
              <div>
                <p className="text-sm text-[#F4EFE6]/70">Sender Address</p>
                <p className="text-[10px] text-[#F4EFE6]/30 mt-0.5">Verified Resend domain: mail.bioharmonysolutions.ca</p>
              </div>
              <span className="text-xs text-[#F4EFE6]/85 font-medium text-right shrink-0 max-w-[260px] break-all">
                {emailStatus?.fromAddress ?? "—"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6">
              <p className="text-sm text-[#F4EFE6]/70">Reply-To</p>
              <span className="text-sm text-[#F4EFE6]/85 font-medium shrink-0">
                {emailStatus?.replyTo ?? "—"}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6">
              <p className="text-sm text-[#F4EFE6]/70">Test Recipient</p>
              <span className="text-sm text-[#F4EFE6]/85 font-medium shrink-0">
                {emailStatus?.testRecipient ?? "—"}
              </span>
            </div>

            {/* Last test status */}
            {(emailStatus?.lastTest ?? testResult) && (() => {
              const t = testResult ?? emailStatus?.lastTest;
              if (!t) return null;
              return (
                <div className="flex items-start justify-between gap-4 py-3 border-b border-white/6">
                  <div>
                    <p className="text-sm text-[#F4EFE6]/70">Last Test Email</p>
                    <p className="text-[10px] text-[#F4EFE6]/30 mt-0.5">{formatTs(t.sentAt)}</p>
                    {t.error && <p className="text-[10px] text-red-400/70 mt-0.5">{t.error}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {t.success
                      ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /><span className="text-xs text-green-400">Delivered</span></>
                      : t.mode === "mock"
                        ? <><XCircle className="w-3.5 h-3.5 text-[#BFA14A]" /><span className="text-xs text-[#BFA14A]">Mock (no key)</span></>
                        : <><XCircle className="w-3.5 h-3.5 text-red-400/80" /><span className="text-xs text-red-400/80">Failed</span></>
                    }
                  </div>
                </div>
              );
            })()}

            {/* Test button + inline result */}
            <div className="py-4 flex items-center gap-4">
              <button
                onClick={sendTestEmail}
                disabled={testLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[#BFA14A] text-[#060D0D] rounded-xl text-xs font-semibold hover:bg-[#d4b456] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testLoading
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
                  : <><Send className="w-3.5 h-3.5" /> Send Test Email</>
                }
              </button>
              {testResult && !testLoading && (
                <span className={cn(
                  "text-xs flex items-center gap-1",
                  testResult.success ? "text-green-400" : testResult.mode === "mock" ? "text-[#BFA14A]" : "text-red-400/80"
                )}>
                  {testResult.success
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Sent to {emailStatus?.testRecipient}</>
                    : testResult.mode === "mock"
                      ? <><XCircle className="w-3.5 h-3.5" /> Mock only — add RESEND_API_KEY</>
                      : <><XCircle className="w-3.5 h-3.5" /> {testResult.error}</>
                  }
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <Section title="Report Pricing (CAD)" icon={DollarSign}>
          <SettingRow label="Basic Plan" value="$55" note="1 PDF report · Standard turnaround" badge="active" />
          <SettingRow label="Advanced Plan" value="$99" note="PDF + BioHarmony Score · Priority turnaround" badge="active" />
          <SettingRow label="Premium Plan" value="$149" note="PDF + Score + Audio narration · 24-hour turnaround" badge="active" />
        </Section>

        {/* Pipeline Timing */}
        <Section title="Pipeline Timing" icon={Clock}>
          <SettingRow label="Queued → Extracting" value="15 min" note="Time before auto-advancing to data extraction" />
          <SettingRow label="Extracting → Interpreting" value="20 min" note="Bio-frequency data analysis phase" />
          <SettingRow label="Interpreting → Generating" value="25 min" note="Wellness narrative generation phase" />
          <SettingRow label="Generating → Quality Check" value="15 min" note="Review and validation" />
          <SettingRow label="Quality Check → PDF Ready" value="10 min" note="PDF rendering" />
          <SettingRow label="PDF Ready → Audio Ready" value="20 min" note="Premium audio narration (Premium plan only)" />
          <SettingRow label="Audio Ready → Delivered" value="5 min" note="Final delivery email trigger" />
        </Section>

        {/* Languages */}
        <Section title="Supported Languages" icon={Globe}>
          <SettingRow label="English" value="en" badge="default" />
          <SettingRow label="French" value="fr" />
          <SettingRow label="Spanish" value="es" />
          <SettingRow label="Portuguese" value="pt" />
          <SettingRow label="German" value="de" />
          <SettingRow label="Chinese" value="zh" />
          <SettingRow label="Arabic" value="ar" />
          <SettingRow label="Hindi" value="hi" />
        </Section>

        {/* Delivery Options */}
        <Section title="Delivery Options" icon={Mail}>
          <SettingRow label="Admin Notification Email" value="info@bioharmonysolutions.ca" note="Receives new submission alerts" />
          <SettingRow label="Email Delivery" value="Enabled" badge="on" />
          <SettingRow label="WhatsApp Delivery" value="Optional (client opt-in)" />
          <SettingRow label="PDF Format" value="A4 · Dark theme · BioHarmony branding" />
          <SettingRow label="Audio Format" value="MP3 · AI narration · Language-matched" />
        </Section>

        {/* Webhook Endpoints */}
        <Section title="Webhook Endpoints (Sage/Hermes Ready)" icon={Webhook}>
          <WebhookRow method="POST" path="/webhooks/payment-success" desc="Triggered when payment is confirmed. Starts pipeline." />
          <WebhookRow method="POST" path="/webhooks/report-generated" desc="Called by AI processor when report PDF is ready." />
          <WebhookRow method="POST" path="/webhooks/audio-ready" desc="Called when Premium audio narration is generated." />
          <WebhookRow method="POST" path="/webhooks/delivery-complete" desc="Confirms delivery email was sent to client." />
          <WebhookRow method="POST" path="/webhooks/sage-hermes-status" desc="HP Sage/Hermes status update. Payload: { requestId, stage, score?, error? }" />
          <div className="py-3">
            <p className="text-[10px] text-[#F4EFE6]/25 leading-relaxed">
              All endpoints are live and logging. Connect your HP Sage/Hermes AI processor to these URLs to automate the pipeline.
              Base URL: <code className="text-[#BFA14A]/60">https://your-domain.replit.app/api</code>
            </p>
          </div>
        </Section>

        {/* Payment */}
        <Section title="Payment Integration" icon={DollarSign}>
          <SettingRow label="Payment Processor" value="Stripe" badge="configured" />
          <SettingRow label="Currency" value="CAD" />
          <SettingRow label="Stripe Webhook" value="/api/stripe/webhook" />
          <SettingRow label="Manual Override" value="Admin can waive or mark paid" />
        </Section>

      </div>
    </div>
  );
}
