import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function AOScan() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">

      <section className="py-24 border-b border-white/8">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans">Voice-Based Frequency Wellness</p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#F4EFE6]">AO Scan Assessments</h1>
            <p className="text-xl text-[#F4EFE6]/60 font-light leading-relaxed max-w-2xl mx-auto">
              Listen to the subtle energetic patterns of your body through non-invasive, voice-based frequency wellness assessments.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-serif text-[#F4EFE6]">Understanding Your Energetic Signature</h2>
              <p className="text-lg text-[#F4EFE6]/60 leading-relaxed">
                Everything has a frequency, including the cells, tissues, and systems of your body. The AO Scan technology uses a sophisticated process to read these frequencies, starting with the most unique expression of your state: your voice.
              </p>
              <p className="text-lg text-[#F4EFE6]/60 leading-relaxed">
                By analyzing a brief voice sample, the system maps out energetic patterns, identifying areas that may benefit from support and balance. It is entirely non-invasive, providing profound wellness insights to help guide your personal lifestyle choices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 border-y border-white/8">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Our Scan Offerings</h2>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                title: "Inner Voice Scan",
                desc: "Analyzes your voice to determine emotional energetic patterns. Identifies frequencies that may be out of balance and generates balancing insights designed to support emotional wellness."
              },
              {
                title: "Vitals Scan",
                desc: "Provides a comprehensive snapshot of your energetic wellbeing, assessing the frequencies of various baseline indicators to support your understanding of your physical state."
              },
              {
                title: "Comprehensive Scan",
                desc: "A deeper dive into the energetic status of specific body systems. Maps detailed frequency data to provide thorough wellness insights for those seeking a complete picture."
              },
              {
                title: "Pet Scan",
                desc: "Because our animals have energetic signatures too. Tailored frequency-based wellness support designed specifically to assess the energetic balance of your pets."
              }
            ].map((scan, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-[#BFA14A]/25 hover:shadow-[0_0_30px_rgba(191,161,74,0.08)]"
              >
                <h3 className="font-serif text-xl text-[#BFA14A] mb-4">{scan.title}</h3>
                <p className="text-[#F4EFE6]/60 leading-relaxed text-sm">{scan.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#F4EFE6]">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {[
                {
                  q: "Is the scan diagnostic?",
                  a: "No. The AO Scan provides wellness insights based on energetic frequencies. It is intended for educational purposes to help you understand energetic patterns and is not a medical diagnostic tool. It cannot diagnose, treat, or cure any disease."
                },
                {
                  q: "What do I need to do during a scan?",
                  a: "The process is incredibly simple. You will be asked to speak into a device for about 15 seconds. The system handles the rest, analyzing the frequencies in your voice to generate your personalized wellness insights."
                },
                {
                  q: "How often should I get scanned?",
                  a: "This varies by individual. Some clients prefer monthly check-ins to monitor their energetic balance, while others use the scans periodically when they feel a need for deeper wellness insights. Kathy can help you determine a supportive schedule."
                }
              ].map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-white/5 border border-white/10 rounded-xl px-2 data-[state=open]:border-[#BFA14A]/25"
                >
                  <AccordionTrigger className="text-left font-serif text-[#F4EFE6]/85 text-base px-4 hover:text-[#BFA14A] hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#F4EFE6]/55 text-sm leading-relaxed px-4 pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="py-24 border-t border-white/8 text-center bg-gradient-to-b from-transparent to-[#040A0A]">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Ready to Hear What Your Body is Saying?</h2>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 text-lg px-10 h-14 shadow-[0_0_20px_rgba(191,161,74,0.25)] hover:shadow-[0_0_35px_rgba(191,161,74,0.45)] transition-all duration-300"
              data-testid="aoscan-book-cta"
            >
              <Link href="/contact">Book an AO Scan</Link>
            </Button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
