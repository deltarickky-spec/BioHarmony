import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BodyZone {
  id: string;
  label: string;
  description: string;
  path: string;
  fillColor: string;
}

const BODY_ZONES: BodyZone[] = [
  {
    id: "brain",
    label: "Nervous System",
    description:
      "AO Scan assesses your nervous system's coherence by measuring autonomic balance — how well your parasympathetic (rest & digest) and sympathetic (fight or flight) branches are harmonized.",
    path: "M275,45 C275,30 290,18 310,18 C330,18 345,30 345,45 C345,55 340,62 335,68 L330,74 L290,74 L285,68 C280,62 275,55 275,45 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "throat",
    label: "Thyroid & Throat",
    description:
      "Your voice carries your body's energetic signature. AO Scan analyzes vocal frequencies to detect stress patterns, metabolic imbalances, and energetic blockages in the throat and thyroid region.",
    path: "M300,84 L310,84 L315,100 L305,110 L295,110 L285,100 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "lungs",
    label: "Respiratory System",
    description:
      "Frequency patterns in the respiratory field reveal how well your body oxygenates and processes environmental stressors. AO Scan can detect energetic imbalances before they manifest physically.",
    path: "M255,120 C245,115 240,130 245,140 C250,150 270,165 285,165 L290,155 C275,148 260,135 255,120 Z M345,120 C355,115 360,130 355,140 C350,150 330,165 315,165 L310,155 C325,148 340,135 345,120 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "heart",
    label: "Cardiovascular",
    description:
      "Your heart's electromagnetic field is the strongest in your body. AO Scan evaluates heart rate variability and energetic coherence — key indicators of your overall vitality and stress resilience.",
    path: "M285,130 C275,120 270,140 280,150 C290,160 300,155 300,155 C300,155 310,160 320,150 C330,140 325,120 315,130 C310,135 305,140 300,142 C295,140 290,135 285,130 Z",
    fillColor: "#BFA14A",
  },
  {
    id: "stomach",
    label: "Digestive System",
    description:
      "The gut is your 'second brain.' AO Scan bioresonance reveals energetic imbalances in the digestive tract — from stomach to colon — that may affect nutrient absorption, inflammation, and overall wellbeing.",
    path: "M270,175 L330,175 L335,210 C335,225 325,230 310,230 L290,230 C275,230 265,225 265,210 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "liver",
    label: "Liver & Detoxification",
    description:
      "Your liver processes everything you're exposed to. AO Scan frequency analysis can identify energetic congestion in detox pathways, helping you make targeted adjustments for better metabolic health.",
    path: "M335,178 L360,185 C365,190 365,205 360,210 L340,215 L335,205 L330,195 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "spine",
    label: "Spine & Skeletal",
    description:
      "Your spine is the main communication highway. AO Scan evaluates frequency coherence along the spinal column, revealing areas of energetic stress that may correspond to physical tension or imbalances.",
    path: "M297,82 L303,82 L305,170 L300,175 L295,170 Z",
    fillColor: "#BFA14A",
  },
  {
    id: "pelvis",
    label: "Reproductive & Pelvic",
    description:
      "Frequency analysis of the pelvic region provides insights into hormonal balance, reproductive vitality, and the foundational stability of your body's energetic core.",
    path: "M275,235 L325,235 L330,260 C330,270 320,275 300,275 C280,275 270,270 270,260 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "immune",
    label: "Immune & Lymphatic",
    description:
      "Your immune system operates at specific frequency ranges. AO Scan can detect when your body's natural defense frequencies are depleted or overactive — helping you restore optimal immune function.",
    path: "M240,130 L250,135 L248,160 L238,158 Z M360,130 L350,135 L352,160 L362,158 Z",
    fillColor: "#1B4D4D",
  },
  {
    id: "legs",
    label: "Musculoskeletal",
    description:
      "AO Scan assesses frequency patterns in muscles, joints, and connective tissue. Energetic imbalances here often precede physical discomfort and can be addressed early through targeted frequency work.",
    path: "M285,278 L295,278 L293,380 L287,395 L283,380 Z M305,278 L315,278 L313,380 L307,395 L303,380 Z",
    fillColor: "#1B4D4D",
  },
];

export default function BodyDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeZone = BODY_ZONES.find((z) => z.id === active);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
      {/* SVG Body */}
      <div className="relative shrink-0">
        <svg
          viewBox="220 0 180 420"
          className="w-[240px] md:w-[300px] h-auto"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive human body diagram showing AO Scan wellness assessment zones"
        >
          {/* Body silhouette outline */}
          <path
            d="M250,48 C245,42 240,50 240,60 C240,70 245,80 252,90 C240,95 230,108 228,125 C226,140 230,155 238,165 C232,172 225,185 224,200 C222,220 228,238 235,248 C240,258 242,268 240,278 C238,288 240,300 242,310 L244,330 L248,350 L252,370 L256,390 L262,400 L275,400 L278,390 L280,370 L282,350 L285,330 L287,310 C288,300 290,290 288,280 C286,270 288,260 290,250 C293,248 295,245 298,240 L300,240 L310,240 C312,242 315,245 317,248 C320,258 322,268 320,278 C318,288 320,300 322,310 L324,330 L328,350 L332,370 L336,390 L340,400 L358,400 L362,390 L366,370 L370,350 L374,330 L376,310 C378,300 380,290 378,280 C376,270 378,260 380,250 C382,240 378,225 372,215 C380,205 386,192 388,178 C390,165 388,150 382,140 C376,130 370,118 365,110 C368,100 370,85 370,75 C370,60 365,48 360,42 C355,36 348,40 345,45 C340,55 338,68 335,78 C330,82 325,85 318,88 C310,90 305,88 300,85 C295,88 290,90 282,88 C275,85 270,82 265,78 C262,68 260,55 255,45 C252,40 245,36 250,48 Z"
            fill="none"
            stroke="currentColor"
            className="text-foreground/15"
            strokeWidth="1.5"
          />

          {/* Zone paths */}
          {BODY_ZONES.map((zone) => (
            <g key={zone.id}>
              <path
                d={zone.path}
                fill={
                  active === zone.id
                    ? zone.fillColor
                    : hovered === zone.id
                    ? zone.fillColor + "80"
                    : zone.fillColor + "30"
                }
                stroke={
                  active === zone.id
                    ? zone.fillColor
                    : hovered === zone.id
                    ? zone.fillColor
                    : "currentColor"
                }
                strokeWidth={active === zone.id ? 2 : hovered === zone.id ? 1.5 : 0.5}
                className="transition-all duration-200 cursor-pointer"
                strokeOpacity={0.4}
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
              {/* Dot markers on active */}
              {active === zone.id && (
                <circle
                  cx={(() => {
                    const coords = zone.path.match(/C[\d,.\s]+Z/);
                    return coords ? 300 : 300;
                  })()}
                  cy={0}
                  r={3}
                  fill={zone.fillColor}
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Info Panel */}
      <div className="flex-1 w-full min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeZone ? (
            <motion.div
              key={activeZone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: activeZone.fillColor }}
                />
                <h3 className="text-xl font-serif text-primary">{activeZone.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeZone.description}
              </p>
              <button
                onClick={() => setActive(null)}
                className="mt-4 text-xs text-secondary hover:text-secondary/80 transition-colors"
              >
                ← Close
              </button>
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
                Tap Any Body Zone
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Click on a body region to discover what AO Scan frequency analysis
                reveals about that system's energetic health.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
                {BODY_ZONES.slice(0, 5).map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setActive(z.id)}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:border-secondary/40 hover:text-secondary transition-all duration-200"
                  >
                    {z.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground/50 mt-4">
                +{BODY_ZONES.length - 5} more zones
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
