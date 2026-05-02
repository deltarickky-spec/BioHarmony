import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import logoSrc from "@/assets/logo-concept-1.png";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const desktopLinks = [
    { href: "/", label: "For You" },
    { href: "/for-practitioners", label: "For Practitioners" },
    { href: "/upload-scan", label: "Upload Scan" },
    { href: "/membership", label: "Membership" },
    { href: "/pet-scans", label: "Pet Scans" },
  ];

  const mobileLinks = [
    { href: "/", label: "For You" },
    { href: "/ao-scan", label: "AO Scan" },
    { href: "/pemf-therapy", label: "PEMF Therapy" },
    { href: "/bioharmony-analytics", label: "BioHarmony Analytics" },
    { href: "/upload-scan", label: "Upload Scan" },
    { href: "/membership", label: "Membership" },
    { href: "/pet-scans", label: "Pet Scans" },
    { href: "/for-practitioners", label: "For Practitioners" },
    { href: "/about", label: "About Kathy" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <img src={logoSrc} alt="BioHarmony Solutions Logo" className="h-10 w-auto" />
            <span className="font-serif text-xl md:text-2xl font-semibold text-primary tracking-tight" data-testid="logo-text">
              BioHarmony Solutions
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <div className="flex gap-3 xl:gap-5">
              {desktopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs xl:text-sm font-medium transition-colors hover:text-primary",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5" data-testid="nav-book-now">
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-in slide-in-from-top-4">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-medium py-2 transition-colors",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2 rounded-full w-full" data-testid="mobile-nav-book-now">
              <Link href="/contact" onClick={() => setIsOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
