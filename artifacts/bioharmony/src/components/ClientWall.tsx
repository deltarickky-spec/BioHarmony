import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const TESTIMONIALS = [
  {
    quote: "The AO Scan revealed things I never knew about my body. The report was so clear and easy to understand — I finally feel like I know what's going on.",
    name: "Maria G.",
    tag: "Wellness Client",
  },
  {
    quote: "After months of fatigue and no answers, BioHarmony helped me connect the dots. The frequency insights were spot-on and gave me a real path forward.",
    name: "Daniel K.",
    tag: "AO Scan Client",
  },
  {
    quote: "I was skeptical at first, but the depth of the analysis surprised me. My practitioner said she'd never seen such clear client reports.",
    name: "Priya S.",
    tag: "Wellness Client",
  },
  {
    quote: "Kathy took the time to walk me through every part of my scan. I left feeling empowered, not confused. That made all the difference.",
    name: "James R.",
    tag: "PEMF Client",
  },
  {
    quote: "The comprehensive scan picked up on things I'd been feeling for years but couldn't explain. Now I have a plan that actually makes sense.",
    name: "Aisha T.",
    tag: "Frequency Wellness",
  },
  {
    quote: "I've done bioresonance before, but BioHarmony's reports are in a different league. Finally, a report I could actually read and understand.",
    name: "Liam O.",
    tag: "Practitioner",
  },
  {
    quote: "My emotional wellness scan was incredibly validating. It reflected exactly what I was going through and gave me practical steps for balance.",
    name: "Chloe M.",
    tag: "Inner Voice Scan",
  },
  {
    quote: "The 30-day wellness plan that came with my comprehensive scan changed how I approach my health. I've recommended it to everyone I know.",
    name: "Marcus W.",
    tag: "Wellness Client",
  },
];

export default function ClientWall() {
  return (
    <section className="relative bg-[#040A0A] py-24 overflow-hidden border-t border-white/6">
      {/* Gradient fade overlays on both sides */}
      <div className="absolute top-0 left-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-[#040A0A] to-transparent" />
      <div className="absolute top-0 right-0 bottom-0 w-24 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#040A0A] to-transparent" />

      {/* Heading */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="container px-4 md:px-6 mb-12 text-center relative z-10"
      >
        <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans mb-3">
          Client Wall of Gratitude
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">
          What Our Community Is Saying
        </h2>
        <p className="text-[#F4EFE6]/50 text-sm mt-2 max-w-xl mx-auto">
          Real words from real people who trusted their bodies and took the first step.
        </p>
      </motion.div>

      {/* Marquee track */}
      <div className="relative z-0">
        {/* First marquee row — scrolls left */}
        <div className="group/marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex shrink-0 gap-5 py-4 animate-marquee group-hover/marquee:[animation-play-state:paused">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="w-[320px] shrink-0 rounded-2xl border border-white/8 bg-white/[0.04] backdrop-blur-xl p-6 flex flex-col hover:border-[#BFA14A]/25 hover:bg-white/[0.07] transition-all duration-300"
              >
                {/* Decorative quote mark */}
                <span className="text-[#BFA14A]/20 text-3xl font-serif leading-none mb-2">
                  &ldquo;
                </span>
                <p className="text-[#F4EFE6]/75 text-sm leading-relaxed italic flex-grow mb-5">
                  {t.quote}
                </p>
                <div className="border-t border-white/8 pt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F4EFE6]/60">
                    &mdash; {t.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#BFA14A]/40 font-sans">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center text-[10px] text-[#F4EFE6]/20 font-sans tracking-wider mt-10 relative z-10"
      >
        Client experiences are individual and may vary. Shared with permission.
      </motion.p>
    </section>
  );
}
