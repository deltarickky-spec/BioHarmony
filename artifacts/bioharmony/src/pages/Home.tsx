import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import pemfVisual from "@/assets/pemf-visual.png";
import solexBlood from "@/assets/solex-report-blood.png";
import solexChakra from "@/assets/solex-report-chakra.png";
import solexDigestive from "@/assets/solex-report-digestive.png";
import solexFood from "@/assets/solex-report-food.png";
import solexEmotional from "@/assets/solex-report-emotional.png";

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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="Abstract wellness atmosphere" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/30"></div>
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
                <Button asChild size="lg" className="rounded-full text-base px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all" data-testid="hero-book-scan">
                  <Link href="/contact">Start Your Personalized Scan</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground italic ml-2 mt-1">Takes 2 minutes • No guesswork • Delivered in 24–48 hours</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Overview */}
      <section className="py-24 bg-card">
        <div className="container px-4 md:px-6">
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
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow bg-background">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">AO Scan Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Non-invasive, voice-based frequency wellness assessments that provide comprehensive insights into your body's energetic patterns.
                  </p>
                  <Button asChild variant="link" className="px-0 mt-4 text-secondary-foreground" data-testid="learn-ao-scan">
                    <Link href="/ao-scan">Learn more about AO Scan &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow bg-background">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">PEMF Therapy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Pulsed Electromagnetic Field therapy supports cellular balance, natural energy, and your body's restorative rhythms.
                  </p>
                  <Button asChild variant="link" className="px-0 mt-4 text-secondary-foreground" data-testid="learn-pemf">
                    <Link href="/pemf-therapy">Learn more about PEMF &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow bg-background">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-primary">BioHarmony Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Our proprietary reporting layer makes complex wellness data easy to understand with client-friendly interpretations.
                  </p>
                  <Button asChild variant="link" className="px-0 mt-4 text-secondary-foreground" data-testid="learn-analytics">
                    <Link href="/bioharmony-analytics">Learn more about Analytics &rarr;</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
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
                      className="w-full h-full object-cover object-top opacity-60 scale-105"
                      style={{ filter: "saturate(0.7) brightness(0.85)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A1818]/80"></div>
                  </div>

                  {/* Mini report thumbnails — 3 across */}
                  <div className="grid grid-cols-3 gap-0 border-t border-white/8">
                    {[
                      { src: solexFood, alt: "Food sensitivity grid" },
                      { src: solexDigestive, alt: "Digestive findings" },
                      { src: solexEmotional, alt: "Emotional vitals page" },
                    ].map((img, i) => (
                      <div key={i} className="relative overflow-hidden" style={{ height: "100px" }}>
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover object-top opacity-55"
                          style={{ filter: "saturate(0.6) brightness(0.8)" }}
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
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/25 px-8 py-6 h-auto shadow-[0_0_20px_rgba(191,161,74,0.3)] hover:shadow-[0_0_35px_rgba(191,161,74,0.55)] transition-all duration-300"
              data-testid="before-after-upload-cta"
            >
              <Link href="/upload-scan">Upload Your Scan for Interpretation</Link>
            </Button>
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

      {/* BioHarmony Analytics */}
      <section className="py-24 bg-card">
        <div className="container px-4 md:px-6 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-primary">Clarity Over Confusion</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              BioHarmony Analytics is our proprietary reporting layer that translates complex AO Scan results into a format you can actually use.
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
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Your Wellness Journey</h2>
            <p className="text-muted-foreground mt-4 text-lg">A simple, seamless process designed for your comfort.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            {[
              { step: "01", title: "Choose Your Scan", desc: "Select the wellness assessment that fits your current goals." },
              { step: "02", title: "Submit a Voice Sample", desc: "Submit a simple 15-second voice recording." },
              { step: "03", title: "We Analyze Your Energetic Patterns", desc: "Our technology identifies your unique frequency signature." },
              { step: "04", title: "Receive a Personalized Report", desc: "Get a clear, client-friendly BioHarmony Analytics report." }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground mt-4 text-lg">Choose the wellness assessment that's right for you.</p>
            <p className="text-muted-foreground text-sm mt-2">All pricing listed in USD.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { name: "Inner Voice Scan", price: "$55", desc: "Emotional wellness insights through voice frequency analysis", popular: false },
              { name: "Food Sensitivity", price: "$44", desc: "Identify energetic patterns related to food sensitivities", popular: false },
              { name: "Comprehensive Scan", price: "$99", desc: "Full-spectrum energetic assessment across body systems", popular: true },
              { name: "Ultimate Experience", price: "$133", desc: "Our most complete wellness journey — all scans included", popular: false }
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className={`h-full flex flex-col transition-all duration-300 ${plan.popular ? 'border-secondary shadow-md ring-1 ring-secondary/20 relative' : 'border-border/50 hover:shadow-sm'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="font-serif text-xl text-primary">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col text-center pt-0">
                    <div className="text-4xl font-bold text-secondary mb-4">{plan.price}</div>
                    <p className="text-sm text-muted-foreground flex-grow mb-8 px-2">{plan.desc}</p>
                    <Button asChild className="w-full rounded-full" variant={plan.popular ? "default" : "outline"} data-testid={`pricing-card-${plan.name.replace(/\s+/g, '-').toLowerCase()}`}>
                      <Link href="/contact">Select & Continue</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
      <section className="py-24 bg-card border-t border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Client Experiences</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "I finally understood what my body was trying to tell me. After years of feeling off, this gave me actual clarity.", name: "Sarah M., Wellness Client" },
              { quote: "The report made everything make sense. I could see exactly where my body needed support, and for the first time, I knew what to do.", name: "James T., Frequency Wellness Client" },
              { quote: "This gave me clarity I haven't found anywhere else. The process was simple, and the insights were profound.", name: "Elena R., AO Scan Client" }
            ].map((test, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Card className="h-full bg-background border-border/50 shadow-sm p-6">
                  <CardContent className="p-0 flex flex-col h-full">
                    <p className="text-muted-foreground italic flex-grow mb-6">"{test.quote}"</p>
                    <p className="font-serif text-primary font-medium">— {test.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
                <p className="text-[#F4EFE6]/80 font-medium">Pet Wellness Scan — <span className="text-[#BFA14A]">$55 USD</span></p>
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

      {/* Teaser C - Memberships */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-3xl md:text-5xl font-serif text-primary">Ongoing Wellness Support</h2>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Subscribe for consistent, month-after-month wellness insights.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 mt-8 mb-8 text-foreground font-medium">
                <span>Basic $97/mo</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-primary">Pro $197/mo</span>
                <span className="text-muted-foreground">•</span>
                <span>Elite $297/mo</span>
              </div>
              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-full border-primary/20 hover:bg-primary/5" data-testid="home-membership-cta">
                  <Link href="/membership">View Membership Plans</Link>
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
    </div>
  );
}
