import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Articles" },
  { id: "ao-scan", label: "AO Scan Education" },
  { id: "pemf", label: "PEMF Therapy" },
  { id: "frequency", label: "Frequency Wellness" },
  { id: "pet", label: "Pet Wellness" },
  { id: "practitioner", label: "Practitioner Education" },
];

const ARTICLES = [
  {
    id: 1, category: "ao-scan", tag: "AO Scan Education", readTime: "5 min",
    title: "What Is AO Scan Technology?",
    excerpt: "Discover how AO Scan uses bio-frequency resonance to create a comprehensive picture of your body's energetic blueprint — and what those frequencies mean for your wellness.",
    featured: true,
  },
  {
    id: 2, category: "ao-scan", tag: "AO Scan Education", readTime: "4 min",
    title: "Understanding Your BioHarmony Intelligence Score",
    excerpt: "Your BioHarmony score is more than a number. Learn how the four pillars — Stress Load, Energy Balance, System Alignment, and Recovery Capacity — work together.",
    featured: false,
  },
  {
    id: 3, category: "ao-scan", tag: "AO Scan Education", readTime: "6 min",
    title: "AO Scan vs. Traditional Lab Tests: A Comparison",
    excerpt: "How bio-frequency analysis differs from conventional diagnostics, and why both have a role in a whole-person wellness approach.",
    featured: false,
  },
  {
    id: 4, category: "pemf", tag: "PEMF Therapy", readTime: "5 min",
    title: "How PEMF Therapy Supports Cellular Recovery",
    excerpt: "Pulsed Electromagnetic Field therapy has been studied for decades. Here's what the research says about its role in cellular repair, inflammation, and sleep.",
    featured: true,
  },
  {
    id: 5, category: "pemf", tag: "PEMF Therapy", readTime: "4 min",
    title: "PEMF Frequency Ranges: What the Numbers Mean",
    excerpt: "Delta, theta, alpha — each frequency range interacts with the body differently. A plain-language breakdown of what each range does and when it's used.",
    featured: false,
  },
  {
    id: 6, category: "frequency", tag: "Frequency Wellness", readTime: "7 min",
    title: "The Science of Frequency Medicine",
    excerpt: "From ancient tuning forks to modern bio-resonance devices, the study of frequency as a healing modality has a rich and evolving history.",
    featured: true,
  },
  {
    id: 7, category: "frequency", tag: "Frequency Wellness", readTime: "5 min",
    title: "Sound Healing and the Nervous System",
    excerpt: "Why sound frequencies — whether in music, voice, or targeted audio sessions — can shift the body's stress response and support parasympathetic balance.",
    featured: false,
  },
  {
    id: 8, category: "pet", tag: "Pet Wellness", readTime: "5 min",
    title: "Bio-Frequency Analysis for Animals: What to Expect",
    excerpt: "Animals respond to bio-frequency scanning much like humans do. Learn what a pet wellness report covers, from organ resonance to emotional stress markers.",
    featured: true,
  },
  {
    id: 9, category: "pet", tag: "Pet Wellness", readTime: "4 min",
    title: "Supporting Your Pet's Energy Field Naturally",
    excerpt: "Diet, environment, and frequency exposure all influence your pet's bioenergetic health. Simple adjustments that can make a measurable difference.",
    featured: false,
  },
  {
    id: 10, category: "practitioner", tag: "Practitioner Education", readTime: "8 min",
    title: "Integrating Bio-Frequency Reports into Your Practice",
    excerpt: "A guide for naturopaths, wellness coaches, and integrative health practitioners on how to use BioHarmony reports to support client consultations.",
    featured: true,
  },
  {
    id: 11, category: "practitioner", tag: "Practitioner Education", readTime: "6 min",
    title: "White-Label Reporting: Building Your Brand with BioHarmony",
    excerpt: "Learn how the BioHarmony practitioner white-label program works, from logo placement to custom branding on client-facing reports.",
    featured: false,
  },
  {
    id: 12, category: "practitioner", tag: "Practitioner Education", readTime: "5 min",
    title: "Frequency Wellness Ethics: Informed Consent and Scope",
    excerpt: "Best practices for practitioners offering bio-frequency services — including how to frame results, disclaimers, and appropriate referral protocols.",
    featured: false,
  },
];

export default function WellnessLibrary() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all" ? ARTICLES : ARTICLES.filter((a) => a.category === activeCategory);
  const featured = filtered.filter((a) => a.featured);
  const regular = filtered.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-[#060D0D] text-[#F4EFE6] pb-24">

      {/* Hero */}
      <div className="pt-24 pb-16 px-4 text-center border-b border-white/8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#BFA14A] mb-4">Education</p>
        <h1 className="font-serif text-5xl text-[#F4EFE6] mb-4">Wellness Library</h1>
        <p className="text-[#F4EFE6]/50 max-w-xl mx-auto leading-relaxed">
          Deepen your understanding of frequency wellness, AO Scan technology, PEMF therapy, and integrative health practices.
        </p>
      </div>

      {/* Category filter */}
      <div className="sticky top-0 z-10 bg-[#060D0D]/95 backdrop-blur-sm border-b border-white/8 px-4 py-4">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition border",
                activeCategory === cat.id
                  ? "bg-[#BFA14A]/12 text-[#BFA14A] border-[#BFA14A]/35"
                  : "bg-transparent text-[#F4EFE6]/45 border-white/8 hover:border-white/18 hover:text-[#F4EFE6]/70"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-12">

        {/* Featured articles */}
        {featured.length > 0 && (
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#F4EFE6]/30 mb-6">Featured</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featured.map((article) => (
                <div key={article.id}
                  className="group rounded-2xl border border-white/10 bg-[#0C1919] p-6 hover:border-[#BFA14A]/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#BFA14A]/70 bg-[#BFA14A]/8 px-2.5 py-1 rounded-full">{article.tag}</span>
                    <span className="text-[10px] text-[#F4EFE6]/30">{article.readTime} read</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#F4EFE6] mb-3 group-hover:text-[#BFA14A] transition-colors">{article.title}</h3>
                  <p className="text-sm text-[#F4EFE6]/50 leading-relaxed line-clamp-3">{article.excerpt}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs text-[#BFA14A]/50 group-hover:text-[#BFA14A] transition-colors">
                    Read article <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular articles */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && <p className="text-xs uppercase tracking-widest text-[#F4EFE6]/30 mb-6">More Articles</p>}
            <div className="space-y-3">
              {regular.map((article) => (
                <div key={article.id}
                  className="group flex items-start gap-5 px-5 py-4 rounded-xl border border-white/8 bg-[#0C1919]/60 hover:border-white/15 hover:bg-[#0C1919] transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] uppercase tracking-widest text-[#BFA14A]/55">{article.tag}</span>
                      <span className="text-[9px] text-[#F4EFE6]/20">·</span>
                      <span className="text-[9px] text-[#F4EFE6]/25">{article.readTime} read</span>
                    </div>
                    <h3 className="text-sm font-medium text-[#F4EFE6]/85 group-hover:text-[#F4EFE6] transition-colors">{article.title}</h3>
                    <p className="text-xs text-[#F4EFE6]/40 mt-1 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                  <span className="text-[#F4EFE6]/20 group-hover:text-[#BFA14A]/50 transition-colors text-sm shrink-0">→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24 text-[#F4EFE6]/25">No articles in this category yet.</div>
        )}

        {/* CTA */}
        <div className="mt-20 pt-12 border-t border-white/8 text-center">
          <p className="text-[#F4EFE6]/40 text-sm mb-6">Ready to experience frequency wellness for yourself?</p>
          <Link href="/upload-scan"
            className="inline-block px-8 py-3.5 bg-[#BFA14A] text-[#060D0D] rounded-xl font-semibold text-sm hover:bg-[#d4b456] transition"
          >
            Submit Your Scan
          </Link>
        </div>
      </div>
    </div>
  );
}
