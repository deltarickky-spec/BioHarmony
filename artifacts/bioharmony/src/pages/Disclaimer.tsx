export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-4">Legal</p>
        <h1 className="font-serif text-4xl text-[#F4EFE6] mb-3">Wellness Disclaimer</h1>
        <p className="text-[#F4EFE6]/40 text-sm mb-12">Please read carefully before using our services</p>

        <div className="mb-10 p-6 rounded-2xl border border-[#BFA14A]/30 bg-[#BFA14A]/5">
          <p className="text-[#BFA14A] font-semibold text-base mb-2">Important Notice</p>
          <p className="text-[#F4EFE6]/80 text-sm leading-relaxed">
            BioHarmony Solutions provides wellness education and frequency-based informational reports. Our services are <strong>not</strong> a substitute for professional medical care. Always consult a qualified healthcare professional for any health concerns.
          </p>
        </div>

        <div className="space-y-10 text-[#F4EFE6]/70 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">Educational Purposes Only</h2>
            <p>All content, reports, audio files, scores, and recommendations provided by BioHarmony Solutions are intended exclusively for educational and wellness informational purposes. They are not intended to diagnose, treat, cure, or prevent any disease or medical condition.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">Not Medical Advice</h2>
            <p className="mb-3">The BioHarmony Intelligence Score, frequency analysis, and wellness recommendations in your report reflect bio-frequency data interpretation and wellness education principles. They do not constitute:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>A medical diagnosis</li>
              <li>A treatment plan</li>
              <li>A prescription or dosage recommendation</li>
              <li>A substitute for consultation with a licensed healthcare provider</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">Consult Your Healthcare Provider</h2>
            <p>Before making any changes to your diet, exercise routine, supplements, or health practices based on information from BioHarmony Solutions, please consult with your physician or other qualified healthcare professional, particularly if you:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Have a pre-existing medical condition</li>
              <li>Are pregnant or nursing</li>
              <li>Are taking prescription medications</li>
              <li>Are under the care of a specialist</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">AO Scan Technology</h2>
            <p>The AO Scan technology used in our analysis is a wellness education tool based on frequency resonance principles. It is not an FDA-approved medical device. Results are intended to complement, not replace, professional medical evaluation.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">PEMF Therapy</h2>
            <p>Pulsed Electromagnetic Field (PEMF) therapy information provided on this platform is for educational purposes. PEMF devices are not a substitute for medical treatment. Individuals with pacemakers, implanted electronic devices, or certain medical conditions should consult a physician before considering PEMF therapy.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">Pet Wellness Reports</h2>
            <p>Pet scan reports are wellness education tools only. They do not constitute veterinary advice, diagnosis, or treatment. Always consult a licensed veterinarian for your pet's health concerns.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">Results Disclaimer</h2>
            <p>Individual results vary. Wellness improvements described in testimonials or examples on our platform are not guaranteed. Frequency wellness is a complementary approach and results depend on many individual factors.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">Emergency Situations</h2>
            <p className="text-[#F4EFE6]/85 font-medium">If you are experiencing a medical emergency, call your local emergency services (911) immediately. Do not delay emergency care to consult our platform.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/8 text-xs text-[#F4EFE6]/25 leading-relaxed">
          © {new Date().getFullYear()} BioHarmony Solutions. This disclaimer applies to all services, reports, and content provided by BioHarmony Solutions. By using our services, you acknowledge that you have read and understood this disclaimer.
        </div>
      </div>
    </div>
  );
}
