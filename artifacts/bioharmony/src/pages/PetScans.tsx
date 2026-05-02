import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { PawPrint, Dna } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#F8F6F0] overflow-hidden border-b border-border">
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight">
              Pet Wellness Scans
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
              Dogs, cats, and horses experience energetic imbalances just like humans. Our scans help identify stress patterns and sensitivities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emotional Hook Block */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-secondary italic leading-relaxed">
              "When your pet isn't acting like themselves, there's always a reason."
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Animal Icons Row */}
      <section className="py-16 bg-card">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { label: "Dog", icon: PawPrint },
              { label: "Cat", icon: PawPrint },
              { label: "Horse", icon: Dna }
            ].map((animal, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <animal.icon className="w-10 h-10 text-primary" />
                </div>
                <span className="font-serif text-xl text-foreground">{animal.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works for pets */}
      <section className="py-24 bg-background border-y border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">How It Works</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            {[
              { step: "01", title: "Submit Information", desc: "Provide your pet's name, species, and age." },
              { step: "02", title: "Voice Sample", desc: "Provide a brief voice sample (yours, describing your pet's concerns)." },
              { step: "03", title: "Receive Insights", desc: "Receive a wellness insight report tailored to your pet." }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="relative z-10 bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
                <div className="text-4xl font-serif text-secondary/30 mb-4">{item.step}</div>
                <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-24 bg-card">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="max-w-md mx-auto">
            <Card className="border-secondary/30 shadow-md text-center">
              <CardHeader className="pt-8">
                <CardTitle className="font-serif text-2xl text-primary">Pet Wellness Scan</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="text-5xl font-bold text-foreground mb-8">$55 <span className="text-lg font-normal text-muted-foreground">USD</span></div>
                <Button asChild size="lg" className="w-full rounded-full mb-6" data-testid="book-pet-scan">
                  <Link href="/contact">Scan Your Pet</Link>
                </Button>
                <p className="text-xs text-muted-foreground italic leading-relaxed px-4">
                  All frequency-based wellness assessments. Not a veterinary service. Always consult a licensed veterinarian for medical concerns.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-serif text-lg">Is this a replacement for veterinary care?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  No. Our pet scans are wellness assessments for educational purposes only. Always consult a licensed veterinarian for medical advice.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-serif text-lg">What animals can be scanned?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Currently we offer assessments for dogs, cats, and horses.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-serif text-lg">How do I submit my pet's information?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  After booking, you'll receive instructions for submitting your pet's name, age, and a brief voice recording describing your wellness concerns.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
