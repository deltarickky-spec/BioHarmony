import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  reportType: z.string().min(1, "Please select a report type"),
});

export default function UploadScan() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      reportType: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      form.setError("root", { message: "Please select a file to upload" });
      return;
    }
    setSubmittedEmail(values.email);
    setIsSubmitted(true);
  }

  const handleFileSelect = () => {
    setSelectedFile("scan_results_export.pdf");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container px-4 md:px-6">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-primary">
              Upload Your Existing Scan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Already have an AO Scan? Upload your results and receive a clear, easy-to-understand interpretation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload Form Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            {isSubmitted ? (
              <Card className="border-secondary/30 bg-secondary/5 shadow-sm text-center py-12">
                <CardContent className="space-y-6 flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-primary" />
                  <h2 className="text-2xl font-serif text-primary">Your report is being prepared.</h2>
                  <p className="text-muted-foreground max-w-md">
                    Delivery in 24–48 hours. You'll receive a confirmation at <span className="font-medium text-foreground">{submittedEmail}</span>.
                  </p>
                  <Button asChild className="rounded-full mt-4" data-testid="upload-another-scan">
                    <button onClick={() => { setIsSubmitted(false); form.reset(); setSelectedFile(null); }}>Upload Another Scan</button>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Submit Scan Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors mb-8"
                    onClick={handleFileSelect}
                    data-testid="upload-dropzone"
                  >
                    {selectedFile ? (
                      <>
                        <CheckCircle className="w-10 h-10 text-secondary mb-4" />
                        <p className="text-lg font-medium text-foreground mb-1">{selectedFile}</p>
                        <p className="text-sm text-muted-foreground">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-foreground mb-1">Drag & drop your scan file here, or click to browse</p>
                        <p className="text-sm text-muted-foreground">Accepts: XLSX, PDF</p>
                      </>
                    )}
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} data-testid="upload-input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" type="email" {...field} data-testid="upload-input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reportType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Report Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="upload-select-report-type">
                                  <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="inner_voice">Inner Voice</SelectItem>
                                <SelectItem value="vitals">Vitals</SelectItem>
                                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                                <SelectItem value="body_systems">Body Systems</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.formState.errors.root && (
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
                      )}

                      <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90" size="lg" data-testid="upload-submit-button">
                        Submit for Interpretation
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container px-4 md:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-serif text-primary">What Happens Next?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "We receive your file", desc: "Your scan data is securely uploaded to our system." },
              { step: "2", title: "We analyze your energetic patterns", desc: "Our team reviews the data to extract meaningful wellness insights." },
              { step: "3", title: "You receive your report", desc: "A clear, personalized interpretation report is delivered to your inbox." }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center space-y-4">
                <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Single report interpretation: <span className="font-semibold text-foreground">$49</span>. Already have a Practitioner plan? Your discounted pricing applies automatically.
          </p>
        </div>
      </section>
    </div>
  );
}
