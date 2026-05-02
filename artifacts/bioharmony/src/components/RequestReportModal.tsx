import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, Sparkles } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Props {
  open: boolean;
  onClose: () => void;
  reportType: string;
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const panel = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.2 } },
};

export function RequestReportModal({ open, onClose, reportType }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function resetAndClose() {
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setFirstName("");
      setEmail("");
      setNote("");
      setErrorMsg("");
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`${BASE}/api/report-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, reportType, note: note || undefined }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const inputCls =
    "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-[#F4EFE6] text-sm placeholder:text-[#F4EFE6]/30 focus:outline-none focus:border-[#BFA14A]/50 focus:bg-white/[0.07] transition-all duration-200";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(6,13,13,0.82)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && resetAndClose()}
        >
          <motion.div
            key="panel"
            variants={panel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-[#0C1919] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Gold top line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#BFA14A]/60 to-transparent" />

            {/* Close */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#F4EFE6]/40 hover:text-[#F4EFE6]/80 hover:bg-white/[0.06] transition-all duration-150"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-8 pt-8 pb-9">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-6 gap-5"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#0F5C5E]/30 border border-[#0F5C5E]/40 flex items-center justify-center">
                      <CheckCircle className="w-7 h-7 text-[#0F5C5E]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] mb-2">Request Received</p>
                      <h3 className="text-xl font-serif text-[#F4EFE6] mb-3">
                        Thank you, {firstName}
                      </h3>
                      <p className="text-[#F4EFE6]/55 text-sm leading-relaxed">
                        Kathy will personally review your interest and be in touch at <span className="text-[#F4EFE6]/80">{email}</span> within 1–2 business days.
                      </p>
                    </div>
                    <button
                      onClick={resetAndClose}
                      className="mt-2 text-sm text-[#F4EFE6]/40 hover:text-[#F4EFE6]/70 transition-colors duration-150"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Heading */}
                    <div className="mb-7">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-[#BFA14A]/70" />
                        <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em]">
                          {reportType}
                        </p>
                      </div>
                      <h3 className="text-2xl font-serif text-[#F4EFE6] leading-snug">
                        Get your own personalized report
                      </h3>
                      <p className="text-[#F4EFE6]/45 text-sm mt-2 leading-relaxed">
                        Share your details and Kathy will reach out to guide you through your scan results personally.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-[#F4EFE6]/50 text-xs mb-1.5 ml-1">First Name</label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Your first name"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-[#F4EFE6]/50 text-xs mb-1.5 ml-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-[#F4EFE6]/50 text-xs mb-1.5 ml-1">
                            What brought you here? <span className="text-[#F4EFE6]/25">(optional)</span>
                          </label>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Tell Kathy a little about what you're looking to understand…"
                            rows={3}
                            className={`${inputCls} resize-none`}
                          />
                        </div>
                      </div>

                      {status === "error" && (
                        <p className="text-red-400/80 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                          {errorMsg}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full mt-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#0F5C5E] border border-[#BFA14A]/25 text-[#F4EFE6] text-sm font-medium shadow-[0_0_20px_rgba(191,161,74,0.22)] hover:shadow-[0_0_32px_rgba(191,161,74,0.4)] disabled:opacity-60 transition-all duration-200"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          "Send My Request"
                        )}
                      </button>

                      <p className="text-[#F4EFE6]/25 text-[11px] text-center leading-relaxed">
                        No spam, ever. Kathy reads every submission personally.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
