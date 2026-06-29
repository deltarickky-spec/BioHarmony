import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/bioharmony-logo.png";
import kathyAvatar from "@/assets/kathy-clinic.jpg";


export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);


  const links = [
    { href: "/", label: "For You" },
    { href: "/sample-reports", label: "Sample Reports" },
    { href: "/for-practitioners", label: "Practitioners" },
    { href: "/upload-scan", label: "Upload Scan" },
    { href: "/membership", label: "Membership" },
    { href: "/pet-scans", label: "Pet Scans" },
  ];

  const mobileLinks = [
    { href: "/", label: "For You" },
    { href: "/sample-reports", label: "Sample Reports" },
    { href: "/for-practitioners", label: "For Practitioners" },
    { href: "/upload-scan", label: "Upload Scan" },
    { href: "/membership", label: "Membership" },
    { href: "/pet-scans", label: "Pet Scans" },
    { href: "/about", label: "About Kathy" },
    { href: "/contact", label: "Contact" },
    { href: "/track-report", label: "Track My Report", highlight: true },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#060D0D]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="rounded-xl p-0.5 shadow-[0_0_12px_rgba(191,161,74,0.25)] group-hover:shadow-[0_0_20px_rgba(191,161,74,0.4)] transition-shadow duration-300">
              <img src={logoSrc} alt="Bio-Frequency Analytics Logo" className="h-14 w-auto drop-shadow-[0_0_8px_rgba(191,161,74,0.3)]" />
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className="font-serif text-2xl font-semibold tracking-tight text-[#BFA14A] drop-shadow-[0_0_4px_rgba(191,161,74,0.2)]"
                data-testid="logo-text"
              >
                Bio-Frequency Analytics
              </span>
              <span className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-[#F4EFE6]/40 font-sans">
                <img src={logoSrc} alt="" className="h-3.5 w-auto inline-block opacity-70" />
                a division of BioHarmony Solutions
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-5">
            <div className="flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200",
                    location === link.href
                      ? "text-[#BFA14A]"
                      : "text-[#F4EFE6]/55 hover:text-[#BFA14A]/80"
                  )}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="w-px h-4 bg-white/15 mx-1" />
            <Link
              href="/track-report"
              className={cn(
                "text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                location === "/track-report"
                  ? "text-[#BFA14A]"
                  : "text-[#BFA14A]/55 hover:text-[#BFA14A]"
              )}
              data-testid="nav-link-track-report"
            >
              Track My Report
            </Link>
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="rounded-full px-6 bg-[#0F5C5E] hover:bg-[#0F5C5E]/80 text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_15px_rgba(191,161,74,0.2)] hover:shadow-[0_0_25px_rgba(191,161,74,0.4)] transition-all duration-300"
                data-testid="nav-book-now"
              >
                <Link href="/upload-scan">Submit Scan</Link>
              </Button>
            </div>
          </div>

          <button
            className="lg:hidden p-2 text-[#F4EFE6]/70 hover:text-[#BFA14A] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-white/8 bg-[#060D0D]/98 backdrop-blur-xl animate-in slide-in-from-top-4">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 text-base font-medium py-3 px-2 rounded-lg transition-all duration-200",
                  location === link.href
                    ? "text-[#BFA14A] bg-[#BFA14A]/8"
                    : link.highlight
                      ? "text-[#BFA14A]/70 hover:text-[#BFA14A] hover:bg-[#BFA14A]/6"
                      : "text-[#F4EFE6]/60 hover:text-[#BFA14A]/80 hover:bg-white/4"
                )}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.href === "/about" && (
                  <img
                    src={kathyAvatar}
                    alt="Kathy Owens"
                    className="w-7 h-7 rounded-full object-cover object-top border border-white/15 shrink-0"
                  />
                )}
                {link.label}
              </Link>
            ))}



            <Button
              asChild
              className="mt-4 rounded-full w-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_15px_rgba(191,161,74,0.2)]"
              data-testid="mobile-nav-book-now"
            >
              <Link href="/upload-scan" onClick={() => setIsOpen(false)}>Submit Scan</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
