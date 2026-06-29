import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import pemfVisual from "@/assets/pemf-visual.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function PEMFTherapy() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img src={pemfVisual} alt="Abstract frequency" className="object-cover w-full h-full mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#060D0D]/95 via-[#060D0D]/70 to-[#060D0D]/40 z-0" />
        <div className="container relative z-10 px-4 md:px-6 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">Cellular Restoration</p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#F4EFE6]">PEMF Therapy</h1>
            <p className="text-xl text-[#F4EFE6]/60 font-light leading-relaxed max-w-2xl mx-auto">
              Support your cellular balance and natural energy with Pulsed Electromagnetic Field therapy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 border-t border-white/8">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-16">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-5">
              <h2 className="text-3xl font-serif text-[#F4EFE6]">What is PEMF?</h2>
              <p className="text-lg text-[#F4EFE6]/60 leading-relaxed">
                Pulsed Electromagnetic Field (PEMF) therapy is a restorative approach that introduces low-frequency electromagnetic waves to the body. These gentle pulses safely pass through skin and tissue to interact with your cells on an energetic level.
              </p>
              <p className="text-lg text-[#F4EFE6]/60 leading-relaxed">
                Think of PEMF as a battery charger for your cells. It supports the body's natural restorative rhythms, helping to encourage an environment where your energetic systems can find equilibrium.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-5">
              <h2 className="text-3xl font-serif text-[#F4EFE6]">What to Expect During a Session</h2>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(15,92,94,0.1)]">
                <p className="text-[#F4EFE6]/60 leading-relaxed mb-4">
                  A PEMF session at Bio-Frequency Analytics is designed to be deeply relaxing. You will comfortably lie down on a specialized mat or rest near the device while it delivers the pulsed fields.
                </p>
                <p className="text-[#F4EFE6]/60 leading-relaxed">
                  There is no physical discomfort. Most clients report feeling absolutely nothing physically, save for a profound sense of relaxation, grounding, and calm. Sessions typically last between 30 to 60 minutes.
                </p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-5">
              <h2 className="text-3xl font-serif text-[#F4EFE6]">Supportive Benefits</h2>
              <ul className="space-y-4">
                {[
                  "Supports cellular balance and energy",
                  "Encourages a deep sense of relaxation and calm",
                  "Supports the body's natural restorative rhythms",
                  "Promotes overall energetic wellbeing"
                ].map((benefit, i) => (
                  <motion.li key={i} variants={fadeInUp} className="flex items-start gap-4">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#BFA14A] shrink-0"></div>
                    <span className="text-[#F4EFE6]/75 text-lg">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/8 text-center bg-gradient-to-b from-transparent to-[#040A0A]">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Experience Restorative Balance</h2>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 px-10 h-14 text-base shadow-[0_0_20px_rgba(191,161,74,0.25)] hover:shadow-[0_0_35px_rgba(191,161,74,0.45)] transition-all duration-300"
              data-testid="pemf-book-cta"
            >
              <Link href="/contact">Book a PEMF Session</Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
