import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cards = [
  {
    id: "pet-vitals",
    title: "Pet Vitals Scan",
    price: 75,
    description:
      "A frequency-based energetic snapshot of your pet's blood biology, vital organs, and foundational glandular systems. Perfect for a quick wellness check-in or when your pet seems slightly \"off\" but you can't pinpoint why.",
    species: "Dogs, Cats, Horses",
    photo: "/assets/pet-dog.jpg",
    features: [
      "Blood biology frequency reading",
      "Organ & gland energetic assessment",
      "Quick wellness snapshot",
    ],
    gradient: "from-emerald-900/40 via-teal-800/20 to-transparent",
    pattern: "◇",
  },
  {
    id: "pet-comprehensive",
    title: "Pet Comprehensive Scan",
    price: 150,
    description:
      "A full body system analysis for your animal companion — covering every major body system, cellular frequencies, and energetic pathways. Includes a personalized 30-day wellness plan tailored to your pet's unique energetic profile.",
    species: "Dogs, Cats, Horses",
    photo: "/assets/pet-cat.jpg",
    features: [
      "Complete body system frequency analysis",
      "Cellular & energetic pathway mapping",
      "30-day personalized wellness plan",
    ],
    gradient: "from-amber-900/30 via-[#BFA14A]/10 to-transparent",
    pattern: "✦",
  },
];

export default function PetShowroom() {
  return (
    <section className="py-24 bg-[#060D0D] relative overflow-hidden border-t border-white/6">
      {/* Background subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(191,161,74,0.04)_0%,_transparent_60%)] pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <p className="text-[#BFA14A] text-xs uppercase tracking-[0.2em] font-sans mb-3">
            Animal Companions
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-[#F4EFE6] leading-tight">
            Advanced Analytics for<br />
            <span className="text-[#BFA14A]">Animal Companions</span>
          </h2>
          <p className="text-[#F4EFE6]/60 text-lg mt-4 leading-relaxed max-w-2xl mx-auto">
            Our proprietary Pet Protocol extends the same rigorous Bio-Digital Synthesis methodology to your animal companions. Unlike human-generic interpretations, our species-appropriate analysis accounts for the unique physiological frequency baselines of dogs, cats, and horses — delivering owner-friendly reports that your veterinarian can understand and work alongside.
          </p>

          {/* Pet checkmark badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              "Species-Appropriate Analysis",
              "Veterinary Disclaimer Included",
              "Owner-Friendly Reports",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#BFA14A]/15 bg-[#BFA14A]/5 text-xs text-[#F4EFE6]/70"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 text-[#BFA14A] shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2-column grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={fadeInUp}
              className="group relative flex flex-col rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl overflow-hidden hover:border-[#BFA14A]/25 transition-all duration-500 hover:shadow-[0_0_50px_rgba(191,161,74,0.08)]"
            >
              {/* Image placeholder area — gradient + pattern */}
              <div
                className={`relative h-48 bg-gradient-to-br ${card.gradient} flex items-center justify-center overflow-hidden`}
              >
                {/* Decorative circles */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-24 h-24 rounded-full border border-[#F4EFE6]/10" />
                  <div className="absolute bottom-6 right-6 w-32 h-32 rounded-full border border-[#F4EFE6]/8" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-[#BFA14A]/10" />
                </div>

                {/* Animal photo background */}
                <img
                  src={card.photo}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                />

                {/* Pattern accent */}
                <span className="absolute bottom-3 right-4 text-[#F4EFE6]/8 text-2xl font-serif">
                  {card.pattern}
                </span>

                {/* Species badge */}
                <span className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-[10px] text-[#F4EFE6]/60 uppercase tracking-wider font-sans z-10">
                  {card.species}
                </span>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-grow p-6 md:p-8">
                <h3 className="font-serif text-2xl text-[#F4EFE6] mb-2 group-hover:text-[#BFA14A]/90 transition-colors">
                  {card.title}
                </h3>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-[#BFA14A]">
                    ${card.price}
                  </span>
                  <span className="text-[#F4EFE6]/30 text-xs">USD</span>
                </div>

                <p className="text-[#F4EFE6]/60 text-sm leading-relaxed mb-6 flex-grow">
                  {card.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {card.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-[#F4EFE6]/50"
                    >
                      <span className="text-[#BFA14A]/60 mt-0.5 shrink-0">
                        ⟡
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  className="w-full rounded-full bg-[#0F5C5E] text-[#F4EFE6] border border-[#BFA14A]/20 hover:bg-[#0F5C5E]/90 hover:shadow-[0_0_25px_rgba(191,161,74,0.3)] transition-all duration-300 py-5 h-auto"
                  data-testid={`pet-showroom-${card.id}`}
                >
                  <Link href={`/upload-scan?plan=${card.id}&type=pet_scan`}>
                    Book {card.title}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-[#F4EFE6]/40 text-sm mb-4">
            Not sure which scan is right for your companion?
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#BFA14A]/30 text-[#F4EFE6]/75 hover:border-[#BFA14A]/60 hover:text-[#BFA14A] bg-transparent px-8 py-5 h-auto transition-all duration-300"
            data-testid="pet-showroom-all"
          >
            <Link href="/pet-scans">Explore All Pet Scans &rarr;</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
