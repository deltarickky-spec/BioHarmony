import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function AOScan() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Header */}
      <section className="py-20 bg-card border-b border-border">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-serif text-primary">AO Scan Assessments</h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Listen to the subtle energetic patterns of your body through non-invasive, voice-based frequency wellness assessments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is it */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-serif text-primary">Understanding Your Energetic Signature</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Everything has a frequency, including the cells, tissues, and systems of your body. The AO Scan technology uses a sophisticated process to read these frequencies, starting with the most unique expression of your state: your voice.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By analyzing a brief voice sample, the system maps out energetic patterns, identifying areas that may benefit from support and balance. It is entirely non-invasive, providing profound wellness insights to help you guide your personal lifestyle choices.
            </p>
          </div>
        </div>
      </section>

      {/* Scans available */}
      <section className="py-24 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-primary">Our Scan Offerings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-border/50 shadow-sm bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Inner Voice Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Analyzes your voice to determine emotional energetic patterns. It identifies frequencies that may be out of balance and generates balancing audio tracks designed to support emotional wellness.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Vitals Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Provides a comprehensive snapshot of your energetic wellbeing, assessing the frequencies of various baseline indicators to support your understanding of your physical state.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Comprehensive Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  A deeper dive into the energetic status of specific body systems. It maps detailed frequency data to provide thorough wellness insights for those seeking a complete picture.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-background">
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-primary">Pet Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Because our animals have energetic signatures too. We offer tailored frequency-based wellness support designed specifically to assess the energetic balance of your pets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-serif text-primary mb-10 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-serif text-lg">Is the scan diagnostic?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                No. The AO Scan provides wellness insights based on energetic frequencies. It is intended for educational purposes to help you understand energetic patterns and is not a medical diagnostic tool. It cannot diagnose, treat, or cure any disease.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-serif text-lg">What do I need to do during a scan?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                The process is incredibly simple. You will be asked to speak into a device for about 15 seconds. The system handles the rest, analyzing the frequencies in your voice to generate your personalized wellness insights.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-serif text-lg">How often should I get scanned?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                This varies by individual. Some clients prefer monthly check-ins to monitor their energetic balance, while others use the scans periodically when they feel a need for deeper wellness insights. Kathy can help you determine a supportive schedule.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-serif mb-8">Ready to Hear What Your Body is Saying?</h2>
          <Button asChild size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 text-lg px-10 h-14" data-testid="aoscan-book-cta">
            <Link href="/contact">Book an AO Scan</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
