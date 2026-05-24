import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

export default function Membership() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-card border-b border-border overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight">
              Ongoing Wellness Support
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
              Consistent insight. Month after month.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              { 
                name: "Basic", price: "$97", period: "/month", 
                includes: ["1 scan per month", "Standard processing", "Access to client portal"],
                cta: "Start Basic", popular: false 
              },
              { 
                name: "Pro", price: "$197", period: "/month", badge: "Most Popular", 
                includes: ["2 scans per month", "Priority processing", "Access to client portal", "Monthly wellness check-in note"],
                cta: "Start Pro", popular: true 
              },
              { 
                name: "Elite", price: "$297", period: "/month", 
                includes: ["1-on-1 live review of your AO Scan results — coming soon", "Session with a wellness practitioner", "Personalized wellness roadmap", "Priority support", "Delivered within 24–48 hours", "Access to client portal"],
                cta: "Start Elite", popular: false 
              }
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className={`h-full flex flex-col transition-all duration-300 ${plan.popular ? 'border-secondary shadow-md ring-1 ring-secondary/20 relative scale-105 z-10' : 'border-border/50 hover:shadow-sm'}`}>
                  {plan.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {plan.badge}
                    </div>
                  )}
                  <CardHeader className="text-center pb-6 pt-10">
                    <CardTitle className="font-serif text-2xl text-primary">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col text-center pt-0">
                    <div className="text-5xl font-bold text-foreground mb-1">{plan.price}<span className="text-lg text-muted-foreground font-normal">{plan.period}</span></div>
                    <ul className="text-base text-muted-foreground flex-grow my-8 space-y-4 text-left px-4">
                      {plan.includes.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild size="lg" className="w-full rounded-full mt-auto" variant={plan.popular ? "default" : "outline"} data-testid={`membership-plan-${plan.name.toLowerCase()}`}>
                      <Link href="/contact">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground">All memberships are billed monthly in USD. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Membership FAQs</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-serif text-lg">Can I cancel anytime?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Yes, all memberships are month-to-month. Cancel anytime with no penalties.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-serif text-lg">What counts as a scan?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Each scan is a voice-based AO Scan assessment. You choose which type each month.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-serif text-lg">Can I upgrade or downgrade?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Yes, you can change your plan at any time. Changes take effect at the next billing cycle.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif">Not sure which plan is right for you?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto font-light">
              Let's find the best approach for your ongoing wellness goals.
            </p>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 h-auto text-foreground hover:bg-primary-foreground hover:text-primary transition-colors border-primary-foreground/30" data-testid="book-discovery-call">
              <Link href="/contact">Book a free discovery call with Kathy</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
