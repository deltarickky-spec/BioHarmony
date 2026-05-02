import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import kathyPortrait from "@/assets/kathy-owens.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="order-2 lg:order-1">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-border">
                {kathyPortrait ? (
                  <img src={kathyPortrait} alt="Kathy Owens, Founder" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Portrait</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="order-1 lg:order-2 space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Meet Kathy Owens</h1>
                <p className="text-xl font-serif text-secondary font-medium">Founder, BioHarmony Solutions</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kathy Owens founded BioHarmony Solutions from a deeply personal belief: that every body has a unique energetic signature, and understanding that signature is the key to profound wellness.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  After experiencing the limitations of conventional wellness tracking, Kathy discovered the remarkable world of frequency-based tools. The clarity and gentle support these technologies provided inspired her to create a sanctuary where others could access the same insights.
                </p>
              </div>

              <blockquote className="border-l-4 border-secondary pl-6 py-2 my-8">
                <p className="text-2xl font-serif text-primary italic leading-snug">
                  "Every body has a unique energetic signature. My work is to help you understand yours, replacing confusion with clarity and stress with balance."
                </p>
              </blockquote>

              <div className="space-y-4">
                <h3 className="text-xl font-serif text-primary">Training & Expertise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Dedicated to the art and science of energetic wellness, Kathy holds extensive certifications in frequency analysis, AO Scan technology operation, and PEMF therapy application. She continually updates her knowledge to provide the most supportive, client-centered experience possible.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card border-t border-border text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-serif text-primary mb-8">Work with Kathy</h2>
          <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg" data-testid="about-contact-cta">
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
