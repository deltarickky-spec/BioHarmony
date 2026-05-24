import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service of interest"),
  message: z.string().min(10, "Please provide a brief message")
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", service: "", message: "" }
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log("Form data:", data);
    setIsSubmitted(true);
    toast({
      title: "Inquiry Sent Successfully",
      description: "We will be in touch with you shortly.",
    });
  };

  const inputClass = "bg-white/5 border border-white/12 text-[#F4EFE6] placeholder:text-[#F4EFE6]/25 rounded-xl focus:border-[#BFA14A]/50 focus-visible:ring-0 focus-visible:ring-offset-0";
  const labelClass = "text-[#F4EFE6]/60 text-sm";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#060D0D] to-[#091515]">
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-8">
              <div>
                <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans mb-4">Get in Touch</p>
                <h1 className="text-4xl md:text-5xl font-serif text-[#F4EFE6] mb-4">Book a Session or Ask a Question</h1>
                <p className="text-lg text-[#F4EFE6]/60 leading-relaxed">
                  We look forward to welcoming you to BioHarmony Analytics. Fill out the form and we will confirm your appointment or answer your inquiry.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl space-y-6">
                <h3 className="font-serif text-xl text-[#BFA14A] border-b border-white/10 pb-4">What Happens Next?</h3>
                <ul className="space-y-5 text-[#F4EFE6]/60">
                  {[
                    "We review all inquiries and aim to respond within 24 hours.",
                    "If you are booking a session, we will propose available times.",
                    "You'll receive prep instructions prior to your appointment."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#BFA14A] shrink-0"></div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden" animate="visible" variants={fadeInUp}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-[0_0_60px_rgba(15,92,94,0.15)]"
            >
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-[#0F5C5E]/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#BFA14A]" />
                  </div>
                  <h2 className="text-2xl font-serif text-[#F4EFE6]">Thank You</h2>
                  <p className="text-[#F4EFE6]/55 max-w-xs">
                    Your inquiry has been received. We will contact you shortly at the email provided.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => { setIsSubmitted(false); form.reset(); }}
                    className="mt-4 rounded-full border-[#BFA14A]/30 text-[#F4EFE6]/70 hover:border-[#BFA14A]/60 hover:text-[#BFA14A]"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" className={inputClass} {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" className={inputClass} {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClass}>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(555) 123-4567" className={inputClass} {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Service of Interest</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={inputClass} data-testid="select-service">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ao-scan">AO Scan</SelectItem>
                              <SelectItem value="pemf">PEMF Therapy</SelectItem>
                              <SelectItem value="analytics">BioHarmony Analytics</SelectItem>
                              <SelectItem value="upload">Upload Scan Interpretation</SelectItem>
                              <SelectItem value="practitioner">Practitioner Plan</SelectItem>
                              <SelectItem value="membership">Membership</SelectItem>
                              <SelectItem value="pet">Pet Wellness Scan</SelectItem>
                              <SelectItem value="other">Other / General Inquiry</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we help you on your wellness journey?"
                              className={`${inputClass} min-h-[120px] resize-none`}
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full rounded-full h-12 text-base bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_15px_rgba(191,161,74,0.2)] hover:shadow-[0_0_30px_rgba(191,161,74,0.4)] transition-all duration-300"
                      data-testid="button-submit"
                    >
                      Send Inquiry
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
