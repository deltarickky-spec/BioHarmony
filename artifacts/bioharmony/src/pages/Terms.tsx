export default function Terms() {
  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-4">Legal</p>
        <h1 className="font-serif text-4xl text-[#F4EFE6] mb-3">Terms of Service</h1>
        <p className="text-[#F4EFE6]/40 text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-10 text-[#F4EFE6]/70 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using any service provided by BioHarmony Solutions ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">2. Nature of Services</h2>
            <p className="mb-3">BioHarmony Solutions provides frequency-based wellness education, bio-frequency scan analysis, and personalized wellness reports. All services are intended for <strong className="text-[#F4EFE6]/85">educational and informational purposes only</strong>.</p>
            <p>Our services are not medical devices, and our reports do not constitute medical diagnoses, treatment plans, or medical advice of any kind. BioHarmony Solutions is a wellness education platform, not a healthcare provider.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">3. No Medical Advice</h2>
            <p className="mb-3">Nothing on this platform should be construed as medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            <p>Never disregard professional medical advice or delay seeking it because of something you have read or received through BioHarmony Solutions.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">4. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be 18 years of age or older to use our services.</li>
              <li>You agree to provide accurate information when submitting scan requests.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree not to use our services for any unlawful purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">5. Payment Terms</h2>
            <p className="mb-3">All fees are listed in Canadian Dollars (CAD) unless otherwise specified. Payment is required before report processing begins. We reserve the right to modify pricing with reasonable notice.</p>
            <p>Refunds may be provided at our discretion if a report has not yet entered processing. Once a report has been delivered, no refunds will be issued.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">6. Intellectual Property</h2>
            <p>All content on this platform — including reports, audio files, educational materials, and brand assets — is the intellectual property of BioHarmony Solutions. Reports are licensed for personal use only and may not be redistributed commercially.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, BioHarmony Solutions shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount paid for the specific service in question.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">8. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the Province of British Columbia, Canada, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">9. Contact</h2>
            <p>For questions about these Terms of Service, please contact us at <a href="mailto:contact@bioharmonysolutions.com" className="text-[#BFA14A] hover:underline">contact@bioharmonysolutions.com</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/8 text-xs text-[#F4EFE6]/25 leading-relaxed">
          BioHarmony Solutions services are for wellness education and informational purposes only. These services are not intended to diagnose, treat, cure, or prevent any disease or medical condition.
        </div>
      </div>
    </div>
  );
}
