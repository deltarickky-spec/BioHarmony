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
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    // In a real app, this would be an API call
    console.log("Form data:", data);
    
    setIsSubmitted(true);
    toast({
      title: "Inquiry Sent Successfully",
      description: "We will be in touch with you shortly.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background">
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Book a Session or Ask a Question</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We look forward to welcoming you to BioHarmony Solutions. Please fill out the form, and we will get back to you to confirm your appointment or answer your inquiry.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
                <h3 className="font-serif text-xl text-primary border-b border-border pb-4">What Happens Next?</h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                    <span>We review all inquiries and aim to respond within 24 hours.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                    <span>If you are booking a session, we will propose available times.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                    <span>You'll receive prep instructions prior to your appointment.</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-lg">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-serif text-primary">Thank You</h2>
                  <p className="text-muted-foreground">
                    Your inquiry has been received. We will contact you shortly at the email provided.
                  </p>
                  <Button variant="outline" onClick={() => { setIsSubmitted(false); form.reset(); }} className="mt-4 rounded-full">
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
                          <FormLabel className="text-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" className="bg-background" {...field} data-testid="input-name" />
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
                            <FormLabel className="text-foreground">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="jane@example.com" className="bg-background" {...field} data-testid="input-email" />
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
                            <FormLabel className="text-foreground">Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(555) 123-4567" className="bg-background" {...field} data-testid="input-phone" />
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
                          <FormLabel className="text-foreground">Service of Interest</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background" data-testid="select-service">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ao-scan">AO Scan</SelectItem>
                              <SelectItem value="pemf">PEMF Therapy</SelectItem>
                              <SelectItem value="analytics">BioHarmony Analytics</SelectItem>
                              <SelectItem value="practitioner">Practitioner Report Review</SelectItem>
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
                          <FormLabel className="text-foreground">Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you on your wellness journey?" 
                              className="min-h-[120px] bg-background resize-none" 
                              {...field} 
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full rounded-full h-12 text-lg" data-testid="button-submit">
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
