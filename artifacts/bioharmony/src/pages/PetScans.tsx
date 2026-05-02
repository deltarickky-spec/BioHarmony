import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { PawPrint, Activity } from "lucide-react";

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

export default function PetScans() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A1818]">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#091515] via-[#0F2A2A] to-[#091515] overflow-hidden border-b border-white/5">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <p className="text-[#BFA14A] text-sm font-bold tracking-widest uppercase">Species-Specific Wellness Analysis</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFE6] leading-tight">
              Pet Wellness Scans
            </h1>
            <p className="text-lg md:text-xl text-[#F4EFE6]/70 leading-relaxed font-light">
              Dogs, cats, and horses experience energetic imbalances just like humans. Our scans help identify stress patterns and sensitivities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emotional Hook Block */}
      <section className="py-24 bg-[#0A1818]">
        <div className="container px-4 md:px-6 relative">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-4xl mx-auto relative pb-12"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-[#BFA14A] italic leading-relaxed px-4 md:px-8">
              "When your pet isn't acting like themselves, there's always a reason."
            </h2>
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#BFA14A]/40 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Animal Species Section */}
      <section className="py-20 bg-[#0A1818]">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              { label: "Canine Wellness Analysis", icon: PawPrint, desc: "Identify energetic stress patterns, behavioral influences, and nutritional sensitivities unique to dogs." },
              { label: "Feline Wellness Analysis", icon: PawPrint, desc: "Cats internalize stress differently. Our scans detect subtle frequency shifts that may impact mood, digestion, and vitality." },
              { label: "Equine Wellness Analysis", icon: Activity, desc: "Performance animals carry significant energetic load. Our assessments support recovery patterns and energetic balance." }
            ].map((animal, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ scale: 1.02 }}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center h-full flex flex-col items-center hover:border-white/20 transition-colors shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-[#BFA14A]/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(191,161,74,0.15)]">
                    <animal.icon className="w-8 h-8 text-[#BFA14A]" />
                  </div>
                  <h3 className="font-serif text-xl text-[#F4EFE6] mb-4">{animal.label}</h3>
                  <p className="text-[#F4EFE6]/70 leading-relaxed text-sm flex-grow">{animal.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works for pets */}
      <section className="py-24 bg-[#0A1818] border-y border-white/5">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">How It Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Submit Information", desc: "Provide your pet's name, species, and age." },
              { step: "02", title: "Voice Sample", desc: "Provide a brief voice sample (yours, describing your pet's concerns)." },
              { step: "03", title: "Receive Insights", desc: "Receive a wellness insight report tailored to your pet." }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-white/5 backdrop-blur-md border border-[#BFA14A]/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(191,161,74,0.05)] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 text-7xl font-serif text-white/5 -mt-4 -mr-2 select-none pointer-events-none">{item.step}</div>
                <div className="w-12 h-12 rounded-full border-2 border-[#BFA14A]/50 text-[#BFA14A] flex items-center justify-center font-bold text-lg mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl text-[#F4EFE6] mb-3 relative z-10">{item.title}</h3>
                <p className="text-[#F4EFE6]/60 relative z-10 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-24 bg-[#0A1818]">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-md mx-auto">
            <div className="bg-[#0F5C5E]/20 backdrop-blur-xl border border-[#BFA14A]/30 rounded-2xl p-10 text-center shadow-[0_0_50px_rgba(15,92,94,0.2)]">
              <h2 className="font-serif text-2xl text-[#F4EFE6] mb-8">Pet Wellness Scan</h2>
              <div className="text-6xl font-bold text-[#BFA14A] mb-8 drop-shadow-md">
                $55 <span className="text-xl font-normal text-[#F4EFE6]/50">USD</span>
              </div>
              <Button asChild size="lg" className="w-full rounded-full mb-8 bg-[#0F5C5E] text-white shadow-[0_0_20px_rgba(15,92,94,0.5)] hover:shadow-[0_0_30px_rgba(15,92,94,0.7)] transition-all border-none py-6 h-auto text-lg" data-testid="book-pet-scan">
                <Link href="/contact">Scan Your Pet</Link>
              </Button>
              <p className="text-xs text-[#F4EFE6]/40 italic leading-relaxed">
                All frequency-based wellness assessments. Not a veterinary service. Always consult a licensed veterinarian for medical concerns.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-[#0A1818] border-t border-white/5">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full text-[#F4EFE6]">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="text-left font-serif text-lg hover:text-[#BFA14A] transition-colors">Is this a replacement for veterinary care?</AccordionTrigger>
                  <AccordionContent className="text-[#F4EFE6]/70 text-base leading-relaxed">
                    No. Our pet scans are wellness assessments for educational purposes only. Always consult a licensed veterinarian for medical advice.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="text-left font-serif text-lg hover:text-[#BFA14A] transition-colors">What animals can be scanned?</AccordionTrigger>
                  <AccordionContent className="text-[#F4EFE6]/70 text-base leading-relaxed">
                    Currently we offer assessments for dogs, cats, and horses.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-white/10 border-b-0">
                  <AccordionTrigger className="text-left font-serif text-lg hover:text-[#BFA14A] transition-colors">How do I submit my pet's information?</AccordionTrigger>
                  <AccordionContent className="text-[#F4EFE6]/70 text-base leading-relaxed">
                    After booking, you'll receive instructions for submitting your pet's name, age, and a brief voice recording describing your wellness concerns.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
