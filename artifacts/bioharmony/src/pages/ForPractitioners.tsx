import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PRACTITIONER_PLANS } from "@/lib/pricing";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function ForPractitioners() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">
            For Practitioners
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-4">
            Scale Your Wellness Practice
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-center mb-14"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            You already run the scans. Let BioHarmony turn them into beautiful,
            professional AI-powered client reports —{" "}
            <strong className="text-primary">with no limit on how many you process</strong>.
            No caps, no quotas. Just unlimited interpretation.
          </p>
          <p className="text-muted-foreground/60 text-xs mt-3">
            Note: You still need your own Solex AO Scan subscription to run scans.
            BioHarmony is your interpretation and reporting partner.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRACTITIONER_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="h-full"
            >
              <Card
                className={`h-full flex flex-col border transition-all duration-300 cursor-pointer ${
                  selected === plan.id
                    ? "border-secondary shadow-md ring-1 ring-secondary/30"
                    : plan.popular
                    ? "border-secondary shadow-md ring-1 ring-secondary/30 relative scale-[1.03] z-10"
                    : "border-border/50 hover:shadow-sm"
                }`}
                onClick={() => setSelected(plan.id)}
              >
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap z-10 shadow-sm">
                    {plan.badge}
                  </div>
                )}
                <CardHeader
                  className={`text-center pb-4 ${plan.popular ? "pt-10" : "pt-8"}`}
                >
                  <CardTitle className="font-serif text-xl text-primary">
                    {plan.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col text-center pt-0 px-6 pb-8">
                  <div className="text-4xl font-bold text-secondary mb-1">
                    ${plan.price}<span className="text-base text-muted-foreground font-normal">/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 mb-6">
                    {plan.shortDesc}
                  </p>
                  <ul className="text-xs text-muted-foreground/80 flex-grow space-y-3 mb-8 text-left px-2">
                    {plan.highlight_features?.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-secondary shrink-0 mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full rounded-full text-xs mt-auto"
                    variant={plan.popular ? "default" : "outline"}
                    size="sm"
                  >
                    <a href="/contact">Choose {plan.label}</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 border-t border-border/50 pt-16"
        >
          <h2 className="text-2xl font-serif text-primary text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                title: "1. Run the Scan",
                desc: "Use your Solex AO Scan device to run scans on your clients as usual — any type, any number.",
              },
              {
                title: "2. Upload to BioHarmony",
                desc: "Upload the AO Scan export PDF. We process it through our AI interpretation engine.",
              },
              {
                title: "3. Receive Client Report",
                desc: "Get a beautiful, comprehensive narrative report back — white-label ready — to deliver to your client.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-secondary font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="font-serif text-lg text-primary mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 border-t border-border/50 pt-16"
        >
          <h2 className="text-2xl font-serif text-primary text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="font-serif text-base text-primary mb-1">
                Do I still need my Solex subscription?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. BioHarmony is an interpretation & reporting service. You need your own
                Solex AO Scan subscription ($149/mo) to perform the actual scans. We take
                the scan data you upload and turn it into a polished, client-ready report.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-base text-primary mb-1">
                Is there really no limit on report processing?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                None. Every practitioner plan includes unlimited uploads and report processing.
                We believe in supporting your practice, not capping it.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-base text-primary mb-1">
                Can my clients see their own reports?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Yes. Every report comes with a shareable client portal link so your clients can
                revisit their results, track progress, and schedule follow-ups.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-base text-primary mb-1">
                What scan types are supported?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Body Systems, Vitals, Dental, TMJ, Inner Voice, AO Mindsync, Pet (if you have
                access through Solex). The Elite plan unlocks all scan types including Dental,
                TMJ, and Pet processing.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-base text-primary mb-1">
                Can I white-label reports?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Growth and Elite plans include full white-label branding. Reports will
                feature your business name, logo, and contact info instead of BioHarmony's.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-serif text-primary mb-3">
            Ready to simplify your reporting?
          </h2>
          <p className="text-xs text-muted-foreground mb-6 max-w-md mx-auto">
            Start with any plan. Upgrade anytime — no lock-in, no limits.
          </p>
          <Button asChild size="lg" className="rounded-full px-8">
            <a href="/contact">Get Started</a>
          </Button>
          <p className="text-[11px] text-muted-foreground/50 mt-4">
            All plans billed monthly in USD. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
