import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { PawPrint, Activity, Heart, Zap, Shield } from "lucide-react";
import dogImg from "@/assets/pet-dog.jpg";
import catImg from "@/assets/pet-cat.jpg";
import horseImg from "@/assets/pet-horse.jpg";

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

      {/* Animal Species Section — Flip Cards */}
      <section className="py-20 bg-[#0A1818]">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-12"
          >
            <p className="text-[#BFA14A]/70 text-xs uppercase tracking-[0.2em] font-sans mb-3">Hover to learn more</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">Species We Serve</h2>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                label: "Canine Wellness",
                species: "Dogs",
                img: dogImg,
                icon: PawPrint,
                color: "#BFA14A",
                bullets: ["Stress & anxiety patterns", "Nutritional sensitivities", "Behavioral root causes", "Vitality & energy balance"],
                desc: "Dogs carry emotional stress from their environment. Our frequency scans reveal hidden patterns affecting mood, digestion, and overall vitality.",
              },
              {
                label: "Feline Wellness",
                species: "Cats",
                img: catImg,
                icon: Heart,
                color: "#0F5C5E",
                bullets: ["Mood & temperament shifts", "Digestive frequency markers", "Stress internalization", "Energetic sensitivity"],
                desc: "Cats internalize stress differently than any other animal. Our scans detect subtle frequency shifts that may impact mood, digestion, and vitality.",
              },
              {
                label: "Equine Wellness",
                species: "Horses",
                img: horseImg,
                icon: Zap,
                color: "#BFA14A",
                bullets: ["Performance & recovery", "Energetic load patterns", "Musculoskeletal signals", "Emotional balance"],
                desc: "Performance animals carry significant energetic load. Our assessments support recovery patterns and help identify sources of chronic stress.",
              },
            ].map((animal, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <div className="flip-card h-[540px] cursor-pointer">
                  <div className="flip-card-inner">
                    {/* Front — Photo */}
                    <div className="flip-card-front">
                      <img
                        src={animal.img}
                        alt={animal.species}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060D0D]/90 via-[#060D0D]/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-7">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${animal.color}22`, border: `1px solid ${animal.color}50` }}>
                            <animal.icon className="w-4 h-4" style={{ color: animal.color }} />
                          </div>
                          <p className="text-[10px] uppercase tracking-[0.2em] font-sans" style={{ color: animal.color }}>Wellness Analysis</p>
                        </div>
                        <h3 className="font-serif text-2xl text-[#F4EFE6]">{animal.label}</h3>
                        <p className="text-[#F4EFE6]/50 text-xs mt-1 font-sans">Hover to explore →</p>
                      </div>
                    </div>
                    {/* Back — Info */}
                    <div className="flip-card-back bg-gradient-to-br from-[#0C1919] to-[#091515] border border-white/10 flex flex-col p-6">
                      <div className="flex-1 overflow-y-auto pr-1">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: `${animal.color}18`, border: `1px solid ${animal.color}40` }}>
                          <animal.icon className="w-5 h-5" style={{ color: animal.color }} />
                        </div>
                        <h3 className="font-serif text-xl text-[#F4EFE6] mb-2">{animal.label}</h3>
                        <p className="text-[#F4EFE6]/65 text-[13px] leading-relaxed mb-4">{animal.desc}</p>
                        <ul className="space-y-2">
                          {animal.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2.5 text-[13px] leading-snug text-[#F4EFE6]/75">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: animal.color }} />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button asChild size="sm" className="mt-4 w-full rounded-full bg-[#0F5C5E] text-white border-none hover:bg-[#0F5C5E]/80 transition-all shrink-0">
                        <Link href="/contact">Book a {animal.species} Scan</Link>
                      </Button>
                    </div>
                  </div>
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

      {/* Pricing Cards */}
      <section className="py-24 bg-[#0A1818]">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-[#F4EFE6] mb-3">Pet Scan Pricing</h2>
            <p className="text-[#F4EFE6]/55 text-sm">Choose the depth that fits your pet's wellness needs.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                slug: "pet-vitals",
                title: "Pet Vitals",
                price: 75,
                tag: "Quick wellness snapshot",
                bullets: [
                  "Energetic snapshot of blood biology, organs, glands",
                  "Color-coded system overview",
                  "Delivered as PDF report",
                ],
              },
              {
                slug: "pet-comprehensive",
                title: "Pet Comprehensive",
                price: 150,
                tag: "Full energetic profile",
                popular: true,
                bullets: [
                  "Full body system analysis",
                  "Complete energetic profile",
                  "30-day pet wellness plan included",
                ],
              },
            ].map((tier) => (
              <motion.div key={tier.slug} variants={fadeInUp}>
                <div className={`relative h-full flex flex-col bg-[#0F5C5E]/15 backdrop-blur-xl border ${tier.popular ? "border-[#BFA14A]/55 shadow-[0_0_40px_rgba(191,161,74,0.15)]" : "border-white/10"} rounded-2xl p-8 text-center`}>
                  {tier.popular && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#BFA14A] text-[#091515] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">Most Popular</span>
                  )}
                  <p className="text-[#BFA14A] text-[10px] uppercase tracking-widest mb-3">{tier.tag}</p>
                  <h3 className="font-serif text-2xl text-[#F4EFE6] mb-5">{tier.title}</h3>
                  <div className="text-5xl font-bold text-[#BFA14A] mb-6 drop-shadow-md">
                    ${tier.price} <span className="text-base font-normal text-[#F4EFE6]/40">USD</span>
                  </div>
                  <ul className="space-y-2.5 text-left text-sm text-[#F4EFE6]/75 mb-8 flex-grow">
                    {tier.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#BFA14A] shrink-0 mt-1.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className={`w-full rounded-full py-5 h-auto text-base border-none transition-all ${tier.popular ? "bg-[#BFA14A] text-[#091515] hover:bg-[#BFA14A]/90" : "bg-[#0F5C5E] text-white hover:bg-[#0F5C5E]/80"}`} data-testid={`book-${tier.slug}`}>
                    <Link href={`/upload-scan?plan=${tier.slug}&type=pet_scan`}>Book This Scan</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <p className="text-center text-xs text-[#F4EFE6]/40 italic leading-relaxed mt-10 max-w-2xl mx-auto">
            All frequency-based wellness assessments. Not a veterinary service. Always consult a licensed veterinarian for medical concerns. AO Scan is an educational wellness tool, not a medical device.
          </p>
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
