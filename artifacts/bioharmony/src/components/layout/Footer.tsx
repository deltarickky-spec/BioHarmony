import { Link } from "wouter";
import kathyAvatar from "@/assets/kathy-owens.jpg";

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
              <div className="text-[10px] tracking-[0.18em] text-[#F4EFE6]/35 font-sans mt-0.5">
                BioAnalytics by BioHarmony Solutions
              </div>
            </Link>
            <p className="text-[#F4EFE6]/70 max-w-sm font-medium text-sm leading-relaxed">
              Complex Scan Data. Clear Human Insight.
            </p>
            <p className="text-[#F4EFE6]/40 mt-4 text-sm max-w-md leading-relaxed">
              Personalized, easy-to-understand wellness reports for clients and practitioners.
            </p>
            <p className="text-[#F4EFE6]/25 mt-3 text-xs italic">
              Educational wellness insight • Not diagnostic
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-[#F4EFE6]/80 mb-5 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "For You" },
                { href: "/for-practitioners", label: "For Practitioners" },
                { href: "/upload-scan", label: "Upload Scan" },
                { href: "/client-portal", label: "Client Portal" },
                { href: "/track-report", label: "Track My Report" },
                { href: "/wellness-library", label: "Wellness Library" },
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
              <li>
                <Link href="/about" className="flex items-center gap-3 group">
                  <img
                    src={kathyAvatar}
                    alt="Kathy Owens"
                    className="w-10 h-10 rounded-full object-cover object-top border border-white/10 group-hover:border-[#BFA14A]/40 transition-colors"
                  />
                  <div>
                    <p className="text-sm text-[#F4EFE6]/70 group-hover:text-[#BFA14A]/80 transition-colors font-medium">Kathy Owens</p>
                    <p className="text-[10px] text-[#F4EFE6]/30 uppercase tracking-wider">Founder & Practitioner</p>
                  </div>
                </Link>
              </li>
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
          <div className="flex items-center justify-center gap-5 mb-5">
            <Link href="/terms" className="text-xs text-[#F4EFE6]/25 hover:text-[#BFA14A]/60 transition">Terms of Service</Link>
            <span className="text-white/10">·</span>
            <Link href="/privacy" className="text-xs text-[#F4EFE6]/25 hover:text-[#BFA14A]/60 transition">Privacy Policy</Link>
            <span className="text-white/10">·</span>
            <Link href="/disclaimer" className="text-xs text-[#F4EFE6]/25 hover:text-[#BFA14A]/60 transition">Wellness Disclaimer</Link>
          </div>
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
