import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary leading-[1.1]">
              Decode Your Body's Wellness Signals
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
              BioHarmony Solutions blends frequency-based wellness tools, AO Scan insights, PEMF therapy, and client-friendly reporting to help you understand your body in a deeper, more personalized way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full text-base px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all" data-testid="hero-book-scan">
                <Link href="/contact">Book an AO Scan</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full text-base px-8 py-6 h-auto border-secondary text-secondary-foreground hover:bg-secondary/10 bg-background/50 backdrop-blur-sm transition-all" data-testid="hero-explore-pemf">
                <Link href="/pemf-therapy">Explore PEMF Therapy</Link>
              </Button>
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

      {/* AO Scan Deep Dive */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card/50 shadow-xl border border-border/50 p-8 flex items-center justify-center">
                <div className="w-full h-full rounded-xl border border-secondary/30 bg-background flex flex-col items-center justify-center p-8 text-center space-y-6">
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
              { step: "02", title: "Provide a Voice Sample", desc: "Submit a simple 15-second voice recording." },
              { step: "03", title: "Receive Your Report", desc: "Get a clear, client-friendly BioHarmony Analytics report." },
              { step: "04", title: "Review with Kathy", desc: "Optional expert session to walk through your results." }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 bg-background border border-border rounded-2xl p-6 shadow-sm text-center">
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

      {/* Services */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Assessments & Services</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Inner Voice Scan", desc: "Emotional wellness scan using voice frequency analysis." },
              { title: "Vitals Scan", desc: "Core wellness indicators for a snapshot of your energetic wellbeing." },
              { title: "Comprehensive Scan", desc: "Full-spectrum energetic assessment across body systems." },
              { title: "Pet Scan", desc: "Frequency-based wellness support tailored for your animals." },
              { title: "Practitioner Review", desc: "Expert interpretation session with Kathy to walk through your results." }
            ].map((service, i) => (
              <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
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
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Client Experiences</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "The insights I gained from the Inner Voice scan gave me profound clarity. It was like reading a map of my own stress patterns. Kathy's calm approach made the whole process beautiful.", name: "Sarah M." },
              { quote: "BioHarmony's reporting is unlike anything else. I finally understood what the energetic data was trying to tell me, and it helped me find a better sense of balance in my daily life.", name: "James T." },
              { quote: "PEMF therapy sessions here are my sanctuary. It's an hour of deep rest, and I always leave feeling more aligned and supported.", name: "Elena R." }
            ].map((test, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Card className="h-full bg-card border-none shadow-md p-6">
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

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif">Ready to Begin Your Wellness Journey?</h2>
            <p className="text-xl text-primary-foreground/80 font-light">
              Discover the profound insights waiting within your own frequency.
            </p>
            <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 text-lg px-10 py-6 h-auto mt-4 shadow-xl" data-testid="bottom-cta-book">
              <Link href="/contact">Book a Session</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
