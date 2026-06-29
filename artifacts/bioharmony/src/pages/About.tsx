import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import kathyPortrait from "@/assets/kathy-clinic.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">

      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="order-2 lg:order-1">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(15,92,94,0.25)] border border-white/10">
                {kathyPortrait ? (
                  <img src={kathyPortrait} alt="Kathy Owens, Founder" className="w-full h-full object-cover object-center" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="text-[#F4EFE6]/30 font-serif text-lg">Portrait</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="order-1 lg:order-2 space-y-8">
              <div>
                <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans mb-4">Founder & Practitioner</p>
                <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6] mb-3">Meet Kathy Owens</h1>
                <p className="text-xl font-serif text-[#BFA14A]/80 font-medium">Founder, Bio-Frequency Analytics</p>
              </div>

              <div className="space-y-5">
                <p className="text-[#F4EFE6]/65 leading-relaxed text-lg">
                  Kathy Owens founded Bio-Frequency Analytics from a deeply personal belief: that every body has a unique energetic signature, and understanding that signature is the key to profound wellness.
                </p>
                <p className="text-[#F4EFE6]/65 leading-relaxed text-lg">
                  After experiencing the limitations of conventional wellness tracking, Kathy discovered the remarkable world of frequency-based tools. The clarity and gentle support these technologies provided inspired her to create a sanctuary where others could access the same insights.
                </p>
              </div>

              <blockquote className="border-l-2 border-[#BFA14A]/50 pl-6 py-2 my-8">
                <p className="text-xl font-serif text-[#F4EFE6]/85 italic leading-relaxed">
                  "Every body has a unique energetic signature. My work is to help you understand yours — replacing confusion with clarity and stress with balance."
                </p>
              </blockquote>

              <div className="space-y-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-serif text-[#BFA14A]">Training & Expertise</h3>
                <p className="text-[#F4EFE6]/55 leading-relaxed text-sm">
                  Dedicated to the art and science of energetic wellness, Kathy holds extensive certifications in frequency analysis, AO Scan technology operation, and PEMF therapy application. She continually updates her knowledge to provide the most supportive, client-centered experience possible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/8 text-center bg-gradient-to-b from-[#091515] to-[#060D0D]">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Work with Kathy</h2>
            <p className="text-[#F4EFE6]/55 max-w-md mx-auto">Ready to understand your body's energetic signature? Book a one-on-one consultation.</p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 h-14 text-base bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_20px_rgba(191,161,74,0.25)] hover:shadow-[0_0_35px_rgba(191,161,74,0.45)] transition-all duration-300"
              data-testid="about-contact-cta"
            >
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
