import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

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

export default function ForPractitioners() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
              For AO Scan Practitioners & Solex Users
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed font-light">
              If you already use an AO Scanner but don't fully understand the reports, BioHarmony translates your scan data into clear, client-friendly insights you can confidently share.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Positioning Block */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-secondary italic">
              You scan. We interpret.
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Practitioner Plans</h2>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {[
              { 
                name: "Practitioner Access", price: "$29", period: "/month", badge: "Entry Plan", 
                includes: ["Upload portal access (XLSX & PDF)", "Dashboard access", "Submit reports for interpretation", "Discounted report pricing"],
                note: "This plan provides access only. Reports are purchased separately or in bundles.",
                cta: "Get Started", popular: false 
              },
              { 
                name: "Single Report", price: "$49", period: "/report", badge: "Pay As You Go", 
                includes: ["One full report interpretation", "Client-ready formatting", "Delivered in 24–48 hours"],
                cta: "Order a Report", popular: false 
              },
              { 
                name: "Starter Bundle", price: "$145", period: "/month", badge: "Best Value", 
                includes: ["Up to 5 reports per month (~$29/report effective)", "All features of Practitioner Access"],
                cta: "Choose Starter", popular: true 
              },
              { 
                name: "Growth Bundle", price: "$270", period: "/month", badge: "For Active Practitioners", 
                includes: ["Up to 10 reports per month (~$27/report effective)", "All features of Practitioner Access"],
                cta: "Choose Growth", popular: false 
              }
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className={`h-full flex flex-col transition-all duration-300 ${plan.popular ? 'border-secondary shadow-md ring-1 ring-secondary/20 relative' : 'border-border/50 hover:shadow-sm'}`}>
                  {plan.badge && (
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${plan.popular ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {plan.badge}
                    </div>
                  )}
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="font-serif text-xl text-primary">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col text-center pt-0">
                    <div className="text-4xl font-bold text-foreground mb-1">{plan.price}<span className="text-lg text-muted-foreground font-normal">{plan.period}</span></div>
                    <ul className="text-sm text-muted-foreground flex-grow mb-6 mt-6 space-y-3 text-left">
                      {plan.includes.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.note && <p className="text-xs text-muted-foreground mb-6 italic">{plan.note}</p>}
                    <Button asChild className="w-full rounded-full mt-auto" variant={plan.popular ? "default" : "outline"} data-testid={`practitioner-plan-${plan.name.replace(/\s+/g, '-').toLowerCase()}`}>
                      <Link href="/contact">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Bundles offer discounted pricing for active practitioners. All pricing in USD.</p>
          </div>
        </div>
      </section>

      {/* White Label Add-on */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-2xl mx-auto">
            <Card className="border-secondary/30 bg-secondary/5 shadow-sm">
              <CardContent className="p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-left space-y-2">
                  <h3 className="font-serif text-2xl text-primary">White Label Add-On — $97/month</h3>
                  <p className="text-muted-foreground">Includes: Your branding on reports, Client-ready PDF formatting, Professional presentation</p>
                </div>
                <Button asChild className="rounded-full shrink-0" data-testid="add-white-label">
                  <Link href="/contact">Add White Label</Link>
                </Button>
              </CardContent>
            </Card>
            <p className="text-center text-xs text-muted-foreground italic mt-6">To ensure quality and fair use, all plans include monthly report limits.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container px-4 md:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Ready to grow your practice?</h2>
            <Button asChild size="lg" className="rounded-full px-8 py-6 h-auto shadow-md" data-testid="start-practitioner-plan">
              <Link href="/contact">Start Your Practitioner Plan</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
