import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card pt-16 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-primary tracking-tight">
                BioHarmony Solutions
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm font-medium">
              Frequency-Based Wellness for a Deeper You
            </p>
            <p className="text-muted-foreground mt-6 text-sm max-w-md">
              A serene private wellness sanctuary where science meets nature.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/ao-scan" className="text-sm text-muted-foreground hover:text-primary transition-colors">AO Scan</Link></li>
              <li><Link href="/upload-scan" className="text-sm text-muted-foreground hover:text-primary transition-colors">Upload Scan</Link></li>
              <li><Link href="/membership" className="text-sm text-muted-foreground hover:text-primary transition-colors">Membership</Link></li>
              <li><Link href="/pet-scans" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pet Scans</Link></li>
              <li><Link href="/for-practitioners" className="text-sm text-muted-foreground hover:text-primary transition-colors">For Practitioners</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Kathy</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">Kathy Owens</li>
              <li className="text-sm text-muted-foreground">contact@bioharmonysolutions.com</li>
              <li className="text-sm text-muted-foreground">(555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p className="mb-4 max-w-3xl mx-auto italic">
            BioHarmony Solutions services are for wellness education and informational purposes only. These services are not intended to diagnose, treat, cure, or prevent any disease or medical condition. Always consult a qualified healthcare professional for medical advice.
          </p>
          <p>
            &copy; {new Date().getFullYear()} BioHarmony Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
