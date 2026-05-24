export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-4">Legal</p>
        <h1 className="font-serif text-4xl text-[#F4EFE6] mb-3">Privacy Policy</h1>
        <p className="text-[#F4EFE6]/40 text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-10 text-[#F4EFE6]/70 text-sm leading-relaxed">

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">1. Information We Collect</h2>
            <p className="mb-3">When you use BioHarmony Analytics, we collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Scan files and voice samples you upload</li>
              <li>Pet information (name, species, age) for pet scan requests</li>
              <li>Payment information (processed securely through Stripe — we do not store card details)</li>
              <li>Communications and notes you include with your requests</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To process your scan requests and generate your wellness report</li>
              <li>To deliver your completed reports by email or WhatsApp</li>
              <li>To communicate with you about your order status</li>
              <li>To improve our services and platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">3. Data Sharing</h2>
            <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-[#F4EFE6]/80">Service providers</strong> — such as email delivery services, payment processors (Stripe), and cloud infrastructure providers, solely to facilitate our services</li>
              <li><strong className="text-[#F4EFE6]/80">Legal authorities</strong> — when required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">4. Data Retention</h2>
            <p>We retain your personal information and scan data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data by contacting us at any time.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">5. Security</h2>
            <p>We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:contact@bioharmonysolutions.com" className="text-[#BFA14A] hover:underline">contact@bioharmonysolutions.com</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">7. Cookies</h2>
            <p>We use minimal session-based storage (such as sessionStorage) to maintain your login session on the admin and practitioner portals. We do not use tracking cookies or third-party analytics cookies.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">8. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#F4EFE6]/90 mb-3">9. Contact Us</h2>
            <p>For privacy-related inquiries, please contact:<br />
            BioHarmony Analytics — <a href="mailto:contact@bioharmonysolutions.com" className="text-[#BFA14A] hover:underline">contact@bioharmonysolutions.com</a></p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-white/8 text-xs text-[#F4EFE6]/25 leading-relaxed">
          BioHarmony Analytics is committed to protecting your privacy and handling your data with care and transparency.
        </div>
      </div>
    </div>
  );
}
