import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, CheckCircle, Mic, MicOff, Square, Play,
  ChevronRight, ChevronLeft, Lock, Users, Info, Globe, MessageCircle
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LANGUAGES, useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const REPORT_TYPES = [
  { value: "inner_voice", label: "Inner Voice", desc: "15-second voice sample analysis", icon: "🎙️", voice: true },
  { value: "vitals", label: "Vitals Report", desc: "Upload your AO Scan vitals export", icon: "📊", voice: false },
  { value: "comprehensive", label: "Comprehensive", desc: "Full multi-system scan upload", icon: "🔬", voice: false },
  { value: "pet_scan", label: "Pet Scan", desc: "Wellness scan for your animal companion", icon: "🐾", voice: false },
] as const;

const PLANS = [
  {
    id: "basic",
    label: "Basic",
    price: "$55",
    popular: false,
    features: [
      { label: "Personalized wellness overview", included: true },
      { label: "Up to 5 focus areas", included: true },
      { label: "BioHarmony Score", included: false },
      { label: "Audio narration", included: false },
      { label: "Priority review", included: false },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    price: "$99",
    popular: true,
    features: [
      { label: "In-depth narrative report", included: true },
      { label: "10+ focus areas covered", included: true },
      { label: "BioHarmony Score", included: true },
      { label: "Audio narration", included: false },
      { label: "Priority review", included: false },
    ],
  },
  {
    id: "premium",
    label: "Premium",
    price: "$149",
    popular: false,
    features: [
      { label: "Comprehensive full report", included: true },
      { label: "All wellness systems", included: true },
      { label: "BioHarmony Score", included: true },
      { label: "Audio narration", included: true },
      { label: "Priority review", included: true },
    ],
  },
] as const;

const STEPS = [
  { n: 1, label: "Report Type" },
  { n: 2, label: "Upload" },
  { n: 3, label: "Your Info" },
  { n: 4, label: "Plan" },
  { n: 5, label: "Notes" },
] as const;

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.2 } }),
};

const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  whatsapp: z.boolean().default(false),
  preferredLanguage: z.string().min(2),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
              current === s.n
                ? "border-[#BFA14A] bg-[#BFA14A]/15 text-[#BFA14A] shadow-[0_0_14px_rgba(191,161,74,0.4)]"
                : current > s.n
                  ? "border-[#0F5C5E] bg-[#0F5C5E]/20 text-[#0F5C5E]"
                  : "border-white/15 bg-transparent text-[#F4EFE6]/25"
            )}>
              {current > s.n ? <CheckCircle className="w-3.5 h-3.5" /> : s.n}
            </div>
            <span className={cn(
              "text-[10px] uppercase tracking-wider hidden sm:block transition-colors",
              current === s.n ? "text-[#BFA14A]" : current > s.n ? "text-[#0F5C5E]/70" : "text-[#F4EFE6]/20"
            )}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              "w-10 sm:w-16 h-px mx-1 mb-5 sm:mb-6 transition-all duration-300",
              current > s.n ? "bg-[#0F5C5E]/40" : "bg-white/8"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function NavButtons({
  onBack, onNext, nextLabel = "Continue", nextDisabled = false, loading = false, step, totalSteps,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  step: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 text-sm text-[#F4EFE6]/50 hover:text-[#F4EFE6]/80 transition-colors rounded-full hover:bg-white/5"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      ) : <div />}
      <div className="text-[10px] text-[#F4EFE6]/20 uppercase tracking-wider">
        {step} / {totalSteps}
      </div>
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || loading}
          className={cn(
            "flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200",
            nextDisabled || loading
              ? "bg-white/5 text-[#F4EFE6]/25 cursor-not-allowed"
              : "bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_16px_rgba(191,161,74,0.2)] hover:shadow-[0_0_28px_rgba(191,161,74,0.4)]"
          )}
        >
          {loading ? "Submitting…" : nextLabel}
          {!loading && <ChevronRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

function VoiceRecorder({ onRecorded }: { onRecorded: (blob: Blob | null, name: string | null) => void }) {
  const [phase, setPhase] = useState<"idle" | "recording" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (phase === "recording" && seconds >= 15) stopRecording();
  }, [seconds, phase, stopRecording]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setPhase("done");
        onRecorded(blob, "voice_sample.webm");
        stream.getTracks().forEach(t => t.stop());
      };

      mr.start();
      setPhase("recording");
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch {
      setError("Microphone access denied. Please allow microphone access and try again.");
    }
  };

  const reset = () => {
    setPhase("idle");
    setSeconds(0);
    setAudioUrl(null);
    setError(null);
    onRecorded(null, null);
  };

  const remaining = Math.max(0, 15 - seconds);
  const progress = Math.min(seconds / 15, 1);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-[#F4EFE6]/55 text-sm text-center max-w-sm leading-relaxed">
        Say your name and speak naturally for 15 seconds — anything about how you've been feeling, your health goals, or what's on your mind.
      </p>

      <div className="relative w-36 h-36">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke={phase === "recording" ? "#BFA14A" : "#0F5C5E"}
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            strokeLinecap="round"
            className="transition-all duration-200"
          />
        </svg>
        <button
          type="button"
          onClick={phase === "idle" ? startRecording : phase === "recording" ? stopRecording : reset}
          className={cn(
            "absolute inset-3 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-200",
            phase === "idle" && "bg-[#0F5C5E]/40 hover:bg-[#0F5C5E]/60 border border-[#0F5C5E]/50",
            phase === "recording" && "bg-[#BFA14A]/10 border border-[#BFA14A]/40 animate-pulse",
            phase === "done" && "bg-[#0F5C5E]/20 border border-[#0F5C5E]/30"
          )}
        >
          {phase === "idle" && <><Mic className="w-7 h-7 text-[#0F5C5E]" /><span className="text-[10px] text-[#F4EFE6]/40 uppercase tracking-wider">Record</span></>}
          {phase === "recording" && <><Square className="w-6 h-6 text-[#BFA14A]" /><span className="text-xl font-mono text-[#BFA14A] font-bold">{remaining}s</span></>}
          {phase === "done" && <><CheckCircle className="w-7 h-7 text-[#0F5C5E]" /><span className="text-[10px] text-[#0F5C5E]/80 uppercase tracking-wider">Done</span></>}
        </button>
      </div>

      {phase === "done" && audioUrl && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <audio src={audioUrl} controls className="w-full h-10 rounded-lg opacity-70" />
          <button type="button" onClick={reset} className="text-xs text-[#F4EFE6]/35 hover:text-[#F4EFE6]/60 underline underline-offset-2 transition-colors">
            Record again
          </button>
        </div>
      )}

      {phase === "recording" && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 items-end h-4">
            {[3,5,2,6,4,5,3,6,4,3].map((h, i) => (
              <div key={i} className="w-0.5 bg-[#BFA14A] rounded-full animate-pulse" style={{ height: `${h * 2}px`, animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
          <span className="text-[#BFA14A] text-xs">Recording…</span>
        </div>
      )}

      {phase === "idle" && (
        <button
          type="button"
          onClick={() => onRecorded(null, "voice_sample_skipped.webm")}
          className="text-xs text-[#F4EFE6]/25 hover:text-[#F4EFE6]/45 transition-colors"
        >
          Skip — I'll record later
        </button>
      )}

      {error && <p className="text-red-400/80 text-xs text-center">{error}</p>}
    </div>
  );
}

export default function UploadScan() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [reportType, setReportType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<{ name: string; blob?: Blob } | null>(null);
  const [plan, setPlan] = useState<"basic" | "advanced" | "premium">("advanced");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);

  const isVoice = REPORTS_TYPE_IS_VOICE(reportType);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", whatsapp: false, preferredLanguage: language, note: "" },
  });

  const watchWhatsapp = form.watch("whatsapp");

  function REPORTS_TYPE_IS_VOICE(t: string) {
    return t === "inner_voice";
  }

  const goNext = () => { setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  const handleFileClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setSelectedFile({ name: file.name });
    };
    input.click();
  };

  async function handleSubmit(values: FormValues) {
    setIsLoading(true);
    setSubmitError("");
    try {
      // Step 1: Create the scan request
      const res = await fetch(`${BASE}/api/scan-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          reportType,
          language: values.preferredLanguage,
          fileName: selectedFile?.name ?? undefined,
          whatsapp: values.whatsapp,
          plan,
          note: values.note || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }
      const data = (await res.json()) as { id?: number };
      const numericId = data.id;
      if (numericId) {
        const rid = `BH-${numericId.toString().padStart(4, "0")}`;
        setRequestId(rid);

        // Step 2: Create Stripe checkout session and redirect
        const checkoutRes = await fetch(`${BASE}/api/stripe/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanRequestId: numericId }),
        });
        if (checkoutRes.ok) {
          const checkoutData = (await checkoutRes.json()) as { url?: string };
          if (checkoutData.url) {
            // Redirect to Stripe-hosted checkout page
            window.location.href = checkoutData.url;
            return; // don't set isSubmitted — we're navigating away
          }
        }
        // Stripe not yet configured — fall through to confirmation screen
      }
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col min-h-screen bg-[#060D0D] items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-[#0F5C5E]/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(15,92,94,0.4)]">
            <CheckCircle className="w-10 h-10 text-[#0F5C5E]" />
          </div>

          <p className="text-[#BFA14A] text-xs uppercase tracking-[0.25em] mb-3">Your Report Is In Progress</p>
          <h1 className="font-serif text-4xl text-[#F4EFE6] mb-4">Thank you.</h1>
          <p className="text-[#F4EFE6]/60 text-lg leading-relaxed mb-8">
            We'll review your submission and prepare your personalized report within{" "}
            <span className="text-[#BFA14A] font-medium">24–48 hours</span>.
          </p>

          {requestId && (
            <div className="bg-[#BFA14A]/8 border border-[#BFA14A]/30 rounded-2xl px-6 py-6 mb-8 text-left">
              <p className="text-[#BFA14A] text-[10px] uppercase tracking-[0.2em] mb-2">Your Request ID</p>
              <p className="text-[#F4EFE6] font-mono text-3xl tracking-widest font-bold mb-2">{requestId}</p>
              <p className="text-[#F4EFE6]/35 text-xs leading-relaxed">
                Save this ID — use it to track the status of your report at any time.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {requestId && (
              <Link
                href="/track-report"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#BFA14A] text-[#060D0D] text-sm font-semibold hover:bg-[#d4b456] transition-colors"
              >
                Track My Report →
              </Link>
            )}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-transparent border border-white/15 text-[#F4EFE6]/55 text-sm hover:border-white/25 hover:text-[#F4EFE6]/75 transition-all"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#060D0D]">

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F5C5E]/8 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[#BFA14A] text-xs uppercase tracking-[0.25em] mb-4">Upload Your Scan</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F4EFE6] leading-[1.15] mb-5">
            Start Your Personalized<br className="hidden sm:block" /> BioHarmony Report
          </h1>
          <p className="text-[#F4EFE6]/55 text-lg leading-relaxed">
            Upload your scan or submit your voice sample — we'll turn it into a clear, easy-to-understand wellness report.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#BFA14A]/15 to-transparent" />
      </section>

      {/* Form */}
      <section className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          <StepIndicator current={step} />

          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-7 md:p-10 shadow-[0_0_60px_rgba(15,92,94,0.12)] overflow-hidden relative">

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >

                {/* ─── STEP 1: Report Type ─── */}
                {step === 1 && (
                  <div>
                    <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">Choose your report type</h2>
                    <p className="text-[#F4EFE6]/40 text-sm mb-7">Select the type of scan you're submitting for analysis.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {REPORT_TYPES.map((rt) => (
                        <button
                          key={rt.value}
                          type="button"
                          onClick={() => setReportType(rt.value)}
                          className={cn(
                            "text-left px-5 py-5 rounded-2xl border transition-all duration-200",
                            reportType === rt.value
                              ? "border-[#BFA14A]/50 bg-[#BFA14A]/8 shadow-[0_0_24px_rgba(191,161,74,0.15)]"
                              : "border-white/8 bg-white/[0.025] hover:border-white/18 hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="text-2xl mb-3">{rt.icon}</div>
                          <p className={cn("text-sm font-semibold mb-1 transition-colors", reportType === rt.value ? "text-[#BFA14A]" : "text-[#F4EFE6]/80")}>
                            {rt.label}
                          </p>
                          <p className="text-xs text-[#F4EFE6]/35 leading-relaxed">{rt.desc}</p>
                          {reportType === rt.value && (
                            <div className="mt-3 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A]" />
                              <span className="text-[10px] text-[#BFA14A] uppercase tracking-wider">Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <NavButtons
                      step={1} totalSteps={5}
                      nextDisabled={!reportType}
                      onNext={goNext}
                    />
                  </div>
                )}

                {/* ─── STEP 2: Upload / Record ─── */}
                {step === 2 && (
                  <div>
                    <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">
                      {isVoice ? "Record your voice sample" : "Upload your scan file"}
                    </h2>
                    <p className="text-[#F4EFE6]/40 text-sm mb-7">
                      {isVoice
                        ? "Say your name and speak naturally for 15 seconds"
                        : "Upload your AO Scan export — PDF or XLSX accepted"}
                    </p>

                    {isVoice ? (
                      <VoiceRecorder onRecorded={(blob, name) => {
                        if (name) setSelectedFile({ name, blob: blob ?? undefined });
                        else setSelectedFile(null);
                      }} />
                    ) : (
                      <div
                        onClick={handleFileClick}
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300",
                          selectedFile
                            ? "border-[#0F5C5E]/60 bg-[#0F5C5E]/5 shadow-[0_0_30px_rgba(15,92,94,0.2)]"
                            : "border-[#BFA14A]/25 hover:border-[#BFA14A]/50 hover:shadow-[0_0_24px_rgba(191,161,74,0.12)]"
                        )}
                      >
                        {selectedFile ? (
                          <>
                            <CheckCircle className="w-10 h-10 text-[#0F5C5E] mb-4" />
                            <p className="text-[#BFA14A] font-medium mb-1">{selectedFile.name}</p>
                            <p className="text-xs text-[#F4EFE6]/40">Click to change file</p>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-[#BFA14A]/70 mb-4" />
                            <p className="text-[#F4EFE6]/70 font-medium mb-1">Drag &amp; drop, or click to browse</p>
                            <p className="text-xs text-[#BFA14A]/50 uppercase tracking-widest mt-2">PDF · XLSX · CSV</p>
                          </>
                        )}
                      </div>
                    )}

                    <NavButtons
                      step={2} totalSteps={5}
                      onBack={goBack}
                      onNext={goNext}
                      nextDisabled={!isVoice && !selectedFile}
                    />
                  </div>
                )}

                {/* ─── STEP 3: Personal Info ─── */}
                {step === 3 && (
                  <div>
                    <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">Your information</h2>
                    <p className="text-[#F4EFE6]/40 text-sm mb-7">Where should we send your personalized report?</p>

                    <Form {...form}>
                      <div className="space-y-5">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/60 text-sm">Full Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your full name"
                                className="bg-white/5 border border-white/12 text-[#F4EFE6] placeholder:text-[#F4EFE6]/25 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 h-12 px-4"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80 text-xs" />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/60 text-sm">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="you@example.com"
                                className="bg-white/5 border border-white/12 text-[#F4EFE6] placeholder:text-[#F4EFE6]/25 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 h-12 px-4"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80 text-xs" />
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="whatsapp" render={({ field }) => (
                          <FormItem>
                            <button
                              type="button"
                              onClick={() => field.onChange(!field.value)}
                              className={cn(
                                "w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 text-left",
                                watchWhatsapp
                                  ? "border-[#25D366]/35 bg-[#25D366]/5"
                                  : "border-white/8 bg-white/[0.02] hover:border-white/15"
                              )}
                            >
                              <MessageCircle className={cn("w-5 h-5 shrink-0", watchWhatsapp ? "text-[#25D366]" : "text-[#F4EFE6]/25")} />
                              <div className="flex-1">
                                <p className={cn("text-sm font-medium", watchWhatsapp ? "text-[#F4EFE6]/80" : "text-[#F4EFE6]/45")}>
                                  Send via WhatsApp
                                </p>
                                <p className="text-[#F4EFE6]/25 text-xs mt-0.5">We'll send your report directly to your WhatsApp</p>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                                watchWhatsapp ? "border-[#25D366] bg-[#25D366]" : "border-white/15"
                              )}>
                                {watchWhatsapp && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                            </button>

                            <AnimatePresence>
                              {watchWhatsapp && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                  transition={{ duration: 0.22, ease: "easeOut" }}
                                  className="overflow-hidden"
                                >
                                  <FormField control={form.control} name="phone" render={({ field: phoneField }) => (
                                    <FormItem>
                                      <FormLabel className="text-[#25D366]/70 text-sm flex items-center gap-1.5">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        WhatsApp Number
                                        <span className="text-[#F4EFE6]/25 font-normal">(optional)</span>
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...phoneField}
                                          type="tel"
                                          placeholder="+1 (555) 000-0000"
                                          className="bg-[#25D366]/5 border border-[#25D366]/25 text-[#F4EFE6] placeholder:text-[#F4EFE6]/25 rounded-xl focus-visible:border-[#25D366]/50 focus-visible:ring-0 h-12 px-4"
                                        />
                                      </FormControl>
                                      <p className="text-[10px] text-[#F4EFE6]/28 mt-1 ml-1">
                                        Include country code — e.g. +1 for Canada/USA
                                      </p>
                                    </FormItem>
                                  )} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </FormItem>
                        )} />

                        <FormField control={form.control} name="preferredLanguage" render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2 mb-3">
                              <Globe className="w-3.5 h-3.5 text-[#BFA14A]/50" />
                              <FormLabel className="text-[#F4EFE6]/60 text-sm mb-0">Report Language</FormLabel>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {LANGUAGES.map((lang) => (
                                <button
                                  key={lang.code}
                                  type="button"
                                  onClick={() => field.onChange(lang.code)}
                                  className={cn(
                                    "text-sm px-4 py-2 rounded-full border transition-all",
                                    field.value === lang.code
                                      ? "border-[#BFA14A]/55 bg-[#BFA14A]/10 text-[#BFA14A]"
                                      : "border-white/8 text-[#F4EFE6]/35 hover:border-white/18 hover:text-[#F4EFE6]/55"
                                  )}
                                >
                                  {lang.nativeLabel}
                                </button>
                              ))}
                            </div>
                          </FormItem>
                        )} />
                      </div>
                    </Form>

                    <NavButtons
                      step={3} totalSteps={5}
                      onBack={goBack}
                      onNext={async () => {
                        const valid = await form.trigger(["name", "email"]);
                        if (valid) goNext();
                      }}
                    />
                  </div>
                )}

                {/* ─── STEP 4: Plan ─── */}
                {step === 4 && (
                  <div>
                    <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">Select your plan</h2>
                    <p className="text-[#F4EFE6]/40 text-sm mb-7">All plans include a fully personalized report delivered within 24–48 hours.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
                      {PLANS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlan(p.id as "basic" | "advanced" | "premium")}
                          className={cn(
                            "relative text-left px-5 py-5 rounded-2xl border transition-all duration-200 flex flex-col",
                            plan === p.id
                              ? p.popular
                                ? "border-[#BFA14A]/60 bg-[#BFA14A]/8 shadow-[0_0_30px_rgba(191,161,74,0.2)]"
                                : "border-[#0F5C5E]/50 bg-[#0F5C5E]/8 shadow-[0_0_24px_rgba(15,92,94,0.2)]"
                              : "border-white/8 bg-white/[0.025] hover:border-white/16"
                          )}
                        >
                          {p.popular && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#BFA14A] text-[#060D0D] text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap">
                              Most Popular
                            </span>
                          )}
                          <div className="mt-1 mb-3">
                            <p className={cn("text-sm font-semibold mb-0.5", plan === p.id ? (p.popular ? "text-[#BFA14A]" : "text-[#0F5C5E]") : "text-[#F4EFE6]/65")}>
                              {p.label}
                            </p>
                            <p className={cn("text-2xl font-bold font-serif", plan === p.id ? (p.popular ? "text-[#BFA14A]" : "text-[#F4EFE6]") : "text-[#F4EFE6]/80")}>
                              {p.price}
                            </p>
                          </div>
                          <div className="space-y-1.5 mt-auto">
                            {p.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className={cn("w-3 h-3 rounded-full flex items-center justify-center shrink-0", f.included ? "bg-[#0F5C5E]/30" : "bg-transparent")}>
                                  {f.included
                                    ? <CheckCircle className="w-3 h-3 text-[#0F5C5E]" />
                                    : <div className="w-1.5 h-0.5 bg-white/15 rounded" />
                                  }
                                </div>
                                <span className={cn("text-[11px] leading-tight", f.included ? "text-[#F4EFE6]/60" : "text-[#F4EFE6]/20 line-through")}>
                                  {f.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mt-5 px-1">
                      <Info className="w-3.5 h-3.5 text-[#BFA14A]/40 shrink-0" />
                      <p className="text-[#F4EFE6]/28 text-xs">
                        Payment will be collected after your report is reviewed. Stripe integration coming soon — no payment required to submit today.
                      </p>
                    </div>

                    <NavButtons step={4} totalSteps={5} onBack={goBack} onNext={goNext} />
                  </div>
                )}

                {/* ─── STEP 5: Notes + Submit ─── */}
                {step === 5 && (
                  <div>
                    <h2 className="font-serif text-2xl text-[#F4EFE6] mb-2">Anything else?</h2>
                    <p className="text-[#F4EFE6]/40 text-sm mb-7">Optional — share anything that might help us personalize your report further.</p>

                    <Form {...form}>
                      <FormField control={form.control} name="note" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F4EFE6]/55 text-sm">
                            Notes <span className="text-[#F4EFE6]/25 font-normal">(optional)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Anything you'd like us to know? Symptoms, health goals, what you're hoping to understand from this report…"
                              className="bg-white/5 border border-white/12 text-[#F4EFE6] placeholder:text-[#F4EFE6]/25 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 min-h-[130px] px-4 py-3 resize-none"
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                    </Form>

                    {/* Summary */}
                    <div className="mt-8 bg-white/[0.025] border border-white/8 rounded-2xl px-5 py-5 space-y-2.5">
                      <p className="text-[#F4EFE6]/30 text-[10px] uppercase tracking-[0.2em] mb-3">Submission Summary</p>
                      {[
                        { label: "Report Type", value: REPORT_TYPES.find(r => r.value === reportType)?.label ?? reportType },
                        { label: "Plan", value: `${PLANS.find(p => p.id === plan)?.label} — ${PLANS.find(p => p.id === plan)?.price}` },
                        { label: "Name", value: form.getValues("name") },
                        { label: "Email", value: form.getValues("email") },
                        ...(selectedFile ? [{ label: "File", value: selectedFile.name }] : []),
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between gap-4">
                          <span className="text-[#F4EFE6]/30 text-sm">{row.label}</span>
                          <span className="text-[#F4EFE6]/65 text-sm text-right truncate max-w-[55%]">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {submitError && (
                      <p className="mt-4 text-sm text-red-400/80 bg-red-400/8 border border-red-400/20 rounded-xl px-4 py-3">
                        {submitError}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-2 px-5 py-3 text-sm text-[#F4EFE6]/50 hover:text-[#F4EFE6]/80 transition-colors rounded-full hover:bg-white/5"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={isLoading}
                        className={cn(
                          "flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-200",
                          isLoading
                            ? "bg-white/5 text-[#F4EFE6]/25 cursor-not-allowed"
                            : "bg-[#BFA14A] text-[#060D0D] shadow-[0_0_20px_rgba(191,161,74,0.35)] hover:shadow-[0_0_40px_rgba(191,161,74,0.6)] hover:bg-[#d4b456]"
                        )}
                      >
                        {isLoading ? "Redirecting to payment…" : "Continue to Payment"}
                        {!isLoading && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trust elements */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { icon: <Lock className="w-3.5 h-3.5" />, label: "Private &amp; Secure" },
              { icon: <Users className="w-3.5 h-3.5" />, label: "Used by wellness practitioners" },
              { icon: <Info className="w-3.5 h-3.5" />, label: "Non-diagnostic, wellness insight only" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-[#F4EFE6]/28 text-xs">
                <span className="text-[#BFA14A]/35">{t.icon}</span>
                <span dangerouslySetInnerHTML={{ __html: t.label }} />
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
