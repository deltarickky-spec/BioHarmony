import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { INDIVIDUAL_SCANS, BUNDLE_PLANS, PET_PLANS, MEMBERSHIP_PLANS, PRICING_DISCLAIMER } from "@/lib/pricing";
import BodyDiagram from "@/components/BodyDiagram";
import WellnessQuiz from "@/components/WellnessQuiz";
import heroBg from "@/assets/hero-bg.png";
import kathyAvatar from "@/assets/kathy-owens.jpg";
import pemfVisual from "@/assets/pemf-visual.png";
import solexBlood from "@/assets/solex-report-blood.png";
import solexChakra from "@/assets/solex-report-chakra.png";
import solexDigestive from "@/assets/solex-report-digestive.png";
import solexFood from "@/assets/solex-report-food.png";
import solexEmotional from "@/assets/solex-report-emotional.png";
import ClientWall from "@/components/ClientWall";
import PetShowroom from "@/components/PetShowroom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

/* ── Animated scroll counter ── */
function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="text-4xl font-bold text-secondary font-serif tabular-nums">
      {count.toLocaleString()}
    </span>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const pillarParallax = useTransform(scrollYProgress, [0, 1], [0, 60]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Abstract wellness atmosphere" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/30"></div>
          
          {/* ── Floating decorative orbs ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse-soft animate-drift-slow" />
            <div className="absolute top-[40%] right-[5%] w-72 h-72 rounded-full bg-[#BFA14A]/8 blur-[80px] animate-pulse-soft animate-drift-medium" style={{ animationDelay: '-2s', animationDirection: 'reverse' }} />
            <div className="absolute bottom-[20%] left-[30%] w-48 h-48 rounded-full bg-teal-400/6 blur-[60px] animate-float" style={{ animationDelay: '-4s' }} />
            <div className="absolute top-[60%] left-[60%] w-32 h-32 rounded-full bg-[#BFA14A]/5 blur-[50px] animate-float" style={{ animationDelay: '-1.5s', animationDuration: '7s' }} />
          </div>

          {/* ── Animated frequency wave ── */}
          <svg className="absolute bottom-0 left-0 w-full h-[200px] opacity-[0.04] pointer-events-none" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="freqGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1B4D4D" />
                <stop offset="50%" stopColor="#BFA14A" />
                <stop offset="100%" stopColor="#1B4D4D" />
              </linearGradient>
            </defs>
            <path d="M0,100 C100,30 200,170 300,100 C400,30 500,170 600,100 C700,30 800,170 900,100 C1000,30 1100,170 1200,100 C1300,30 1400,170 1440,100 L1440,200 L0,200 Z" fill="none" stroke="url(#freqGrad)" strokeWidth="2">
              <animate attributeName="d" dur="10s" repeatCount="indefinite"
                values="
                  M0,100 C100,30 200,170 300,100 C400,30 500,170 600,100 C700,30 800,170 900,100 C1000,30 1100,170 1200,100 C1300,30 1400,170 1440,100 L1440,200 L0,200 Z;
                  M0,80 C100,150 200,10 300,80 C400,150 500,10 600,80 C700,150 800,10 900,80 C1000,150 1100,10 1200,80 C1300,150 1400,10 1440,80 L1440,200 L0,200 Z;
                  M0,120 C100,50 200,130 300,120 C400,50 500,130 600,120 C700,50 800,130 900,120 C1000,50 1100,130 1200,120 C1300,50 1400,130 1440,120 L1440,200 L0,200 Z;
                  M0,100 C100,30 200,170 300,100 C400,30 500,170 600,100 C700,30 800,170 900,100 C1000,30 1100,170 1200,100 C1300,30 1400,170 1440,100 L1440,200 L0,200 Z
                "
              />
            </path>
            <path d="M0,120 C150,80 300,160 450,120 C600,80 750,160 900,120 C1050,80 1200,160 1350,120 L1440,110 L1440,200 L0,200 Z" fill="none" stroke="url(#freqGrad)" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="d" dur="14s" repeatCount="indefinite"
                values="
                  M0,120 C150,80 300,160 450,120 C600,80 750,160 900,120 C1050,80 1200,160 1350,120 L1440,110 L1440,200 L0,200 Z;
                  M0,100 C150,140 300,60 450,100 C600,140 750,60 900,100 C1050,140 1200,60 1350,100 L1440,110 L1440,200 L0,200 Z;
                  M0,130 C150,90 300,150 450,130 C600,90 750,150 900,130 C1050,90 1200,150 1350,130 L1440,110 L1440,200 L0,200 Z;
                  M0,120 C150,80 300,160 450,120 C600,80 750,160 900,120 C1050,80 1200,160 1350,120 L1440,110 L1440,200 L0,200 Z
                "
              />
            </path>
          </svg>
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-2xl space-y-6"
          >
            <p className="text-muted-foreground italic font-serif text-lg">Feeling off but not getting clear answers?</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary leading-[1.1]">
              Decode Your Body's Wellness Signals
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
              Discover personalized wellness insights through AO Scan voice analysis, PEMF therapy, and easy-to-understand reports that help you finally make sense of what your body is telling you.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full text-base px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all text-shimmer hero-cta" data-testid="hero-book-scan">
                  <Link href="/contact">Start Your Personalized Scan</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground italic ml-2 mt-1">Takes less than 2 minutes • Delivered in 24–48 hours</p>
              <Link
                href="/track-report"
                className="inline-flex items-center gap-1.5 ml-2 mt-1 text-sm text-[#BFA14A]/60 hover:text-[#BFA14A] transition-colors duration-200 group"
              >
                <span className="w-1 h-1 rounded-full bg-[#BFA14A]/40 group-hover:bg-[#BFA14A] transition-colors" />
                Already submitted? Track your report
              </Link>
            </div>

            {/* Kathy personal welcome */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
              className="flex items-start gap-4 mt-6 max-w-md bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-4 backdrop-blur-sm"
            >
              <img
                src={kathyAvatar}
                alt="Kathy Owens"
                className="w-11 h-11 rounded-full object-cover object-top border border-[#BFA14A]/25 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-[#F4EFE6]/75 text-sm font-serif italic leading-relaxed">
                  "I started BioHarmony so every person could finally understand what their body is quietly asking for."
                </p>
                <p className="text-[#BFA14A]/60 text-xs font-sans mt-2 tracking-wide">— Kathy Owens, Founder</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Credentials Strip */}
      <section className="relative bg-[#040A0A] border-b border-white/8 py-10 overflow-hidden">
        {/* subtle gold gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BFA14A]/[0.03] to-transparent pointer-events-none" />

        <div className="container px-4 md:px-6">
          {/* Badge row */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-3 mb-7"
          >
            {[
              { icon: "✦", label: "30+ Years in Holistic Wellness" },
              { icon: "⟡", label: "PEMF Therapy Practitioner" },
              { icon: "◈", label: "Bioresonance / AO Scan User" },
              { icon: "✧", label: "Reiki Master" },
              { icon: "◎", label: "Serving Canada & Colombia" },
              { icon: "⊕", label: "Reports Delivered Worldwide" },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeInUp}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur-sm hover:border-[#BFA14A]/25 hover:bg-[#BFA14A]/[0.04] transition-all duration-300 group"
              >
                <span className="text-[#BFA14A]/50 text-xs group-hover:text-[#BFA14A]/75 transition-colors leading-none">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-[0.14em] font-sans font-medium text-[#F4EFE6]/55 group-hover:text-[#F4EFE6]/80 transition-colors whitespace-nowrap">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Divider + disclaimer */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6"
          >
            <div className="hidden sm:block h-px w-12 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[#BFA14A]/30 text-[10px]">◇</span>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#F4EFE6]/28 font-sans">
                Client-Focused · Non-Diagnostic Wellness Insights
              </p>
              <span className="text-[#BFA14A]/30 text-[10px]">◇</span>
            </div>
            <div className="hidden sm:block h-px w-12 bg-white/10" />
          </motion.div>

          <p className="text-center text-disclaimer text-xs font-sans tracking-wider mt-3">
            For wellness education only. Not a medical service.
          </p>
        </div>
      </section>

      {/* What We Do Overview */}
      <section className="py-24 bg-card relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-[#BFA14A]/[0.03] to-transparent pointer-events-none"
          style={{ y: pillarParallax }}
        />
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">A New Paradigm of Wellness</h2>
            <p className="text-muted-foreground text-lg">
              We offer three core pillars to support your body's natural state of balance. Discover deep insights and restorative support tailored to your unique energetic signature.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                title: "AO Scan Assessments", 
                desc: "Non-invasive, voice-based frequency wellness assessments that provide comprehensive insights into your body's energetic patterns.",
                back: "Your voice carries your body's frequency story. AO Scan technology captures subtle energetic patterns across 400+ data points, revealing what your body is quietly communicating.",
                link: "/ao-scan", 
                cta: "Learn more about AO Scan", 
                testId: "learn-ao-scan",
                icon: "◇"
              },
              { 
                title: "PEMF Therapy", 
                desc: "Pulsed Electromagnetic Field therapy supports cellular balance, natural energy, and your body's restorative rhythms.",
                back: "Like charging a battery, PEMF delivers gentle electromagnetic pulses that help your cells restore their natural frequency — supporting better sleep, recovery, and overall vitality.",
                link: "/pemf-therapy", 
                cta: "Learn more about PEMF", 
                testId: "learn-pemf",
                icon: "◈"
              },
              { 
                title: "BioHarmony Analytics", 
                desc: "Our proprietary reporting layer makes complex wellness data easy to understand with client-friendly interpretations.",
                back: "Raw frequency data means nothing without interpretation. Our AI-powered reports transform complex bioresonance readings into clear, actionable wellness insights you can actually use.",
                link: "/bioharmony-analytics", 
                cta: "Learn more about Analytics", 
                testId: "learn-analytics",
                icon: "◇"
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="flip-card h-full">
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front glass-light p-6 flex flex-col">
                    <div className="text-3xl text-[#BFA14A]/40 mb-3">{item.icon}</div>
                    <h3 className="font-serif text-2xl text-primary mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
                    <p className="text-[#BFA14A]/50 text-xs mt-4 italic">Hover to explore →</p>
                  </div>
                  {/* Back */}
                  <div className="flip-card-back glass-gold p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-2xl text-[#BFA14A]/50 mb-2">↻</div>
                      <h3 className="font-serif text-2xl text-primary mb-3">{item.title}</h3>
                      <p className="text-[#F4EFE6]/80 leading-relaxed text-sm">{item.back}</p>
                    </div>
                    <Button asChild variant="link" className="px-0 mt-4 text-[#BFA14A] hover:text-[#BFA14A]/80" data-testid={item.testId}>
                      <Link href={item.link}>{item.cta} &rarr;</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">This Is for You If…</h2>
            </motion.div>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                "You feel off but can't pinpoint why",
                "You've tried supplements without clear results",
                "You want a more personalized wellness approach",
                "You're open to frequency-based wellness tools"
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex items-start gap-4 p-6 bg-card border border-border/50 rounded-xl shadow-sm">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                  <span className="text-lg text-foreground/90 font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Live Social Proof Counter ── */}
      <section className="relative py-16 bg-gradient-to-r from-[#040A0A] via-[#091515] to-[#040A0A] border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(191,161,74,0.03)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            {[
              { label: "Scans Processed", value: 500, suffix: "+", icon: "⟡" },
              { label: "Active Clients", value: 120, suffix: "+", icon: "◇" },
              { label: "Wellness Reports", value: 350, suffix: "+", icon: "◈" },
              { label: "Years in Practice", value: 30, suffix: "+", icon: "✦" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex flex-col items-center gap-2 p-4"
              >
                <span className="text-2xl text-[#BFA14A]/30">{stat.icon}</span>
                <Counter target={stat.value} />
                <span className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION A: "For Practitioners" dark glass teaser */}
      <section className="bg-gradient-to-br from-[#091515] to-[#0F2A2A] py-24">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} whileHover={{ scale: 1.01 }}
            className="bg-white/5 backdrop-blur-xl border border-[#BFA14A]/20 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(15,92,94,0.2)] text-center space-y-8"
          >
            <div className="space-y-4">
              <p className="text-[#BFA14A] text-sm font-bold tracking-widest uppercase">For AO Scan Practitioners</p>
              <h2 className="text-4xl md:text-5xl font-serif text-[#F4EFE6]">Already Own an AO Scanner?</h2>
              <p className="text-[#F4EFE6]/70 text-lg md:text-xl font-light">We turn your confusing reports into client-ready insights</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4">
              <div className="bg-white/5 border border-[#BFA14A]/30 rounded-full px-5 py-2 text-[#F4EFE6] text-sm">1. Upload</div>
              <div className="text-[#BFA14A] hidden md:block">→</div>
              <div className="text-[#BFA14A] block md:hidden">↓</div>
              <div className="bg-white/5 border border-[#BFA14A]/30 rounded-full px-5 py-2 text-[#F4EFE6] text-sm">2. Interpret</div>
              <div className="text-[#BFA14A] hidden md:block">→</div>
              <div className="text-[#BFA14A] block md:hidden">↓</div>
              <div className="bg-white/5 border border-[#BFA14A]/30 rounded-full px-5 py-2 text-[#F4EFE6] text-sm">3. Deliver</div>
            </div>

            <Button asChild size="lg" className="bg-[#0F5C5E] text-white hover:bg-[#0F5C5E]/90 rounded-full px-8 py-6 h-auto shadow-[0_0_20px_rgba(191,161,74,0.4)] hover:shadow-[0_0_35px_rgba(191,161,74,0.65)] transition-all border-none">
              <Link href="/upload-scan">Upload Your Scan</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* NEW SECTION B: "Why AO Scan Reports Are Confusing" */}
      <section className="bg-[#0A1818] py-24">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F4EFE6]">Why AO Scan Reports Are Confusing</h2>
            <p className="text-[#F4EFE6]/60 text-lg">Most practitioners receive raw data without a clear interpretation layer.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
          >
            {[
              { title: "Overwhelming Data Volume", desc: "AO Scan exports contain hundreds of frequency markers across dozens of body systems — with no plain-language summary." },
              { title: "Technical Jargon", desc: "The reports use bioresonance terminology that even trained practitioners struggle to translate for clients." },
              { title: "No Prioritization", desc: "Without interpretation, clients can't tell which insights are most relevant to their current wellness goals." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border-l-2 border-[#BFA14A] rounded-r-2xl p-8 shadow-lg">
                <h3 className="text-xl font-serif text-[#BFA14A] mb-3">{item.title}</h3>
                <p className="text-[#F4EFE6]/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BEFORE / AFTER COMPARISON */}
      <section className="bg-gradient-to-b from-[#0A1818] to-[#060D0D] py-24">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 max-w-3xl mx-auto space-y-5">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">The BioHarmony Difference</p>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F4EFE6] leading-tight">
              Most People Don't Need More Data.<br className="hidden md:block" /> They Need Someone to Make Sense of It.
            </h2>
            <p className="text-[#F4EFE6]/55 text-lg leading-relaxed">
              AO Scan reports can be incredibly powerful, but without interpretation they often leave people feeling confused instead of supported. BioHarmony translates raw scan data into clear, client-friendly insight.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto">
            {/* Left Panel — BEFORE */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-red-400/60"></div>
                <span className="text-red-400/70 text-xs font-bold tracking-[0.15em] uppercase">Before: Raw AO Scan Data</span>
              </div>
              <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden flex flex-col h-full">
                {/* Label bar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/8 bg-black/20">
                  <div className="text-[#F4EFE6]/35 text-xs font-medium">Example Raw AO Scan Report</div>
                  <div className="ml-auto text-[10px] text-red-400/50 border border-red-400/20 rounded px-1.5 py-0.5 uppercase tracking-wide">Uninterpreted</div>
                </div>

                {/* Real report screenshot collage — slightly dimmed */}
                <div className="relative flex-grow">
                  {/* Main large image — blood/vitals report */}
                  <div className="relative overflow-hidden" style={{ height: "340px" }}>
                    <img
                      src={solexBlood}
                      alt="Raw Solex AO Scan blood report"
                      className="w-full h-full object-cover object-top opacity-95 scale-105"
                      style={{ filter: "saturate(1.0) brightness(1.0)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1818]/50"></div>
                  </div>

                  {/* Mini report thumbnails — 3 across */}
                  <div className="grid grid-cols-3 gap-0 border-t border-white/8">
                    {[
                      { src: solexFood, alt: "Food sensitivity grid" },
                      { src: solexDigestive, alt: "Digestive findings" },
                      { src: solexEmotional, alt: "Emotional vitals page" },
                    ].map((img, i) => (
                      <div key={i} className="relative overflow-hidden" style={{ height: "120px" }}>
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover object-top opacity-90"
                          style={{ filter: "saturate(0.95) brightness(1.0)" }}
                        />
                        {i < 2 && <div className="absolute right-0 top-0 bottom-0 w-px bg-white/8"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-white/8 space-y-3">
                  <p className="text-[#F4EFE6]/35 italic text-xs text-center">
                    "Hundreds of readings. Technical language. Color codes. Charts. No clear explanation of what it means or where to begin."
                  </p>
                  <ul className="grid grid-cols-2 gap-1.5">
                    {["Difficult to understand", "Hard to explain to clients", "Too much raw data", "No clear priority or story"].map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-[#F4EFE6]/30">
                        <div className="w-1 h-1 rounded-full bg-red-400/40 shrink-0"></div>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Right Panel — AFTER */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 px-1">
                <div className="w-2 h-2 rounded-full bg-[#BFA14A]"></div>
                <span className="text-[#BFA14A] text-xs font-bold tracking-[0.15em] uppercase">After: BioHarmony Interpretation</span>
              </div>
              <div className="bg-[#0F5C5E]/15 border border-[#BFA14A]/35 rounded-2xl p-6 md:p-8 flex flex-col h-full shadow-[0_0_50px_rgba(191,161,74,0.12)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#BFA14A]/5 blur-[60px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0F5C5E]/20 blur-[50px] rounded-full pointer-events-none"></div>
                {/* Mock report header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#BFA14A]/15 z-10">
                  <div className="font-serif text-[#BFA14A] text-base">Wellness Insight Report</div>
                  <div className="ml-auto text-[10px] text-[#BFA14A]/60 border border-[#BFA14A]/20 rounded px-1.5 py-0.5">CLIENT-READY</div>
                </div>
                <div className="space-y-5 flex-grow z-10">
                  {/* Insight rows */}
                  <div className="space-y-3">
                    {[
                      { label: "Emotional Stress Patterns", status: "Elevated", color: "text-amber-400/80" },
                      { label: "Digestive System Balance", status: "Needs Attention", color: "text-orange-400/70" },
                      { label: "Energy & Vitality", status: "Within Range", color: "text-emerald-400/70" },
                      { label: "Hormonal Frequency Patterns", status: "Mild Imbalance", color: "text-amber-400/70" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3 border border-white/6">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A] shrink-0"></div>
                          <span className="text-[#F4EFE6]/85 text-sm">{row.label}</span>
                        </div>
                        <span className={`text-xs font-medium ${row.color}`}>{row.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#BFA14A]/15">
                    <p className="text-[#F4EFE6]/50 text-xs mb-3 uppercase tracking-wider">Wellness Focus Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {["Stress Support", "Digestive Balance", "Hormonal Harmony", "Emotional Clarity"].map((tag, i) => (
                        <span key={i} className="bg-[#BFA14A]/12 text-[#BFA14A] border border-[#BFA14A]/25 rounded-full px-3 py-1 text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                    <p className="text-[#F4EFE6]/55 text-xs leading-relaxed italic">
                      "Your scan shows some elevated stress patterns that may be contributing to the digestive sensitivity you've noticed. This is a very common combination — your body is communicating clearly. Here's where we'd suggest focusing first…"
                    </p>
                  </div>
                </div>
                <p className="text-[#BFA14A]/60 italic text-xs mt-5 text-center pt-4 border-t border-[#BFA14A]/10 z-10">
                  "BioHarmony turns the same scan data into a clear, warm, story-style report your client can actually understand."
                </p>
                <ul className="mt-4 space-y-1.5 z-10">
                  {["Clear plain-English explanation", "Connected body-system patterns", "Emotional and energetic insight", "Gentle wellness focus areas", "Client-ready PDF format"].map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#F4EFE6]/55">
                      <div className="w-1 h-1 rounded-full bg-[#BFA14A] shrink-0"></div>{b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Center transformation line + CTA */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mt-14 space-y-6"
          >
            <p className="text-[#F4EFE6]/35 text-sm tracking-widest font-mono">
              Raw data &nbsp;→&nbsp; Connected insight &nbsp;→&nbsp; Client-ready report
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/25 px-8 py-6 h-auto shadow-[0_0_20px_rgba(191,161,74,0.3)] hover:shadow-[0_0_35px_rgba(191,161,74,0.55)] transition-all duration-300"
                data-testid="before-after-upload-cta"
              >
                <Link href="/upload-scan">Upload Your Scan for Interpretation</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-[#BFA14A]/30 text-[#F4EFE6]/75 px-8 py-6 h-auto hover:border-[#BFA14A]/60 hover:text-[#BFA14A] bg-transparent transition-all duration-300"
                data-testid="before-after-sample-report-cta"
              >
                <Link href="/sample-report">View Sample Report</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRACTITIONER SECTION — Stop Sending Confusing Reports */}
      <section className="bg-[#060D0D] py-24 border-t border-white/6">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">For AO Scan Practitioners</p>
              <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6] leading-tight">
                Stop Sending Confusing Reports to Your Clients
              </h2>
              <p className="text-[#F4EFE6]/60 text-lg leading-relaxed">
                If you already use an AO Scanner or Solex system, BioHarmony helps you turn your scan exports into client-ready explanations.
              </p>
              <Button
                asChild
                className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 px-8 py-5 h-auto shadow-[0_0_15px_rgba(191,161,74,0.2)] hover:shadow-[0_0_30px_rgba(191,161,74,0.4)] transition-all duration-300"
                data-testid="home-stop-confusing-practitioner-cta"
              >
                <Link href="/for-practitioners">View Practitioner Plans</Link>
              </Button>
              <p className="text-[#F4EFE6]/25 text-xs italic">
                For wellness education and informational purposes only. Not intended to diagnose, treat, cure, or prevent any disease.
              </p>
            </motion.div>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="space-y-3"
            >
              {[
                "Upload XLSX or PDF reports from your AO Scanner",
                "Receive a clear, plain-English interpretation",
                "Use the report to support your client conversation",
                "Optional white-label formatting available",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-4 bg-white/4 border border-white/8 rounded-xl px-5 py-4 hover:border-[#BFA14A]/20 transition-colors duration-200"
                >
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#BFA14A] shrink-0"></div>
                  <span className="text-[#F4EFE6]/75 text-sm leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* AO Scan Deep Dive */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-background shadow-xl border border-border/50 p-8 flex items-center justify-center">
                <div className="w-full h-full rounded-xl border border-secondary/30 bg-card flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full border-4 border-secondary/20 flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-secondary"></div>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl text-primary">Voice-Based Frequency Assessment</h3>
                  <p className="text-muted-foreground">A 15-second voice sample provides wellness insights across multiple body systems.</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-serif text-primary">Listen to Your Body's Frequencies</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The AO Scan is a non-invasive, voice-based frequency wellness assessment that reads your unique energetic signature.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Using just a 15-second voice sample, the technology identifies energetic patterns across various body systems, providing detailed wellness insights without a single needle or physical intrusion.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                  <span className="text-foreground">Completely non-invasive assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                  <span className="text-foreground">Identifies unique energetic patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                  <span className="text-foreground">Provides actionable wellness insights</span>
                </li>
              </ul>
              <div className="pt-6">
                <Button asChild className="rounded-full" data-testid="section-book-ao">
                  <Link href="/contact">Schedule an AO Scan</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PEMF Therapy Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={pemfVisual} alt="Abstract frequency" className="object-cover w-full h-full mix-blend-overlay" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-serif">Restore Cellular Balance with PEMF</h2>
              <p className="text-lg text-primary-foreground/80 leading-relaxed font-light">
                Pulsed Electromagnetic Field therapy supports your body's restorative rhythms. By delivering targeted electromagnetic frequencies, PEMF encourages natural energy and cellular balance.
              </p>
              <p className="text-lg text-primary-foreground/80 leading-relaxed font-light">
                Experience a deeply relaxing session that works at the energetic level to support overall wellness and vitality.
              </p>
              <div className="pt-6">
                <Button asChild variant="outline" className="rounded-full border-primary-foreground/30 text-foreground hover:bg-primary-foreground hover:text-primary transition-colors" data-testid="section-learn-pemf">
                  <Link href="/pemf-therapy">Discover PEMF Benefits</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BioAnalytics */}
      <section className="py-24 bg-card">
        <div className="container px-4 md:px-6 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-primary">Clarity Over Confusion</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              BioAnalytics is our proprietary reporting layer — by BioHarmony Analytics — that translates complex scan data into clear, actionable insights you can actually use.
            </p>
            <div className="bg-background rounded-2xl p-8 md:p-12 shadow-sm border border-border mt-12">
              <h3 className="text-2xl font-serif text-foreground mb-4">No confusing charts — just clear, actionable wellness insights.</h3>
              <p className="text-muted-foreground mb-8">
                We believe your wellness data belongs to you. Our client-friendly interpretations of energetic patterns ensure you leave your session understanding your body better than ever before.
              </p>
              <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" data-testid="section-view-analytics">
                <Link href="/bioharmony-analytics">View Sample Insights</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#040A0A] border-t border-white/6">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-14">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans mb-3">The Process</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">How It Works</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 relative"
          >
            {/* connector lines — desktop only */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-[#BFA14A]/20 via-[#BFA14A]/40 to-[#BFA14A]/20 z-0" />

            {[
              {
                num: "1",
                icon: "↑",
                title: "Upload Your Scan",
                desc: "Share your AO Scan export or voice recording in under 2 minutes.",
              },
              {
                num: "2",
                icon: "◈",
                title: "BioHarmony Interprets",
                desc: "Our system translates your scan data into a clear, connected wellness story.",
              },
              {
                num: "3",
                icon: "✦",
                title: "Your Report Arrives",
                desc: "Receive a personalized, client-ready report delivered in 24–48 hours.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative z-10 flex flex-col items-center text-center px-6 py-8 group"
              >
                {/* Step circle */}
                <div className="w-[52px] h-[52px] rounded-full border border-[#BFA14A]/30 bg-[#BFA14A]/6 flex items-center justify-center mb-5 group-hover:border-[#BFA14A]/60 group-hover:bg-[#BFA14A]/12 transition-all duration-300 shadow-[0_0_20px_rgba(191,161,74,0.08)]">
                  <span className="text-[#BFA14A] text-base font-serif font-semibold">{step.num}</span>
                </div>
                {/* Icon accent */}
                <span className="text-[#BFA14A]/30 text-xs mb-3 font-sans">{step.icon}</span>
                <h3 className="font-serif text-lg text-[#F4EFE6] mb-2 group-hover:text-[#BFA14A]/90 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-[#F4EFE6]/45 leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pet Scan Showroom ── */}
      <PetShowroom />

      {/* ── Interactive Body Diagram ── */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(27,77,77,0.08)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">Explore Your Body's Frequencies</p>
            <h2 className="text-3xl md:text-4xl font-serif text-primary">What Can AO Scan Reveal?</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-2xl mx-auto">
              Tap any body zone to learn how bioresonance frequency analysis provides
              insights into that system's energetic health.
            </p>
          </motion.div>
          <BodyDiagram />
        </div>
      </section>

      {/* ── Wellness Quiz ── */}
      <section className="py-24 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(191,161,74,0.05)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">Find Your Scan</p>
            <h2 className="text-3xl md:text-4xl font-serif text-primary">What's Your Body Telling You?</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">
              Answer five quick questions and we'll recommend the right AO Scan for your needs.
            </p>
          </motion.div>
          <WellnessQuiz />
        </div>
      </section>

      {/* Individual AO Scans Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">Individual AO Scans</p>
            <h2 className="text-3xl md:text-4xl font-serif text-primary">7 Specialized Scan Programs</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-2xl mx-auto">Choose the single scan that matches what you want to learn — from a quick emotional check to a full-body comprehensive analysis.</p>
            <p className="text-muted-foreground text-xs mt-2">All pricing listed in USD.</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {INDIVIDUAL_SCANS.map((plan) => (
              <motion.div key={plan.id} variants={fadeInUp}>
                <Card className={`h-full flex flex-col transition-all duration-300 ${plan.flagship ? "border-secondary shadow-md ring-1 ring-secondary/30 relative" : "border-border/50 hover:shadow-sm"}`}>
                  {plan.flagship && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      ⭐ Flagship
                    </div>
                  )}
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="font-serif text-lg text-primary leading-tight">{plan.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col text-center pt-0">
                    <div className="text-3xl font-bold text-secondary mb-3">${plan.price}</div>
                    <p className="text-xs text-muted-foreground flex-grow mb-5 px-1 leading-relaxed">{plan.shortDesc}</p>
                    <Button asChild className="w-full rounded-full text-xs" variant={plan.flagship ? "default" : "outline"} size="sm" data-testid={`scan-${plan.id}`}>
                      <Link href={`/upload-scan?plan=${plan.id}`}>Book This Scan</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 bg-background border-b border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">Bundled Packages</p>
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Save with a Package</h2>
            <p className="text-muted-foreground mt-3 text-base max-w-2xl mx-auto">Combine multiple scans, add expert interpretation, or focus on a specific area of wellness.</p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {BUNDLE_PLANS.map((plan) => (
              <motion.div key={plan.id} variants={fadeInUp}>
                <Card className={`h-full flex flex-col transition-all duration-300 ${plan.popular ? "border-secondary shadow-md ring-1 ring-secondary/30 relative" : "border-border/50 hover:shadow-sm"}`}>
                  {plan.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                      ⭐ {plan.badge}
                    </div>
                  )}
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="font-serif text-lg text-primary leading-tight">{plan.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col text-center pt-0">
                    <div className="text-3xl font-bold text-secondary mb-3">${plan.price}</div>
                    <p className="text-xs text-muted-foreground mb-3 px-1 leading-relaxed">{plan.shortDesc}</p>
                    {plan.includes && (
                      <ul className="text-[11px] text-muted-foreground/80 space-y-1 mb-5 text-left flex-grow">
                        {plan.includes.map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-secondary shrink-0">✓</span>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button asChild className="w-full rounded-full text-xs" variant={plan.popular ? "default" : "outline"} size="sm" data-testid={`package-${plan.id}`}>
                      <Link href={`/upload-scan?plan=${plan.id}`}>Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Client Memberships ── */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mt-20">
            <div className="text-center mb-12">
              <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">Ongoing Wellness</p>
              <h3 className="text-2xl md:text-3xl font-serif text-primary">BioHarmony Membership</h3>
              <p className="text-muted-foreground mt-2 text-sm max-w-xl mx-auto">
                Consistent insight, month after month — with member-only scan discounts.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {MEMBERSHIP_PLANS.map((plan) => (
                <motion.div key={plan.id} variants={fadeInUp} className="h-full">
                  <Card className={`h-full flex flex-col border transition-all duration-300 ${
                    plan.popular
                      ? "border-secondary shadow-md ring-1 ring-secondary/30 relative scale-[1.03] z-10"
                      : "border-border/50 hover:shadow-sm"
                  }`}>
                    {plan.badge && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap z-10 shadow-sm">
                        {plan.badge}
                      </div>
                    )}
                    <CardHeader className={`text-center pb-4 ${plan.popular ? "pt-10" : "pt-8"}`}>
                      <CardTitle className="font-serif text-xl text-primary">{plan.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col text-center pt-0 px-6 pb-8">
                      <div className="text-4xl font-bold text-secondary mb-1">
                        ${plan.price}<span className="text-base text-muted-foreground font-normal">/mo</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 mb-6">{plan.shortDesc}</p>
                      <ul className="text-xs text-muted-foreground/80 flex-grow space-y-3 mb-8 text-left px-2">
                        {plan.highlight_features?.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-secondary shrink-0 mt-0.5">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className="w-full rounded-full text-xs mt-auto" variant={plan.popular ? "default" : "outline"} size="sm" data-testid={`membership-${plan.id}`}>
                        <Link href="/contact">Join {plan.label}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-[11px] text-muted-foreground/60">Memberships billed monthly in USD. Cancel anytime.</p>
            </div>
          </motion.div>

          {/* Pet Scans subsection */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mt-20">
            <div className="text-center mb-8">
              <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">For Your Animal Companions</p>
              <h3 className="text-2xl md:text-3xl font-serif text-primary">Pet Wellness Scans</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              {PET_PLANS.map((plan) => (
                <Card key={plan.id} className="border-border/50 hover:shadow-sm transition-all">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="font-serif text-lg text-primary">{plan.label}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="text-3xl font-bold text-secondary mb-3">${plan.price}</div>
                    <p className="text-xs text-muted-foreground mb-5 px-1 leading-relaxed">{plan.shortDesc}</p>
                    <Button asChild className="w-full rounded-full text-xs" variant="outline" size="sm" data-testid={`pet-${plan.id}`}>
                      <Link href={`/upload-scan?plan=${plan.id}&type=pet_scan`}>Book Pet Scan</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground/70 italic mt-12 max-w-3xl mx-auto leading-relaxed">
            {PRICING_DISCLAIMER}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Other Assessments & Services</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Inner Voice Scan", desc: "Emotional wellness scan using voice frequency analysis." },
              { title: "Vitals Scan", desc: "Core wellness indicators for a snapshot of your energetic wellbeing." },
              { title: "Comprehensive Scan", desc: "Full-spectrum energetic assessment across body systems." },
              { title: "Pet Scan", desc: "Frequency-based wellness support tailored for your animals." },
              { title: "Practitioner Review", desc: "Expert interpretation session with Kathy to walk through your results." }
            ].map((service, i) => (
              <Card key={i} className="border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-secondary/30 bg-secondary/5 shadow-sm flex items-center justify-center p-6">
              <Button asChild variant="ghost" className="text-secondary-foreground hover:bg-secondary/10 hover:text-secondary-foreground text-lg h-auto py-4">
                <Link href="/contact">Book a Service &rarr;</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#040A0A] border-t border-white/8">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-14">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans mb-3">Client Experiences</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">What Clients Are Saying</h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                quote: "I finally understood what my body was trying to tell me. After years of feeling off, this gave me actual clarity.",
                name: "Sarah M.",
                tag: "Wellness Client",
                stars: 5,
              },
              {
                quote: "The report made everything make sense. I could see exactly where my body needed support, and for the first time, I knew what to do.",
                name: "James T.",
                tag: "AO Scan Client",
                stars: 5,
              },
              {
                quote: "This gave me clarity I haven't found anywhere else. The process was simple, and the insights were profound.",
                name: "Elena R.",
                tag: "Frequency Wellness Client",
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex flex-col bg-white/[0.03] border border-white/8 rounded-2xl p-7 hover:border-[#BFA14A]/20 hover:bg-white/[0.045] transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="text-[#BFA14A]/70 text-xs">★</span>
                  ))}
                </div>
                {/* Quote */}
                <p className="font-serif text-[#F4EFE6]/72 text-[15px] leading-relaxed italic flex-grow mb-6">
                  "{t.quote}"
                </p>
                {/* Attribution */}
                <div className="border-t border-white/8 pt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F4EFE6]/65">— {t.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#BFA14A]/45 font-sans">{t.tag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center text-[10px] text-[#F4EFE6]/20 font-sans tracking-wider mt-8"
          >
            Client experiences are individual and may vary. These are illustrative accounts shared with permission.
          </motion.p>

        </div>
      </section>

      {/* Wellness Library */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-primary">Wellness Library</h2>
            <p className="text-muted-foreground mt-3">Deepen your understanding of frequency-based wellness.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "What Is an AO Scan?", tag: "AO Scan Basics", excerpt: "Learn how voice-based frequency analysis provides wellness insights across multiple body systems without any invasive procedures." },
              { title: "How PEMF Supports the Body", tag: "PEMF Education", excerpt: "Explore how Pulsed Electromagnetic Field therapy works with your body's natural rhythms to support cellular balance and vitality." },
              { title: "Understanding Frequency-Based Wellness", tag: "Frequency Wellness", excerpt: "A foundational guide to how frequency-based wellness tools read your body's energetic patterns and what that means for your wellbeing." }
            ].map((article, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Card className="h-full border-border/50 bg-card shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">{article.tag}</div>
                    <h3 className="font-serif text-lg text-primary mb-3">{article.title}</h3>
                    <p className="text-sm text-muted-foreground flex-grow mb-6">{article.excerpt}</p>
                    <a href="#" className="text-sm font-medium text-primary hover:text-secondary transition-colors mt-auto inline-flex items-center">
                      Read more &rarr;
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaser A - Practitioner Section */}
      <section className="py-24 bg-gradient-to-br from-[#091515] to-[#0F2A2A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(191,161,74,0.06)_0%,_transparent_60%)] pointer-events-none"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">For AO Scan Practitioners</p>
              <h2 className="text-3xl md:text-5xl font-serif text-[#F4EFE6]">Are You an AO Scan Practitioner?</h2>
              <p className="text-lg text-[#F4EFE6]/65 leading-relaxed font-light">
                BioHarmony helps Solex users turn scan data into client-ready reports.
              </p>
              <h3 className="text-2xl font-serif text-[#BFA14A] italic mt-2">You scan. We interpret.</h3>
              <div className="pt-4">
                <Button asChild className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 px-8 py-5 h-auto shadow-[0_0_15px_rgba(191,161,74,0.2)] hover:shadow-[0_0_30px_rgba(191,161,74,0.45)] transition-all duration-300" data-testid="home-practitioner-cta">
                  <Link href="/for-practitioners">See Practitioner Plans</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teaser B - Pet Scans */}
      <section className="py-24 bg-[#060D0D] border-t border-white/6">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">Species-Specific Wellness</p>
              <h2 className="text-3xl md:text-5xl font-serif text-[#F4EFE6]">Wellness Scans for Pets Too</h2>
              <p className="text-lg text-[#F4EFE6]/60 leading-relaxed">
                Dogs, cats, and horses can benefit from frequency-based wellness support.
              </p>
              <p className="text-xl font-serif text-[#BFA14A] italic">
                "When your pet isn't acting like themselves, there's always a reason."
              </p>
              <div className="mt-4 mb-4 inline-block bg-white/5 border border-[#BFA14A]/20 rounded-2xl px-8 py-4 shadow-[0_0_20px_rgba(191,161,74,0.08)]">
                <p className="text-[#F4EFE6]/80 font-medium">Pet Wellness Scan — <span className="text-[#BFA14A]">$150 USD</span></p>
              </div>
              <div className="pt-2">
                <Button asChild className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 px-8 py-5 h-auto shadow-[0_0_15px_rgba(191,161,74,0.2)] hover:shadow-[0_0_30px_rgba(191,161,74,0.4)] transition-all duration-300" data-testid="home-pets-cta">
                  <Link href="/pet-scans">Explore Pet Scans</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scan-first positioning */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Choose the scan or package that fits your wellness journey. No subscriptions required — pay per scan.
              </p>
              <div className="pt-6">
                <Button asChild variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5">
                  <Link href="/upload-scan">Book Your Scan</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif">Ready to understand your body on a deeper level?</h2>
            <p className="text-xl text-primary-foreground/80 font-light">
              Discover the profound insights waiting within your own frequency.
            </p>
            <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 text-lg px-10 py-6 h-auto mt-4 shadow-xl" data-testid="bottom-cta-book">
              <Link href="/contact">Start Your Scan Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Client Wall of Gratitude ── */}
      <ClientWall />
    </div>
  );
}
