import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo-concept-1.png";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "For You" },
    { href: "/for-practitioners", label: "For Practitioners" },
    { href: "/upload-scan", label: "Upload Scan" },
    { href: "/membership", label: "Membership" },
    { href: "/pet-scans", label: "Pet Scans" },
  ];

  const mobileLinks = [
    { href: "/", label: "For You" },
    { href: "/for-practitioners", label: "For Practitioners" },
    { href: "/upload-scan", label: "Upload Scan" },
    { href: "/membership", label: "Membership" },
    { href: "/pet-scans", label: "Pet Scans" },
    { href: "/about", label: "About Kathy" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#060D0D]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <img src={logoSrc} alt="BioHarmony Solutions Logo" className="h-9 w-auto opacity-90" />
            <div className="flex flex-col leading-tight">
              <span
                className="font-serif text-xl font-semibold tracking-tight text-[#BFA14A]"
                data-testid="logo-text"
              >
                BioHarmony Solutions
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#F4EFE6]/40 font-sans">
                Bio-Frequency Analytics
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
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
            <Button
              asChild
              className="rounded-full px-6 bg-[#0F5C5E] hover:bg-[#0F5C5E]/80 text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_15px_rgba(191,161,74,0.2)] hover:shadow-[0_0_25px_rgba(191,161,74,0.4)] transition-all duration-300"
              data-testid="nav-book-now"
            >
              <Link href="/contact">Book Now</Link>
            </Button>
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
                  "text-base font-medium py-3 px-2 rounded-lg transition-all duration-200",
                  location === link.href
                    ? "text-[#BFA14A] bg-[#BFA14A]/8"
                    : "text-[#F4EFE6]/60 hover:text-[#BFA14A]/80 hover:bg-white/4"
                )}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              asChild
              className="mt-4 rounded-full w-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 shadow-[0_0_15px_rgba(191,161,74,0.2)]"
              data-testid="mobile-nav-book-now"
            >
              <Link href="/contact" onClick={() => setIsOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
