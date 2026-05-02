import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, Globe } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LANGUAGES, useLanguage, type Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  reportType: z.string().min(1, "Please select a report type"),
  preferredLanguage: z.string().min(2),
});

export default function UploadScan() {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ email: string; language: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      reportType: "",
      preferredLanguage: language,
    },
  });

  const selectedLang = form.watch("preferredLanguage");
  const selectedLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label ?? "English";

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      form.setError("root", { message: "Please select a file to upload" });
      return;
    }
    setSubmittedData({ email: values.email, language: values.preferredLanguage });
    setIsSubmitted(true);
  }

  const handleFileSelect = () => {
    setSelectedFile("scan_results_export.pdf");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A1818]">

      {/* Hero */}
      <section className="py-24 border-b border-white/5">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <p className="text-[#BFA14A] text-sm font-bold tracking-widest uppercase">Report Translation</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F4EFE6]">
              Upload Your Existing Scan
            </h1>
            <p className="text-lg md:text-xl text-[#F4EFE6]/70 leading-relaxed font-light">
              Already have an AO Scan? Upload your results and receive a clear, easy-to-understand interpretation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            {isSubmitted && submittedData ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-[0_0_40px_rgba(15,92,94,0.3)] text-center space-y-6 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#BFA14A]/10 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10 text-[#BFA14A]" />
                </div>
                <h2 className="text-3xl font-serif text-[#F4EFE6]">Your report is being prepared.</h2>
                <p className="text-[#F4EFE6]/70 max-w-md mx-auto text-lg leading-relaxed">
                  You'll receive your interpretation in{" "}
                  <span className="text-[#BFA14A] font-medium">
                    {LANGUAGES.find((l) => l.code === submittedData.language)?.label ?? "English"}
                  </span>{" "}
                  at{" "}
                  <span className="font-medium text-white">{submittedData.email}</span>{" "}
                  within 24–48 hours.
                </p>
                <div className="flex items-center gap-2 bg-[#BFA14A]/8 border border-[#BFA14A]/20 rounded-full px-5 py-2">
                  <Globe className="w-3.5 h-3.5 text-[#BFA14A]/60" />
                  <span className="text-[#BFA14A]/80 text-sm">
                    {LANGUAGES.find((l) => l.code === submittedData.language)?.nativeLabel}
                  </span>
                </div>
                <Button
                  asChild
                  className="rounded-full mt-6 bg-transparent border border-[#BFA14A]/50 text-[#BFA14A] hover:bg-[#BFA14A]/10 px-8 py-6 h-auto"
                  data-testid="upload-another-scan"
                >
                  <button onClick={() => {
                    setIsSubmitted(false);
                    form.reset({ preferredLanguage: language });
                    setSelectedFile(null);
                    setSubmittedData(null);
                  }}>
                    Upload Another Scan
                  </button>
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Drop zone */}
                <div
                  className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-[#BFA14A]/30 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#BFA14A]/60 hover:shadow-[0_0_30px_rgba(191,161,74,0.15)] transition-all duration-300"
                  onClick={handleFileSelect}
                  data-testid="upload-dropzone"
                >
                  {selectedFile ? (
                    <>
                      <CheckCircle className="w-12 h-12 text-[#0F5C5E] drop-shadow-[0_0_15px_rgba(15,92,94,0.5)] mb-4" />
                      <p className="text-xl font-medium text-[#BFA14A] mb-1">{selectedFile}</p>
                      <p className="text-sm text-[#F4EFE6]/50">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-[#BFA14A] mb-4 drop-shadow-[0_0_15px_rgba(191,161,74,0.3)]" />
                      <p className="text-xl font-medium text-[#F4EFE6] mb-2">Drag & drop your scan file here</p>
                      <p className="text-sm text-[#F4EFE6]/50">or click to browse</p>
                      <p className="text-xs text-[#BFA14A]/60 mt-4 tracking-widest uppercase">Accepts: XLSX · PDF</p>
                    </>
                  )}
                </div>

                {/* Form card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/70 text-sm">Name</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white/5 border border-white/15 text-[#F4EFE6] placeholder:text-[#F4EFE6]/30 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 h-12 px-4"
                                placeholder="Your full name"
                                {...field}
                                data-testid="upload-input-name"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/70 text-sm">Email</FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white/5 border border-white/15 text-[#F4EFE6] placeholder:text-[#F4EFE6]/30 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 h-12 px-4"
                                placeholder="Your email address"
                                type="email"
                                {...field}
                                data-testid="upload-input-email"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reportType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/70 text-sm">Report Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger
                                  className="bg-white/5 border border-white/15 text-[#F4EFE6] rounded-xl focus:border-[#BFA14A]/50 focus:ring-0 h-12 px-4"
                                  data-testid="upload-select-report-type"
                                >
                                  <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#0F2A2A] border-[#BFA14A]/30 text-[#F4EFE6]">
                                <SelectItem value="inner_voice" className="focus:bg-white/10 focus:text-white cursor-pointer">Inner Voice</SelectItem>
                                <SelectItem value="vitals" className="focus:bg-white/10 focus:text-white cursor-pointer">Vitals</SelectItem>
                                <SelectItem value="comprehensive" className="focus:bg-white/10 focus:text-white cursor-pointer">Comprehensive</SelectItem>
                                <SelectItem value="body_systems" className="focus:bg-white/10 focus:text-white cursor-pointer">Body Systems</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400/80" />
                          </FormItem>
                        )}
                      />

                      {/* Language preference */}
                      <FormField
                        control={form.control}
                        name="preferredLanguage"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-3">
                              <FormLabel className="text-[#F4EFE6]/70 text-sm mb-0">
                                Report Language
                              </FormLabel>
                              <span className="text-[#BFA14A]/60 text-xs flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {selectedLangLabel}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {LANGUAGES.map((lang) => (
                                <button
                                  key={lang.code}
                                  type="button"
                                  onClick={() => field.onChange(lang.code)}
                                  className={cn(
                                    "text-sm px-4 py-2 rounded-full border transition-all duration-150",
                                    field.value === lang.code
                                      ? "border-[#BFA14A]/60 bg-[#BFA14A]/12 text-[#BFA14A] font-medium shadow-[0_0_12px_rgba(191,161,74,0.2)]"
                                      : "border-white/10 text-[#F4EFE6]/40 hover:border-white/22 hover:text-[#F4EFE6]/65"
                                  )}
                                  data-testid={`upload-lang-${lang.code}`}
                                >
                                  {lang.nativeLabel}
                                </button>
                              ))}
                            </div>
                            <p className="text-[#F4EFE6]/30 text-xs mt-2">
                              Your interpretation will be delivered in the selected language.
                            </p>
                          </FormItem>
                        )}
                      />

                      {form.formState.errors.root && (
                        <p className="text-sm font-medium text-red-400/80">{form.formState.errors.root.message}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full rounded-full bg-[#0F5C5E] text-white shadow-[0_0_20px_rgba(191,161,74,0.3)] hover:shadow-[0_0_35px_rgba(191,161,74,0.5)] transition-all border-none mt-4 h-14 text-lg"
                        data-testid="upload-submit-button"
                      >
                        Submit for Interpretation
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-[#0A1818] border-t border-white/5 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-[#F4EFE6]">What Happens Next?</h2>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-stretch max-w-5xl mx-auto gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-[#BFA14A]/50 via-[#BFA14A]/50 to-[#BFA14A]/50 -translate-y-1/2 z-0"></div>
            {[
              { step: "1", title: "Upload", desc: "Securely upload your raw scan data and select your preferred language." },
              { step: "2", title: "Analyze", desc: "We review and extract meaningful patterns from your scan." },
              { step: "3", title: "Receive", desc: "A personalized interpretation arrives in your inbox in your chosen language." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-10 text-center w-full md:w-[30%]"
              >
                <div className="w-14 h-14 rounded-full border-2 border-[#BFA14A] bg-[#0A1818] text-[#BFA14A] flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-[0_0_20px_rgba(191,161,74,0.2)]">
                  {item.step}
                </div>
                <h3 className="font-serif text-xl text-[#F4EFE6] mb-3">{item.title}</h3>
                <p className="text-sm text-[#F4EFE6]/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-16 bg-[#0A1818]">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-[#F4EFE6]/60 text-lg">
            Single report interpretation: <span className="font-bold text-[#BFA14A] text-xl px-1">$49</span><br />
            <span className="text-sm italic mt-2 inline-block">Already have a Practitioner plan? Your discounted pricing applies automatically.</span>
          </p>
        </div>
      </section>

    </div>
  );
}
