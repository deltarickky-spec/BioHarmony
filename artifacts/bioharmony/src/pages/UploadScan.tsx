import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, Globe, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LANGUAGES, useLanguage, type Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  reportType: z.string().min(1, "Please select a report type"),
  preferredLanguage: z.string().min(2),
  whatsapp: z.boolean().default(false),
  note: z.string().optional(),
});

export default function UploadScan() {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      reportType: "",
      preferredLanguage: language,
      whatsapp: false,
      note: "",
    },
  });

  const selectedLang = form.watch("preferredLanguage");
  const selectedLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label ?? "English";
  const watchWhatsapp = form.watch("whatsapp");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      form.setError("root", { message: "Please select a file to upload" });
      return;
    }
    setIsLoading(true);
    setSubmitError("");
    try {
      const res = await fetch(`${BASE}/api/scan-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          reportType: values.reportType,
          language: values.preferredLanguage,
          fileName: selectedFile,
          whatsapp: values.whatsapp,
          note: values.note || undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }
      const data = (await res.json()) as { id?: number };
      if (data.id) {
        setRequestId(`BH-${data.id.toString().padStart(4, "0")}`);
      }
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            {isSubmitted ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-[0_0_40px_rgba(15,92,94,0.3)] text-center space-y-6 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#BFA14A]/10 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10 text-[#BFA14A]" />
                </div>
                <div className="w-full max-w-md space-y-4">
                  <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em]">Request Received</p>
                  <h2 className="text-3xl font-serif text-[#F4EFE6]">Thank you.</h2>
                  <p className="text-[#F4EFE6]/70 text-lg leading-relaxed">
                    We'll review your submission and prepare your report within{" "}
                    <span className="text-[#BFA14A] font-medium">24–48 hours</span>.
                  </p>
                  {requestId && (
                    <div className="bg-[#BFA14A]/8 border border-[#BFA14A]/30 rounded-2xl px-6 py-5 text-left">
                      <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] mb-2">Your Request ID</p>
                      <p className="text-[#F4EFE6] font-mono text-2xl tracking-widest font-medium mb-1">
                        {requestId}
                      </p>
                      <p className="text-[#F4EFE6]/40 text-sm">
                        Save this ID — use it to track your report status at any time.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-md">
                  {requestId && (
                    <Link
                      href="/track-report"
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#BFA14A] text-[#060D0D] text-sm font-semibold hover:bg-[#d4b456] transition-colors"
                    >
                      Track My Report →
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setRequestId(null);
                      form.reset({ preferredLanguage: language, whatsapp: false });
                      setSelectedFile(null);
                      setSubmitError("");
                    }}
                    className="flex-1 py-3.5 rounded-full bg-transparent border border-white/20 text-[#F4EFE6]/60 text-sm hover:border-white/35 hover:text-[#F4EFE6]/80 transition-all"
                    data-testid="upload-another-scan"
                  >
                    Upload Another Scan
                  </button>
                </div>
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/70 text-sm">
                              Phone <span className="text-[#F4EFE6]/30 font-normal">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-white/5 border border-white/15 text-[#F4EFE6] placeholder:text-[#F4EFE6]/30 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 h-12 px-4"
                                placeholder="+1 (555) 000-0000"
                                type="tel"
                                {...field}
                                data-testid="upload-input-phone"
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

                      {/* WhatsApp delivery */}
                      <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <button
                              type="button"
                              onClick={() => field.onChange(!field.value)}
                              className={cn(
                                "w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 text-left",
                                watchWhatsapp
                                  ? "border-[#25D366]/40 bg-[#25D366]/[0.06] shadow-[0_0_14px_rgba(37,211,102,0.12)]"
                                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
                              )}
                              data-testid="upload-toggle-whatsapp"
                            >
                              <div className={cn(
                                "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-all",
                                watchWhatsapp
                                  ? "bg-[#25D366]/20 border-[#25D366]/50"
                                  : "bg-white/[0.05] border-white/15"
                              )}>
                                <MessageCircle className={cn(
                                  "w-4 h-4 transition-colors",
                                  watchWhatsapp ? "text-[#25D366]" : "text-[#F4EFE6]/30"
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm font-medium transition-colors",
                                  watchWhatsapp ? "text-[#F4EFE6]" : "text-[#F4EFE6]/60"
                                )}>
                                  Deliver my report via WhatsApp
                                </p>
                                <p className="text-[#F4EFE6]/30 text-xs mt-0.5">
                                  We'll send your interpretation directly to your WhatsApp number
                                </p>
                              </div>
                              <div className={cn(
                                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                watchWhatsapp
                                  ? "border-[#25D366] bg-[#25D366]"
                                  : "border-white/20"
                              )}>
                                {watchWhatsapp && (
                                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                            </button>
                          </FormItem>
                        )}
                      />

                      {/* Note / message */}
                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#F4EFE6]/70 text-sm">
                              Notes or questions <span className="text-[#F4EFE6]/30 font-normal">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="bg-white/5 border border-white/15 text-[#F4EFE6] placeholder:text-[#F4EFE6]/30 rounded-xl focus-visible:border-[#BFA14A]/50 focus-visible:ring-0 min-h-[100px] px-4 py-3 resize-none"
                                placeholder="Tell Kathy anything relevant about your scan, symptoms, or what you'd like to understand…"
                                {...field}
                                data-testid="upload-input-note"
                              />
                            </FormControl>
                            <FormMessage className="text-red-400/80" />
                          </FormItem>
                        )}
                      />

                      {(form.formState.errors.root || submitError) && (
                        <p className="text-sm font-medium text-red-400/80 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                          {form.formState.errors.root?.message ?? submitError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-[#0F5C5E] text-white shadow-[0_0_20px_rgba(191,161,74,0.3)] hover:shadow-[0_0_35px_rgba(191,161,74,0.5)] transition-all border-none mt-4 h-14 text-lg disabled:opacity-60"
                        data-testid="upload-submit-button"
                      >
                        {isLoading ? "Submitting…" : "Submit for Interpretation"}
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
