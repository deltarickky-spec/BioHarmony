import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bodyAnatomyImg from "@/assets/human-body-full-front.png";

interface BodyZone {
  id: string;
  label: string;
  description: string;
  path: string;
  accent: string;
  glowColor: string;
}

const BODY_ZONES: BodyZone[] = [
  {
    id: "brain",
    label: "Nervous System & Brain",
    description:
      "Your nervous system is the master orchestrator of your entire body. AO Scan frequency analysis evaluates autonomic balance — measuring how well your parasympathetic (rest & digest) and sympathetic (fight or flight) branches work together. A well-coordinated nervous system is the foundation of resilience, sleep quality, and mental clarity.",
    path: "M300,28 C285,12 270,18 268,32 C266,42 272,52 280,58 C275,64 268,72 268,82 C268,92 278,98 290,96 L310,96 C322,98 332,92 332,82 C332,72 325,64 320,58 C328,52 334,42 332,32 C330,18 315,12 300,28 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.3)",
  },
  {
    id: "throat",
    label: "Thyroid & Communication",
    description:
      "Your voice carries the energetic signature of your entire system. The throat and thyroid region is where your body's metabolic rhythm meets its expressive voice. AO Scan analyzes vocal frequency patterns to detect metabolic stress, energetic blockages, and how well your body is communicating its needs across different systems.",
    path: "M288,98 L312,98 L318,112 C320,118 316,124 308,126 L292,126 C284,124 280,118 282,112 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.25)",
  },
  {
    id: "heart",
    label: "Cardiovascular & Heart Coherence",
    description:
      "Your heart generates the strongest electromagnetic field in your body — measurable from several feet away. AO Scan evaluates heart rate variability and energetic coherence, revealing how well your cardiovascular system is adapting to stress, supporting recovery, and maintaining the rhythm that sustains every cell in your body.",
    path: "M300,142 C285,128 268,136 272,152 C276,166 290,178 300,182 C310,178 324,166 328,152 C332,136 315,128 300,142 Z",
    accent: "#BFA14A",
    glowColor: "rgba(191,161,74,0.35)",
  },
  {
    id: "lungs",
    label: "Respiratory System",
    description:
      "Every breath carries life-giving energy through your body. AO Scan assesses frequency patterns in the respiratory field, revealing how efficiently your body exchanges oxygen, processes environmental stressors, and maintains the gentle rhythmic balance that supports cellular health throughout your entire system.",
    path: "M254,142 C240,134 232,152 238,168 C244,182 262,200 282,200 L286,188 C270,182 256,168 254,142 Z M346,142 C360,134 368,152 362,168 C356,182 338,200 318,200 L314,188 C330,182 344,168 346,142 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.2)",
  },
  {
    id: "stomach",
    label: "Digestive System & Gut Health",
    description:
      "Your gut is often called your 'second brain' — and for good reason. AO Scan reveals energetic patterns across your entire digestive system, from stomach to colon. Digestive imbalances often show up first in your frequency signature, before physical symptoms appear, making this one of the most valuable early-warning systems in the scan.",
    path: "M272,200 L328,200 L334,232 C336,248 326,254 310,254 L290,254 C274,254 264,248 266,232 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.25)",
  },
  {
    id: "liver",
    label: "Liver & Detoxification Pathways",
    description:
      "Your liver works quietly around the clock, processing everything you're exposed to. AO Scan detects energetic congestion in your detoxification pathways — often visible in frequency patterns long before you feel sluggish or out of balance. Supporting your liver energetically is one of the most effective ways to restore overall vitality.",
    path: "M334,198 L358,206 C364,212 364,224 358,230 L340,236 L334,222 L330,210 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.2)",
  },
  {
    id: "spine",
    label: "Spine & Structural Foundation",
    description:
      "Your spine is the central communication highway of your nervous system. Every nerve impulse travels through it. AO Scan evaluates frequency coherence along the spinal column, identifying areas of energetic stress that may correspond to physical tension patterns, postural habits, or imbalances in the structural foundation of your body.",
    path: "M296,92 L304,92 L306,180 L300,186 L294,180 Z",
    accent: "#BFA14A",
    glowColor: "rgba(191,161,74,0.2)",
  },
  {
    id: "pelvis",
    label: "Reproductive & Pelvic Floor",
    description:
      "Your pelvic region is the energetic and structural foundation of your body. AO Scan frequency analysis provides insights into hormonal balance, reproductive vitality, and the stability of your core. Frequency patterns here often reflect deep foundational rhythms that influence energy levels, mood, and overall sense of wellbeing.",
    path: "M268,264 L332,264 L338,292 C340,304 328,310 300,310 C272,310 260,304 262,292 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.25)",
  },
  {
    id: "immune",
    label: "Immune & Lymphatic System",
    description:
      "Your immune system operates at specific resonant frequencies. When these frequencies are coherent, your body's natural defenses function optimally. AO Scan can detect when immune frequencies are depleted or overactive — long before you feel unwell — helping you take gentle, targeted steps to restore your body's natural protective balance.",
    path: "M244,136 L254,140 L250,166 L240,162 Z M356,136 L346,140 L350,166 L360,162 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.2)",
  },
  {
    id: "legs",
    label: "Musculoskeletal & Mobility",
    description:
      "Your legs carry you through life — literally. AO Scan assesses frequency patterns in muscles, joints, and connective tissue throughout your lower body. Energetic imbalances here often precede physical discomfort, and addressing them early through targeted frequency work can help maintain the mobility and vitality that keeps you moving freely.",
    path: "M284,310 L296,310 L294,390 L290,408 L286,390 Z M304,310 L316,310 L314,390 L310,408 L306,390 Z",
    accent: "#1B4D4D",
    glowColor: "rgba(27,77,77,0.2)",
  },
];

// Particle effects for active zones
function ParticleField({ accent, count = 12 }: { accent: string; count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    size: 1 + Math.random() * 3,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: accent,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, p.speedX * 40],
            y: [0, p.speedY * 40],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Anatomical zone labels positioned as CSS percentages over the anatomy image
const ANATOMY_ZONE_POSITIONS: Record<string, { top: string; left: string }> = {
  brain:   { top: "2%",  left: "42%" },
  throat:  { top: "16%", left: "44%" },
  heart:   { top: "25%", left: "44%" },
  lungs:   { top: "28%", left: "25%" },
  stomach: { top: "38%", left: "42%" },
  liver:   { top: "37%", left: "58%" },
  spine:   { top: "20%", left: "72%" },
  pelvis:  { top: "47%", left: "44%" },
  immune:  { top: "22%", left: "18%" },
  legs:    { top: "58%", left: "44%" },
};

export default function BodyDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [viewMode, setViewMode] = useState<"system" | "anatomical">("system");
  const animRef = useRef<number>(0);

  // Continuous subtle pulse animation
  useEffect(() => {
    let start: number | null = null;
    function tick(t: number) {
      if (!start) start = t;
      setPulsePhase((t - start) / 1000);
      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const activeZone = BODY_ZONES.find((z) => z.id === active);

  return (
    <div className="w-full">
      {/* View mode toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setViewMode("system")}
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans border transition-all duration-300 ${
            viewMode === "system"
              ? "bg-[#1B4D4D] text-[#F4EFE6] border-[#1B4D4D]"
              : "bg-transparent text-[#F4EFE6]/50 border-white/10 hover:border-white/30"
          }`}
        >
          System View
        </button>
        <button
          onClick={() => setViewMode("anatomical")}
          className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-sans border transition-all duration-300 ${
            viewMode === "anatomical"
              ? "bg-[#BFA14A] text-[#060D0D] border-[#BFA14A]"
              : "bg-transparent text-[#F4EFE6]/50 border-white/10 hover:border-white/30"
          }`}
        >
          Anatomical View
        </button>
      </div>

      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* LEFT: Body visual */}
        {viewMode === "system" ? (
          /* ── System View: SVG body diagram ── */
          <div className="relative shrink-0 group">
            <svg
              viewBox="220 0 180 430"
              className="w-[240px] md:w-[320px] h-auto drop-shadow-xl"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Interactive human body diagram showing AO Scan wellness assessment zones"
            >
              <defs>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1a1a2e" />
                  <stop offset="50%" stopColor="#16213e" />
                  <stop offset="100%" stopColor="#0f3460" />
                </linearGradient>
                <filter id="zoneGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="activeGlow">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background subtle texture */}
              <rect x="230" y="10" width="140" height="410" rx="70" fill="none" stroke="currentColor" className="text-foreground/5" strokeWidth="0.5" />

              {/* Main body silhouette */}
              <path
                d="M250,48 C245,42 240,50 240,60 C240,70 245,80 252,90 C242,96 232,106 228,120 C225,134 228,148 234,158 C226,166 220,178 218,192 C216,206 220,220 226,232 C232,244 236,254 234,264 C232,274 234,286 236,296 L238,312 L240,330 L244,350 L248,370 L252,390 L256,402 L270,404 L274,392 L276,372 L278,350 L280,332 L282,316 C284,304 286,294 284,284 C282,274 284,264 286,254 C290,250 294,246 298,242 L302,242 C306,246 310,250 314,254 C316,264 318,274 316,284 C314,294 316,304 318,316 L320,332 L322,350 L324,372 L326,392 L330,404 L344,402 L348,390 L352,370 L356,350 L360,330 L362,312 L364,296 C366,286 368,274 366,264 C364,254 368,244 374,232 C380,220 384,206 382,192 C380,178 374,166 366,158 C372,148 375,134 372,120 C368,106 358,96 348,90 C355,80 360,70 360,60 C360,50 355,42 350,48 C345,54 342,66 340,76 C336,80 330,84 322,86 C314,88 306,88 300,86 C294,88 286,88 278,86 C270,84 264,80 260,76 C258,66 255,54 250,48 Z"
                fill="url(#bodyGrad)"
                className="opacity-90"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity={0.15}
              />

              {/* Subtle muscle definition lines */}
              <path d="M248,150 C256,146 264,152 268,158" fill="none" stroke="currentColor" strokeWidth="0.3" opacity={0.08} />
              <path d="M352,150 C344,146 336,152 332,158" fill="none" stroke="currentColor" strokeWidth="0.3" opacity={0.08} />
              <path d="M255,210 C262,204 270,208 275,214" fill="none" stroke="currentColor" strokeWidth="0.3" opacity={0.08} />
              <path d="M345,210 C338,204 330,208 325,214" fill="none" stroke="currentColor" strokeWidth="0.3" opacity={0.08} />

              {/* Zone paths */}
              {BODY_ZONES.map((zone) => {
                const isActive = active === zone.id;
                const isHovered = hovered === zone.id;
                const pulseOpacity = 0.3 + Math.sin(pulsePhase * 2 + BODY_ZONES.indexOf(zone) * 1.5) * 0.1;

                return (
                  <g key={zone.id}>
                    {(isActive || isHovered) && (
                      <path
                        d={zone.path}
                        fill={zone.glowColor}
                        filter={isActive ? "url(#activeGlow)" : "url(#zoneGlow)"}
                        opacity={isActive ? 0.8 : 0.4}
                        className="transition-all duration-500"
                      />
                    )}
                    {isActive && (
                      <path
                        d={zone.path}
                        fill="none"
                        stroke={zone.accent}
                        strokeWidth="3"
                        opacity={pulseOpacity}
                        className="transition-all duration-300"
                      >
                        <animate attributeName="opacity" values={`0.2;${pulseOpacity};0.2`} dur="3s" repeatCount="indefinite" />
                      </path>
                    )}
                    <path
                      d={zone.path}
                      fill={isActive ? zone.accent : isHovered ? zone.accent + "99" : zone.accent + "40"}
                      stroke={isActive ? zone.accent : isHovered ? zone.accent : "currentColor"}
                      strokeWidth={isActive ? 2 : isHovered ? 1.5 : 0.6}
                      className="transition-all duration-200 cursor-pointer"
                      strokeOpacity={isActive ? 0.8 : 0.3}
                      opacity={isActive ? 0.95 : 0.7}
                      onClick={() => setActive(active === zone.id ? null : zone.id)}
                      onMouseEnter={() => setHovered(zone.id)}
                      onMouseLeave={() => setHovered(null)}
                      role="button"
                      aria-label={`Explore ${zone.label} zone`}
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActive(active === zone.id ? null : zone.id);
                        }
                      }}
                    />
                    {isActive && (
                      <g>
                        {[0, 1, 2].map((i) => (
                          <circle
                            key={i}
                            cx={(() => { const m = zone.path.match(/M(\d+)/); return m ? parseInt(m[1]) + i * 15 : 300; })()}
                            cy={(() => { const m = zone.path.match(/C[\\d,.\\s]+Z/); return m ? 150 + i * 20 : 150; })()}
                            r={2}
                            fill={zone.accent}
                            className="animate-pulse"
                            style={{ animationDelay: `${i * 0.7}s` }}
                          />
                        ))}
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Subtle energy meridians */}
              <path d="M300,28 C298,60 296,100 298,140 C300,180 302,220 300,260" fill="none" stroke="#BFA14A" strokeWidth="0.3" opacity={0.08} />
              <path d="M270,130 C275,160 280,190 278,220" fill="none" stroke="#BFA14A" strokeWidth="0.2" opacity={0.06} />
              <path d="M330,130 C325,160 320,190 322,220" fill="none" stroke="#BFA14A" strokeWidth="0.2" opacity={0.06} />
            </svg>
          </div>
        ) : (
          /* ── Anatomical View: Realistic anatomy image ── */
          <div className="relative shrink-0">
            <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0f] border border-white/10 shadow-xl">
              <img
                src={bodyAnatomyImg}
                alt="Realistic human anatomy diagram — full frontal view of musculature and body regions"
                className="w-[260px] md:w-[360px] h-auto"
              />
              {/* Zone indicator dots positioned over the anatomy image */}
              {BODY_ZONES.map((zone) => {
                const isActive = active === zone.id;
                const isHovered = hovered === zone.id;
                const pos = ANATOMY_ZONE_POSITIONS[zone.id];
                if (!pos) return null;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setActive(active === zone.id ? null : zone.id)}
                    onMouseEnter={() => setHovered(zone.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="absolute rounded-full transition-all duration-200 z-10"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: isActive ? 20 : isHovered ? 16 : 12,
                      height: isActive ? 20 : isHovered ? 16 : 12,
                      backgroundColor: isActive ? zone.accent : zone.accent + "80",
                      boxShadow: isActive
                        ? `0 0 16px ${zone.glowColor}, 0 0 32px ${zone.glowColor}`
                        : isHovered
                        ? `0 0 8px ${zone.glowColor}`
                        : "none",
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                    }}
                    aria-label={zone.label}
                    title={zone.label}
                  />
                );
              })}
            </div>
            {/* Zone label bar — visible zone names below the image */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {BODY_ZONES.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setActive(active === z.id ? null : z.id)}
                  onMouseEnter={() => setHovered(z.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`text-[10px] px-2 py-1 rounded-full border transition-all duration-200 ${
                    active === z.id
                      ? "bg-[#BFA14A] text-[#060D0D] border-[#BFA14A] font-medium"
                      : "border-white/10 text-[#F4EFE6]/50 hover:border-white/30 hover:text-[#F4EFE6]/80"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RIGHT: Info Panel — IDENTICAL in both modes */}
        <div className="flex-1 w-full min-h-[320px]">
          <AnimatePresence mode="wait">
            {activeZone ? (
              <motion.div
                key={activeZone.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative overflow-hidden"
              >
                <ParticleField accent={activeZone.accent} count={8} />
                <div className="relative bg-card border border-border/60 rounded-2xl p-7 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full shrink-0 shadow-lg"
                      style={{ backgroundColor: activeZone.accent, boxShadow: `0 0 12px ${activeZone.glowColor}` }}
                    />
                    <h3 className="text-2xl font-serif text-primary tracking-tight">{activeZone.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activeZone.description}
                  </p>
                  <button
                    onClick={() => setActive(null)}
                    className="mt-5 text-xs text-secondary hover:text-secondary/80 transition-colors inline-flex items-center gap-1"
                  >
                    <span>←</span> Close
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center lg:text-left py-8"
              >
                <h3 className="text-2xl font-serif text-primary mb-3">
                  Explore Your Body's Frequencies
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                  Click any highlighted region on the body diagram to discover how
                  AO Scan frequency analysis reveals the unique story each system
                  is telling about your wellbeing.
                </p>
                {viewMode === "anatomical" && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-md mt-2 italic">
                    Realistic anatomical illustration showing the musculature and body regions
                    analyzed during an AO Scan assessment.
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                  {BODY_ZONES.map((z) => (
                    <button
                      key={z.id}
                      onClick={() => setActive(z.id)}
                      className="text-xs px-3.5 py-2 rounded-full border border-border/60 text-muted-foreground hover:border-secondary/40 hover:text-secondary transition-all duration-200"
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
