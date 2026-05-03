import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-[#040A0A] border-t border-white/8 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <span className="font-serif text-2xl font-semibold text-[#BFA14A] tracking-tight">
                BioHarmony Solutions
              </span>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#F4EFE6]/35 font-sans mt-0.5">
                Bio-Frequency Analytics
              </div>
            </Link>
            <p className="text-[#F4EFE6]/70 max-w-sm font-medium text-sm leading-relaxed">
              Frequency-Based Wellness for a Deeper You
            </p>
            <p className="text-[#F4EFE6]/40 mt-4 text-sm max-w-md leading-relaxed">
              A premium wellness platform where frequency science meets personalized insight.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-[#F4EFE6]/80 mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "For You" },
                { href: "/for-practitioners", label: "For Practitioners" },
                { href: "/upload-scan", label: "Upload Scan" },
                { href: "/track-report", label: "Track My Report" },
                { href: "/membership", label: "Membership" },
                { href: "/pet-scans", label: "Pet Scans" },
                { href: "/about", label: "About Kathy" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#F4EFE6]/45 hover:text-[#BFA14A] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-[#F4EFE6]/80 mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="text-sm text-[#F4EFE6]/50">Kathy Owens</li>
              <li>
                <a
                  href="mailto:contact@bioharmonysolutions.com"
                  className="text-sm text-[#BFA14A]/70 hover:text-[#BFA14A] transition-colors"
                >
                  contact@bioharmonysolutions.com
                </a>
              </li>
              <li className="text-sm text-[#F4EFE6]/50">(555) 123-4567</li>
            </ul>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-widest text-[#F4EFE6]/30 mb-3 font-sans">All pricing in USD</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 text-center">
          <p className="mb-4 max-w-3xl mx-auto text-xs text-[#F4EFE6]/30 italic leading-relaxed">
            BioHarmony Solutions services are for wellness education and informational purposes only. These services are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Always consult a qualified healthcare professional for medical advice.
          </p>
          <p className="text-xs text-[#F4EFE6]/25">
            &copy; {new Date().getFullYear()} BioHarmony Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
