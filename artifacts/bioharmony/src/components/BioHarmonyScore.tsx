import { useState } from "react";
import { Info } from "lucide-react";

export interface ScoreBreakdown {
  label: string;
  value: number;
}

interface Props {
  score?: number;
  breakdown?: ScoreBreakdown[];
}

const DEFAULT_BREAKDOWN: ScoreBreakdown[] = [
  { label: "Stress Load", value: 65 },
  { label: "Energy Balance", value: 78 },
  { label: "System Alignment", value: 71 },
  { label: "Recovery Capacity", value: 74 },
];

export function BioHarmonyScore({ score = 72, breakdown = DEFAULT_BREAKDOWN }: Props) {
  const [tip, setTip] = useState(false);

  const R = 40;
  const C = 2 * Math.PI * R;
  const filled = C * (score / 100);

  const scoreColor =
    score >= 75 ? "#6FCF97" : score >= 55 ? "#BFA14A" : "#E07B6A";

  return (
    <div className="bg-white/[0.025] border border-[#BFA14A]/15 rounded-2xl p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center gap-2">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#BFA14A] font-sans font-medium leading-none">
          BioHarmony Intelligence Score
        </p>
        <div className="relative">
          <button
            onMouseEnter={() => setTip(true)}
            onMouseLeave={() => setTip(false)}
            onFocus={() => setTip(true)}
            onBlur={() => setTip(false)}
            aria-label="Score information"
            className="text-[#F4EFE6]/25 hover:text-[#BFA14A]/60 transition-colors flex items-center"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {tip && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-30 w-56 bg-[#0C1919] border border-white/12 rounded-xl px-3 py-2.5 shadow-2xl pointer-events-none">
              <p className="text-[11px] text-[#F4EFE6]/60 leading-relaxed text-center">
                Educational wellness insight. Not a medical diagnosis.
              </p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0C1919] border-r border-b border-white/12 rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* Meter + breakdown */}
      <div className="flex flex-col sm:flex-row items-center gap-7">

        {/* Circular meter */}
        <div className="relative shrink-0 w-[112px] h-[112px]">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              stroke={scoreColor}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${C}`}
              strokeDashoffset="0"
              style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-2xl font-serif font-semibold text-[#F4EFE6] leading-none" style={{ color: scoreColor }}>
              {score}
            </span>
            <span className="text-[10px] text-[#F4EFE6]/30 font-sans leading-none">/ 100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full space-y-3.5">
          {breakdown.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#F4EFE6]/50 font-sans tracking-wide">{item.label}</span>
                <span className="text-[11px] font-sans font-medium" style={{ color: scoreColor + "bb" }}>
                  {item.value}
                </span>
              </div>
              <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    background: `linear-gradient(90deg, ${scoreColor}55, ${scoreColor})`,
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-[#F4EFE6]/18 font-sans tracking-wider text-center pt-1 border-t border-white/6">
        Composite wellness index based on scan pattern analysis · For educational purposes only
      </p>
    </div>
  );
}
