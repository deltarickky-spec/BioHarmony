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
    <div className="flex flex-col min-h-screen bg-[#0A1818]">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#091515] via-[#0F2A2A] to-[#091515] text-[#F4EFE6] overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <p className="text-[#BFA14A] text-sm font-bold tracking-widest uppercase">For Professionals</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
              For AO Scan Practitioners & Solex Users
            </h1>
            <p className="text-lg md:text-xl text-[#F4EFE6]/70 leading-relaxed font-light">
              If you already use an AO Scanner but don't fully understand the reports, BioHarmony translates your scan data into clear, client-friendly insights you can confidently share.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Positioning Block */}
      <section className="py-24 bg-[#0A1818]">
        <div className="container px-4 md:px-6 relative">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center relative flex items-center justify-center"
          >
            <div className="hidden md:block w-1/4 h-px bg-gradient-to-r from-transparent to-[#BFA14A]/30"></div>
            <h2 className="text-5xl md:text-6xl font-serif text-[#BFA14A] italic px-8">
              You scan. We interpret.
            </h2>
            <div className="hidden md:block w-1/4 h-px bg-gradient-to-l from-transparent to-[#BFA14A]/30"></div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-[#0A1818] border-y border-white/5">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Practitioner Plans</h2>
            <p className="text-[#F4EFE6]/60 text-lg">Choose a plan that fits your practice volume.</p>
          </motion.div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {[
              { 
                name: "Starter", price: "$29", period: "/month",
                includes: ["5 reports per month", "Upload portal access", "Client-ready formatting", "Priority support"],
                cta: "Choose Starter", popular: false 
              },
              { 
                name: "Growth", price: "$49", period: "/month",
                includes: ["10 reports per month", "Upload portal access", "Client-ready formatting", "Priority support"],
                cta: "Choose Growth", popular: true 
              },
              { 
                name: "Unlimited + White Label", price: "$97", period: "/month",
                includes: ["Unlimited reports", "Your branding on reports", "Custom portal setup", "Dedicated account manager"],
                cta: "Choose Unlimited", popular: false 
              }
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                <Card className={`h-full flex flex-col bg-transparent text-[#F4EFE6] transition-all duration-300 
                  ${plan.popular 
                    ? 'bg-[#0F5C5E]/20 backdrop-blur-md border-[#BFA14A]/50 shadow-[0_0_40px_rgba(191,161,74,0.2)]' 
                    : 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20'
                  } rounded-2xl`}>
                  <CardHeader className="text-center pb-4 pt-8">
                    <CardTitle className="font-serif text-2xl text-[#F4EFE6]">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col text-center pt-0 px-8 pb-8">
                    <div className="text-5xl font-bold text-[#BFA14A] mb-1">
                      {plan.price}
                      <span className="text-xl text-[#F4EFE6]/50 font-normal">{plan.period}</span>
                    </div>
                    <ul className="text-sm text-[#F4EFE6]/70 flex-grow mb-8 mt-8 space-y-4 text-left">
                      {plan.includes.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#BFA14A] shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className={`w-full rounded-full transition-all border-none mt-auto ${
                        plan.popular 
                          ? "bg-[#0F5C5E] text-white shadow-[0_0_20px_rgba(191,161,74,0.4)] hover:shadow-[0_0_30px_rgba(191,161,74,0.6)]" 
                          : "bg-transparent border border-white/20 text-[#F4EFE6] hover:bg-white/10"
                      }`}
                      variant="outline"
                      data-testid={`practitioner-plan-${plan.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <Link href="/contact">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-12 text-center">
            <p className="text-sm text-[#F4EFE6]/50">Bundles offer discounted pricing for active practitioners. All pricing in USD.</p>
          </div>
        </div>
      </section>

      {/* White Label Add-on Banner */}
      <section className="py-12 bg-[#0A1818]">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border-l-4 border-[#BFA14A] border-y border-r border-white/10 rounded-r-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left space-y-2">
                <h3 className="font-serif text-xl text-[#BFA14A]">Looking for White Label Only?</h3>
                <p className="text-[#F4EFE6]/70 text-sm">Add white label branding to any Starter or Growth plan for $49/mo.</p>
              </div>
              <Button asChild className="rounded-full shrink-0 bg-transparent border border-[#BFA14A]/50 text-[#BFA14A] hover:bg-[#BFA14A]/10" data-testid="add-white-label">
                <Link href="/contact">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-[#0A1818]">
        <div className="container px-4 md:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F4EFE6]">Ready to grow your practice?</h2>
            <Button asChild size="lg" className="rounded-full px-10 py-7 h-auto text-lg border-none bg-[#0F5C5E] text-white shadow-[0_0_20px_rgba(191,161,74,0.4)] hover:shadow-[0_0_30px_rgba(191,161,74,0.6)] transition-all" data-testid="start-practitioner-plan">
              <Link href="/contact">Start Your Practitioner Plan</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
