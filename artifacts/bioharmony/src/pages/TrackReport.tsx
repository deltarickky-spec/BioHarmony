import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle2, Circle, Loader2, ArrowRight, FileText } from "lucide-react";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const TRACK_STATUSES = [
  {
    key: "received",
    label: "Request Received",
    desc: "Your request has been logged in our system.",
  },
  {
    key: "in_review",
    label: "In Review",
    desc: "Kathy is personally reviewing your request.",
  },
  {
    key: "preparing",
    label: "Report Being Prepared",
    desc: "Your personalized report is being carefully prepared.",
  },
  {
    key: "quality",
    label: "Quality Check",
    desc: "Final review to ensure accuracy and completeness.",
  },
  {
    key: "ready",
    label: "Ready for Delivery",
    desc: "Your report is complete and ready to send.",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Your report has been sent to your chosen delivery method.",
  },
];

const STATUS_INDEX_BY_LAST_DIGIT: Record<number, number> = {
  0: 0,
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 5,
};

const REPORT_TYPES = ["Inner Voice", "Vitals", "Comprehensive", "Body Systems"];
const DELIVERY_METHODS = ["Email", "Email", "WhatsApp", "Email", "WhatsApp"];

function formatRequestId(raw: string): string | null {
  const cleaned = raw.trim().toUpperCase().replace(/\s/g, "");
  const withPrefix = cleaned.startsWith("BH-")
    ? cleaned
    : cleaned.startsWith("BH")
      ? `BH-${cleaned.slice(2)}`
      : `BH-${cleaned}`;
  const match = withPrefix.match(/^BH-(\d{1,8})$/);
  if (!match) return null;
  return `BH-${parseInt(match[1], 10).toString().padStart(4, "0")}`;
}

function getAdminNote(statusIdx: number, reportType: string): string | null {
  const notes: Record<number, string> = {
    2: `We've begun preparing your ${reportType} report. This is one of our more detailed analyses — we want every insight to be meaningful for you.`,
    3: `Your ${reportType} report has passed our initial quality review. Final polish is underway.`,
    4: `Your ${reportType} report is complete. Please ensure your inbox is ready for delivery.`,
    5: `Your ${reportType} report was sent. Please check your inbox (and your spam folder, just in case). Reply to our email if you have any questions — Kathy personally responds to every message.`,
  };
  return notes[statusIdx] ?? null;
}

interface MockResult {
  name: string;
  requestId: string;
  reportType: string;
  deliveryMethod: string;
  submittedDate: string;
  statusIdx: number;
  estimatedDelivery: string;
  adminNote: string | null;
}

function buildMockResult(requestId: string, email: string): MockResult | null {
  const formatted = formatRequestId(requestId);
  if (!formatted) return null;

  const numId = parseInt(formatted.replace("BH-", ""), 10);
  const lastDigit = numId % 10;
  const statusIdx = STATUS_INDEX_BY_LAST_DIGIT[lastDigit] ?? 0;

  const reportType = REPORT_TYPES[numId % REPORT_TYPES.length];
  const deliveryMethod = DELIVERY_METHODS[numId % DELIVERY_METHODS.length];

  const daysAgo = (numId % 12) + 1;
  const submittedDate = new Date();
  submittedDate.setDate(submittedDate.getDate() - daysAgo);

  const remaining = 5 - statusIdx;
  let estimatedDelivery: string;
  if (statusIdx >= 5) {
    estimatedDelivery = "Delivered";
  } else if (statusIdx >= 4) {
    estimatedDelivery = "Within 24 hours";
  } else if (remaining <= 1) {
    estimatedDelivery = "1–2 business days";
  } else {
    estimatedDelivery = `${remaining}–${remaining + 1} business days`;
  }

  const emailPrefix = email
    .split("@")[0]
    .replace(/[._\-+]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  return {
    name: emailPrefix || "Client",
    requestId: formatted,
    reportType,
    deliveryMethod,
    submittedDate: submittedDate.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    statusIdx,
    estimatedDelivery,
    adminNote: getAdminNote(statusIdx, reportType),
  };
}

function StatusStepper({ statusIdx }: { statusIdx: number }) {
  return (
    <div className="space-y-0">
      {TRACK_STATUSES.map((step, i) => {
        const isDone = i < statusIdx;
        const isCurrent = i === statusIdx;
        const isPending = i > statusIdx;

        return (
          <div key={step.key} className="flex gap-4">
            {/* Line + icon column */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isDone
                    ? "bg-[#BFA14A]/20 border border-[#BFA14A]/50"
                    : isCurrent
                      ? "bg-[#0F5C5E]/30 border-2 border-[#4ecdc4]/70"
                      : "bg-white/5 border border-white/15"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#BFA14A]" />
                ) : isCurrent ? (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ecdc4] opacity-60" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4ecdc4]" />
                  </span>
                ) : (
                  <Circle className="w-4 h-4 text-white/20" />
                )}
              </div>
              {i < TRACK_STATUSES.length - 1 && (
                <div
                  className={`w-px flex-1 my-1 min-h-[24px] ${
                    isDone ? "bg-[#BFA14A]/30" : "bg-white/8"
                  }`}
                />
              )}
            </div>

            {/* Text column */}
            <div className={`pb-6 pt-1 ${i === TRACK_STATUSES.length - 1 ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-semibold leading-tight ${
                  isDone
                    ? "text-[#BFA14A]"
                    : isCurrent
                      ? "text-[#F4EFE6]"
                      : "text-[#F4EFE6]/30"
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 text-xs font-normal text-[#4ecdc4]/80 tracking-wide">
                    ← Current
                  </span>
                )}
              </p>
              {(isDone || isCurrent) && (
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    isDone ? "text-[#F4EFE6]/35" : "text-[#F4EFE6]/55"
                  }`}
                >
                  {step.desc}
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
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-white/8 last:border-0">
      <span className="text-xs text-[#F4EFE6]/40 uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className="text-sm text-[#F4EFE6]/85 text-right">{value}</span>
    </div>
  );
}

function ResultCard({ result }: { result: MockResult }) {
  const currentStatus = TRACK_STATUSES[result.statusIdx];
  const isDelivered = result.statusIdx >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      {/* Header card */}
      <div className="bg-[#0C1919] border border-white/10 rounded-2xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#BFA14A]/50 to-transparent" />
        <div className="p-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] mb-1">Report Status</p>
            <h2 className="text-xl font-serif text-[#F4EFE6]">{result.name}</h2>
            <p className="text-sm text-[#F4EFE6]/45 mt-1">
              Request ID:{" "}
              <span className="text-[#F4EFE6]/70 font-mono tracking-wide">{result.requestId}</span>
            </p>
          </div>
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 ${
              isDelivered
                ? "bg-green-900/30 text-green-300 border-green-700/30"
                : result.statusIdx >= 4
                  ? "bg-purple-900/30 text-purple-300 border-purple-700/30"
                  : "bg-[#0F5C5E]/30 text-[#4ecdc4] border-[#0F5C5E]/40"
            }`}
          >
            {currentStatus.label}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">
        {/* Progress stepper */}
        <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#BFA14A] mb-5 font-medium">
            Progress
          </p>
          <StatusStepper statusIdx={result.statusIdx} />
        </div>

        {/* Details panel */}
        <div className="space-y-5">
          <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#BFA14A] mb-3 font-medium">
              Details
            </p>
            <DetailRow label="Report Type" value={result.reportType} />
            <DetailRow label="Submitted" value={result.submittedDate} />
            <DetailRow label="Est. Delivery" value={result.estimatedDelivery} />
            <DetailRow label="Delivery Method" value={result.deliveryMethod} />
          </div>

          {result.adminNote && (
            <div className="bg-[#0C1919] border border-[#BFA14A]/20 rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#BFA14A] mb-3 font-medium">
                Note from BioHarmony
              </p>
              <p className="text-sm text-[#F4EFE6]/65 leading-relaxed italic">
                "{result.adminNote}"
              </p>
              <p className="text-xs text-[#F4EFE6]/30 mt-2">— Kathy Owens</p>
            </div>
          )}

          <div className="bg-[#0C1919] border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-xs text-[#F4EFE6]/40 mb-2">Questions about your report?</p>
            <a
              href="mailto:info@bioharmonysolutions.ca"
              className="text-sm text-[#4ecdc4] hover:text-[#4ecdc4]/80 transition-colors"
            >
              info@bioharmonysolutions.ca
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrackReport() {
  const [email, setEmail] = useState("");
  const [requestId, setRequestId] = useState("");
  const [result, setResult] = useState<MockResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const mock = buildMockResult(requestId, email);
      if (!mock) {
        setError(
          'Request ID not found. Please check your ID format (e.g. BH-0042) and ensure the email matches your submission.'
        );
        setResult(null);
      } else {
        setResult(mock);
      }
      setLoading(false);
    }, 800);
  }

  const inputCls =
    "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-[#F4EFE6] text-sm placeholder:text-[#F4EFE6]/30 focus:outline-none focus:border-[#BFA14A]/50 transition-all duration-200";

  return (
    <div className="min-h-screen bg-[#060D0D]">
      {/* Hero */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.3em] mb-4">
              BioHarmony Solutions
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6] mb-4 leading-tight">
              Track Your Report
            </h1>
            <p className="text-[#F4EFE6]/55 text-lg leading-relaxed">
              Enter the email address used during submission and your Request ID to check the status
              of your BioHarmony report.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-14">
        <div className="max-w-lg mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-[#0C1919] border border-white/10 rounded-2xl p-8 space-y-5"
            >
              <div className="h-[2px] -mt-8 -mx-8 mb-8 rounded-t-2xl bg-gradient-to-r from-transparent via-[#BFA14A]/40 to-transparent" />

              <div>
                <label className="block text-xs text-[#F4EFE6]/50 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="The email used when you submitted"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs text-[#F4EFE6]/50 uppercase tracking-wider mb-2">
                  Request ID
                </label>
                <input
                  type="text"
                  required
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  placeholder="e.g. BH-0042"
                  className={`${inputCls} font-mono tracking-wide`}
                />
                <p className="text-xs text-[#F4EFE6]/25 mt-1.5 ml-1">
                  Found in your submission confirmation email or on the confirmation screen.
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-400/80 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/20 text-[#F4EFE6] text-sm font-medium shadow-[0_0_20px_rgba(191,161,74,0.2)] hover:shadow-[0_0_32px_rgba(191,161,74,0.35)] disabled:opacity-60 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Looking up your request…
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Check Report Status
                  </>
                )}
              </button>
            </form>

            {/* Help text */}
            <p className="text-center text-xs text-[#F4EFE6]/25 mt-5">
              Don't have a Request ID?{" "}
              <Link
                href="/upload-scan"
                className="text-[#BFA14A]/60 hover:text-[#BFA14A] transition-colors underline underline-offset-2"
              >
                Submit a new scan
              </Link>{" "}
              or email us at{" "}
              <a
                href="mailto:info@bioharmonysolutions.ca"
                className="text-[#BFA14A]/60 hover:text-[#BFA14A] transition-colors"
              >
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
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#F4EFE6]/30">
                  Your Report
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <ResultCard result={result} />
            </div>
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}
