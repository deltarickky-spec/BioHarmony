import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MEMBERSHIP_PLANS } from "@/lib/pricing";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function Membership() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="text-secondary text-xs uppercase tracking-[0.2em] font-sans mb-3">
            Ongoing Wellness
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-4">
            BioHarmony Membership
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Consistent insight, month after month. Get member-only scan discounts and priority processing.
          </p>
        </motion.div>

        {/* Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MEMBERSHIP_PLANS.map((plan, i) => (
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
                    <a href="/contact">Join {plan.label}</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Membership Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-[11px] text-muted-foreground/60">
            Memberships billed monthly in USD. Cancel anytime.
          </p>
          <p className="text-[11px] text-muted-foreground/50 mt-2 max-w-xl mx-auto leading-relaxed">
            Membership covers scan processing and report delivery. You receive your
            report(s) via email within the stated processing window each month.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
