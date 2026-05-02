import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import pemfVisual from "@/assets/pemf-visual.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function PEMFTherapy() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={pemfVisual} alt="Abstract frequency" className="object-cover w-full h-full mix-blend-overlay" />
        </div>
        <div className="container relative z-10 px-4 md:px-6 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif">PEMF Therapy</h1>
            <p className="text-xl text-primary-foreground/80 font-light leading-relaxed">
              Support your cellular balance and natural energy with Pulsed Electromagnetic Field therapy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-serif text-primary mb-6">What is PEMF?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Pulsed Electromagnetic Field (PEMF) therapy is a restorative approach that introduces low-frequency electromagnetic waves to the body. These gentle pulses safely pass through skin and tissue to interact with your cells on an energetic level.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Think of PEMF as a battery charger for your cells. It supports the body's natural restorative rhythms, helping to encourage an environment where your energetic systems can find equilibrium.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-serif text-primary mb-6">What to Expect During a Session</h2>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  A PEMF session at BioHarmony Solutions is designed to be deeply relaxing. You will comfortably lie down on a specialized mat or rest near the device while it delivers the pulsed fields.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  There is no physical discomfort. Most clients report feeling absolutely nothing physically, save for a profound sense of relaxation, grounding, and calm. Sessions typically last between 30 to 60 minutes.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-serif text-primary mb-6">Supportive Benefits</h2>
              <ul className="space-y-4">
                {[
                  "Supports cellular balance and energy",
                  "Encourages a deep sense of relaxation and calm",
                  "Supports the body's natural restorative rhythms",
                  "Promotes overall energetic wellbeing"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                    <span className="text-lg text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card border-t border-border text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-8">Experience Restorative Balance</h2>
          <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg" data-testid="pemf-book-cta">
            <Link href="/contact">Book a PEMF Session</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
