import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Star, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const PROMPTS = [
  "How accurate did the report feel to your current wellness state?",
  "How clearly was the information presented?",
  "How likely are you to return for a future scan?",
];

const REFERRAL_OPTIONS = [
  "Google Search", "Instagram", "Facebook", "Friend / Family",
  "Practitioner Referral", "Podcast", "Online Community", "Other",
];

export default function Feedback() {
  const [, search] = useLocation();
  const requestId = new URLSearchParams(search).get("id") ?? "";

  const [ratings, setRatings] = useState<number[]>([0, 0, 0]);
  const [hover, setHover] = useState<number[]>([-1, -1, -1]);
  const [testimonial, setTestimonial] = useState("");
  const [referral, setReferral] = useState("");
  const [name, setName] = useState("");
  const [consentShare, setConsentShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const overallRating = ratings[0];
  const allRated = ratings.every((r) => r > 0);

  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allRated) return;
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch(`${BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId || undefined,
          accuracyRating: ratings[0],
          clarityRating: ratings[1],
          returnLikelihood: ratings[2],
          testimonial: testimonial.trim() || undefined,
          referralSource: referral || undefined,
          clientName: name.trim() || undefined,
          consentShare,
        }),
      });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setSubmitError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#060D0D] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-green-900/20 border border-green-700/25 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="font-serif text-3xl text-[#F4EFE6] mb-3">Thank you</h2>
          <p className="text-[#F4EFE6]/50 text-sm leading-relaxed mb-8">
            Your feedback helps Kathy refine the BioHarmony experience for everyone.
            {consentShare && " Your testimonial may be featured on our website."}
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#BFA14A] text-[#060D0D] rounded-xl font-semibold text-sm hover:bg-[#d4b456] transition"
          >
            Return Home <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] py-16 px-4">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-3">BioHarmony Analytics</p>
          <h1 className="font-serif text-4xl text-[#F4EFE6] mb-3">Share Your Experience</h1>
          {requestId && <p className="text-[#F4EFE6]/30 text-sm">{requestId}</p>}
          <p className="text-[#F4EFE6]/45 text-sm mt-2 max-w-sm mx-auto">
            Your honest feedback helps Kathy deliver the best possible wellness insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Star ratings */}
          <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-6 space-y-6">
            {PROMPTS.map((prompt, qi) => (
              <div key={qi}>
                <p className="text-sm text-[#F4EFE6]/75 mb-3">{prompt}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatings((r) => { const n = [...r]; n[qi] = star; return n; })}
                      onMouseEnter={() => setHover((h) => { const n = [...h]; n[qi] = star; return n; })}
                      onMouseLeave={() => setHover((h) => { const n = [...h]; n[qi] = -1; return n; })}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "w-6 h-6 transition-colors",
                          star <= (hover[qi] !== -1 ? hover[qi] : ratings[qi])
                            ? "fill-[#BFA14A] text-[#BFA14A]"
                            : "text-white/15"
                        )}
                      />
                    </button>
                  ))}
                  {ratings[qi] > 0 && (
                    <span className="ml-2 text-xs text-[#F4EFE6]/35">
                      {["", "Poor", "Fair", "Good", "Great", "Excellent"][ratings[qi]]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-6">
            <label className="block text-xs uppercase tracking-wider text-[#F4EFE6]/50 mb-3">
              Your Experience <span className="text-[#F4EFE6]/25 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="What did you find most helpful? How did the report compare to your expectations?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4EFE6] placeholder-[#F4EFE6]/20 resize-none focus:outline-none focus:border-[#BFA14A]/40 transition leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={consentShare} onChange={(e) => setConsentShare(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#BFA14A]"
                />
                <span className="text-xs text-[#F4EFE6]/40">I'm happy for Kathy to share this as a testimonial</span>
              </label>
              <span className="text-[10px] text-[#F4EFE6]/20">{testimonial.length}/500</span>
            </div>
          </div>

          {/* Referral */}
          <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-6">
            <label className="block text-xs uppercase tracking-wider text-[#F4EFE6]/50 mb-3">
              How did you hear about BioHarmony? <span className="text-[#F4EFE6]/25 normal-case tracking-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {REFERRAL_OPTIONS.map((opt) => (
                <button
                  key={opt} type="button"
                  onClick={() => setReferral(referral === opt ? "" : opt)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs border transition",
                    referral === opt
                      ? "bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
                      : "bg-transparent text-[#F4EFE6]/45 border-white/10 hover:border-white/22 hover:text-[#F4EFE6]/70"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="bg-[#0C1919] rounded-2xl border border-white/10 p-6">
            <label className="block text-xs uppercase tracking-wider text-[#F4EFE6]/50 mb-3">
              Your Name <span className="text-[#F4EFE6]/25 normal-case tracking-normal">(for testimonial, optional)</span>
            </label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. Sarah K. from Vancouver"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4EFE6] placeholder-[#F4EFE6]/20 focus:outline-none focus:border-[#BFA14A]/40 transition"
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-400/80 text-center -mb-2">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={!allRated || loading}
            className="w-full py-3.5 bg-[#BFA14A] text-[#060D0D] rounded-xl font-semibold text-sm hover:bg-[#d4b456] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              : !allRated
                ? "Please rate all three questions"
                : "Submit Feedback ✦"
            }
          </button>

          <p className="text-center text-[10px] text-[#F4EFE6]/20 leading-relaxed">
            Feedback is sent directly to Kathy. Personal information is never shared without consent.
          </p>
        </form>
      </div>
    </div>
  );
}
