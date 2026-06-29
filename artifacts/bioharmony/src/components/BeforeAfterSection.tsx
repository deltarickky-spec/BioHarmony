import { useState } from "react";

export function BeforeAfterSection() {
  const [active, setActive] = useState<"before" | "after">("before");

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#BFA14A]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="section-label text-[10px] tracking-[0.3em] uppercase text-[#BFA14A]/60 font-sans block mb-3">
            From Data to Clarity
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-[#F4EFE6] mb-4">
            Raw Scan Data <span className="text-[#BFA14A]">→</span> Clear Human Insight
          </h2>
          <p className="text-[#F4EFE6]/60 max-w-xl mx-auto text-sm leading-relaxed">
            What you upload is complex frequency data. What you receive is a meaningful story about your body — with context, priorities, and a path forward.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-[#0C1919] border border-white/10 rounded-full p-1">
            <button
              onClick={() => setActive("before")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === "before"
                  ? "bg-[#BFA14A] text-[#060D0D] shadow-lg shadow-[#BFA14A]/20"
                  : "text-[#F4EFE6]/50 hover:text-[#F4EFE6]/80"
              }`}
            >
              Raw Data You Upload
            </button>
            <button
              onClick={() => setActive("after")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === "after"
                  ? "bg-[#BFA14A] text-[#060D0D] shadow-lg shadow-[#BFA14A]/20"
                  : "text-[#F4EFE6]/50 hover:text-[#F4EFE6]/80"
              }`}
            >
              What You Receive
            </button>
          </div>
        </div>

        {/* Before/After display */}
        <div className="max-w-4xl mx-auto">
          {active === "before" ? (
            /* BEFORE: Raw Solex Data */
            <div className="rounded-2xl border border-white/10 bg-[#0C1919] overflow-hidden">
              <div className="p-4 md:p-6 border-b border-white/8 bg-[#040A0A]">
                <p className="text-xs text-[#F4EFE6]/30 uppercase tracking-wider font-mono">
                  Solex AO Scan — Raw Export
                </p>
              </div>
              <div className="flex justify-center p-4 md:p-8 bg-gradient-to-b from-[#0C1919] to-[#060D0D]">
                <img
                  src="/assets/solex-raw-before.jpg"
                  alt="Raw Solex AO Scan data"
                  className="max-w-full h-auto rounded-lg shadow-2xl border border-white/5"
                />
              </div>
              <div className="p-4 md:p-6 bg-[#040A0A] border-t border-white/8">
                <div className="flex items-start gap-3">
                  <span className="text-red-400/80 text-lg mt-0.5 shrink-0">⚠</span>
                  <div>
                    <p className="text-sm text-[#F4EFE6]/70 font-medium mb-1">
                      50+ numbers, no context, no priorities
                    </p>
                    <p className="text-xs text-[#F4EFE6]/40 leading-relaxed">
                      Raw scan exports show every frequency reading — but without interpretation, they're overwhelming. Where do you start? What matters most?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* AFTER: Connecting the Dots — Gold Standard Report */
            <div className="rounded-2xl border border-[#BFA14A]/20 bg-gradient-to-b from-[#0C1919] via-[#0F1A1A] to-[#0C1919] overflow-hidden shadow-2xl shadow-[#BFA14A]/5">
              {/* Report header */}
              <div className="p-6 md:p-8 border-b border-[#BFA14A]/10 bg-gradient-to-r from-[#0C1919] via-[#0F1A1A] to-[#0C1919]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-serif text-lg text-[#BFA14A] tracking-wide">
                      BioHarmony Solutions
                    </p>
                    <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-[0.2em] mt-0.5">
                      AO Scan Comprehensive Report
                    </p>
                  </div>
                  <span className="text-[10px] text-[#BFA14A]/40 border border-[#BFA14A]/20 rounded-full px-3 py-1">
                    Confidential
                  </span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#BFA14A]/20 to-transparent" />
              </div>

              {/* Report body — Connecting the Dots */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Opening narrative */}
                <div className="relative pl-6 border-l-2 border-[#BFA14A]/40">
                  <span className="text-4xl text-[#BFA14A]/20 font-serif absolute -top-2 -left-1 leading-none">
                    "
                  </span>
                  <p className="font-serif text-sm md:text-base text-[#F4EFE6]/90 leading-relaxed italic">
                    Your body is whispering a story — written in frequencies that most practitioners overlook. After deep analysis of your scan data and voice harmonics, a clear root-cause cluster has emerged.
                  </p>
                </div>

                {/* Key Finding Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#040A0A]/80 border border-red-900/20 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-red-400/70 font-mono">
                        Acute Stress
                      </span>
                      <span className="text-red-400 font-mono text-lg font-bold">9</span>
                    </div>
                    <h4 className="text-sm font-serif text-[#F4EFE6] mb-2">Large Intestine</h4>
                    <p className="text-xs text-[#F4EFE6]/60 leading-relaxed">
                      Registers at a 9 — indicating acute energetic stress. Consistent with inflammation, microbiome disruption, and impaired detoxification throughput.
                    </p>
                  </div>
                  <div className="bg-[#040A0A]/80 border border-blue-900/20 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase tracking-wider text-blue-400/70 font-mono">
                        Sluggish / Underactive
                      </span>
                      <span className="text-blue-400 font-mono text-lg font-bold">2</span>
                    </div>
                    <h4 className="text-sm font-serif text-[#F4EFE6] mb-2">Intestinal Villi</h4>
                    <p className="text-xs text-[#F4EFE6]/60 leading-relaxed">
                      Deeply suppressed at a 2. When absorption is compromised, even optimal nutrition cannot be properly utilized — explaining secondary fatigue patterns.
                    </p>
                  </div>
                </div>

                {/* Connecting the Dots — Synthesis */}
                <div className="bg-gradient-to-r from-[#BFA14A]/5 to-transparent border border-[#BFA14A]/10 rounded-xl p-5">
                  <h4 className="text-xs uppercase tracking-widest text-[#BFA14A]/70 mb-3 font-sans">
                    🧩 Connecting the Dots
                  </h4>
                  <p className="text-sm text-[#F4EFE6]/80 leading-relaxed">
                    The combined Large Intestine (9) + Villi (2) pattern reveals a classic <strong className="text-[#BFA14A]">"push-pull" dysfunction</strong>: your system is simultaneously <em>over-stressed</em> and <em>under-resourced</em>. This is the primary root-cause cluster driving downstream imbalances in the Digestive, Vascular, and Kidney systems.
                  </p>
                </div>

                {/* Score Summary */}
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 font-sans">
                    System Scores
                  </p>
                  {[
                    { label: "Digestive", score: 3, max: 10, color: "bg-red-500/80" },
                    { label: "Vascular", score: 4, max: 10, color: "bg-amber-500/80" },
                    { label: "Kidney", score: 6, max: 10, color: "bg-emerald-500/80" },
                  ].map((sys) => (
                    <div key={sys.label} className="flex items-center gap-3">
                      <span className="text-xs text-[#F4EFE6]/60 w-20 shrink-0">{sys.label}</span>
                      <div className="flex-1 h-2 bg-[#040A0A] rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${sys.color}`}
                          style={{ width: `${(sys.score / sys.max) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#BFA14A]/60 font-mono w-10 text-right">
                        {sys.score}/{sys.max}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report footer */}
              <div className="p-4 md:p-6 border-t border-[#BFA14A]/10 bg-[#040A0A] text-center">
                <p className="text-[10px] text-[#F4EFE6]/25 italic">
                  Prepared by Sage AI · BioHarmony Solutions · Educational insight, not diagnostic
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-sm text-[#F4EFE6]/50 mb-6">
            {active === "before"
              ? "This is what you upload. Now see what you get back."
              : "Every report connects your unique frequency data into a clear, actionable story."}
          </p>
          <button
            onClick={() => setActive(active === "before" ? "after" : "before")}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#BFA14A] text-[#060D0D] rounded-full text-sm font-semibold hover:bg-[#BFA14A]/90 transition-all duration-300 shadow-lg shadow-[#BFA14A]/20"
          >
            {active === "before" ? "See What You Receive ✦" : "See the Raw Data ↺"}
          </button>
        </div>
      </div>
    </section>
  );
}
