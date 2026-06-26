import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

interface Result {
  title: string;
  description: string;
  scans: string[];
  cta: string;
}

const QUESTIONS: Question[] = [
  {
    id: "energy",
    text: "How would you describe your current energy levels?",
    options: [
      { label: "Consistently low — I feel drained most days", value: "low" },
      { label: "Fluctuating — good some days, exhausted others", value: "fluctuating" },
      { label: "Generally okay but could be better", value: "okay" },
      { label: "Great — I'm looking to optimize further", value: "great" },
    ],
  },
  {
    id: "focus",
    text: "How is your mental clarity and focus?",
    options: [
      { label: "Brain fog is a daily struggle", value: "poor" },
      { label: "Decent but I lose focus easily", value: "moderate" },
      { label: "Pretty sharp, but I want to sustain it longer", value: "good" },
      { label: "Excellent — no concerns here", value: "excellent" },
    ],
  },
  {
    id: "body",
    text: "Do you experience any physical discomfort?",
    options: [
      { label: "Chronic pain or stiffness in joints/muscles", value: "chronic" },
      { label: "Occasional tension, especially after stress", value: "occasional" },
      { label: "Mild discomfort that comes and goes", value: "mild" },
      { label: "No physical complaints", value: "none" },
    ],
  },
  {
    id: "digestion",
    text: "How would you rate your digestive health?",
    options: [
      { label: "Bloating, indigestion, or irregularity are common", value: "poor" },
      { label: "Mixed — some days good, some days not", value: "mixed" },
      { label: "Generally feels balanced", value: "good" },
      { label: "Excellent — no issues at all", value: "excellent" },
    ],
  },
  {
    id: "goal",
    text: "What's your primary wellness goal right now?",
    options: [
      { label: "Identify hidden stressors or imbalances", value: "discover" },
      { label: "Optimize my nutrition and detox pathways", value: "optimize" },
      { label: "Support emotional balance and stress resilience", value: "emotional" },
      { label: "Deep full-body wellness assessment", value: "comprehensive" },
    ],
  },
];

function getResult(responses: Record<string, string>): Result {
  const energy = responses.energy || "okay";
  const focus = responses.focus || "moderate";
  const body = responses.body || "mild";
  const digestion = responses.digestion || "good";
  const goal = responses.goal || "comprehensive";

  // Determine recommended scan(s)
  const tags: string[] = [];
  if (energy === "low" || focus === "poor") tags.push("Inner Voice Scan");
  if (body === "chronic" || body === "occasional") tags.push("Body System Scan");
  if (digestion === "poor" || digestion === "mixed") tags.push("Vitals Scan");
  if (goal === "emotional" || (energy === "fluctuating" && focus === "moderate"))
    tags.push("AO Mindsync");
  if (goal === "comprehensive" || tags.length >= 3) {
    tags.length = 0;
    tags.push("Comprehensive Scan");
  }

  const scanList = tags.length > 0 ? tags : ["Comprehensive Scan"];

  if (scanList[0] === "Comprehensive Scan") {
    return {
      title: "You're Ready for the Full Picture",
      description:
        "Your answers suggest a broad-based assessment would be most valuable. The Comprehensive Scan covers all body systems, emotional frequencies, nutritional pathways, and more — giving you a complete map of your energetic health.",
      scans: scanList,
      cta: "Book a Comprehensive Scan",
    };
  }

  if (scanList.includes("Inner Voice Scan")) {
    return {
      title: "Your Inner Wisdom Needs a Voice",
      description:
        "Your responses point to a need for deeper emotional and energetic clarity. The Inner Voice Scan reveals subconscious stress patterns, emotional blockages, and the frequency story your body is telling you.",
      scans: [scanList[0]],
      cta: "Explore Inner Voice",
    };
  }

  return {
    title: "We Know Where to Start",
    description:
      `Based on your answers, we recommend starting with a **${scanList[0]}** to pinpoint the specific areas your body is asking you to support. From there, Kathy will guide you through your results and suggest next steps.`,
    scans: scanList,
    cta: "Get Started",
  };
}

export default function WellnessQuiz() {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);

  const current = QUESTIONS[step];
  const isComplete = result !== null;
  const progress = ((step) / QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    if (!current) return;

    const updated = { ...responses, [current.id]: value };
    setResponses(updated);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getResult(updated));
    }
  };

  const handleReset = () => {
    setStep(0);
    setResponses({});
    setResult(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isComplete ? (
        <>
          {/* Progress bar */}
          <div className="w-full h-1 bg-border rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <h3 className="text-xl md:text-2xl font-serif text-primary mb-6">
                {current.text}
              </h3>

              <div className="flex flex-col gap-3">
                {current.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="text-left px-5 py-3.5 rounded-xl border border-border/60 bg-card hover:border-secondary/40 hover:bg-card/80 transition-all duration-200 text-sm text-muted-foreground hover:text-primary"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border/50 rounded-2xl p-8 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-secondary text-xl">✦</span>
          </div>
          <h3 className="text-2xl font-serif text-primary mb-3">
            {result!.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
            {result!.description}
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {result!.scans.map((scan) => (
              <span
                key={scan}
                className="text-xs px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
              >
                {scan}
              </span>
            ))}
          </div>
          <button className="px-6 py-3 bg-secondary text-background rounded-xl text-sm font-medium hover:bg-secondary/90 transition-colors">
            {result!.cta} →
          </button>
          <div className="mt-4">
            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-secondary transition-colors"
            >
              ← Retake quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
