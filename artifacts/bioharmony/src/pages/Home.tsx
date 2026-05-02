import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import pemfVisual from "@/assets/pemf-visual.png";

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
