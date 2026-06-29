import { getUncachableStripeClient } from "./stripeClient.js";

const PLANS: { plan: string; name: string; description: string; amount: number }[] = [
  { plan: "inner-voice",           name: "BioHarmony Inner Voice Scan",      description: "Voice frequency emotional analysis with balancing audio.",          amount: 3300 },
  { plan: "vitals",                name: "BioHarmony Vitals Scan",           description: "Snapshot of your body's core energetic systems.",                  amount: 4400 },
  { plan: "body-system",           name: "BioHarmony Body System Scan",      description: "Deep-dive into one specific body system of your choice.",          amount: 6600 },
  { plan: "comprehensive",         name: "BioHarmony Comprehensive Scan",    description: "Flagship full-body energetic analysis using the Solex 1–9 scale.", amount: 9700 },
  { plan: "dental",                name: "BioHarmony Dental Scan",           description: "Tooth-by-tooth energetic assessment of teeth, jaw, oral tissues.", amount: 5500 },
  { plan: "tmj",                   name: "BioHarmony TMJ Scan",              description: "Specialized scan for the temporomandibular (jaw) joint.",          amount: 5500 },
  { plan: "ao-mindsync",           name: "BioHarmony AO Mindsync",           description: "Personalized affirmation + 8Hz binaural audio for mindfulness.",   amount: 3300 },
  { plan: "quick-wellness",        name: "Quick Wellness Check",             description: "Package: Vitals Scan only — quick energetic overview.",            amount: 4400 },
  { plan: "emotional-balance",     name: "Emotional Balance Package",        description: "Package: Inner Voice Scan with emotional frequency report.",       amount: 3300 },
  { plan: "body-system-focus",     name: "Body System Focus Package",        description: "Package: Body System Scan (you choose the system).",               amount: 6600 },
  { plan: "complete-wellness",     name: "Complete Wellness Package",        description: "Package: Full Comprehensive Scan — single person, one session.",   amount: 9700 },
  { plan: "oral-health-plus",      name: "Oral Health Plus Package",         description: "Package: Dental Scan + TMJ Scan combined.",                        amount: 8800 },
  { plan: "mind-body-harmony",     name: "Mind-Body Harmony Package",        description: "Package: Inner Voice + Vitals + AO Mindsync.",                     amount: 7700 },
  { plan: "ultimate-wellness",     name: "Ultimate Wellness Package",        description: "Package: Comprehensive + Inner Voice + Vitals for the full picture.", amount: 13300 },
  { plan: "premium-interpretation", name: "Premium Interpretation Package",  description: "Comprehensive Scan + 30–45 min 1-on-1 with Kathy Owens.",          amount: 29700 },
  { plan: "pet-vitals",            name: "Pet Vitals Scan",                  description: "Energetic snapshot of your pet's blood biology, organs, glands.",  amount: 7500 },
  { plan: "pet-comprehensive",     name: "Pet Comprehensive Scan",           description: "Full body system analysis for pets with 30-day wellness plan.",    amount: 15000 },
];

async function seedProducts() {
  const stripe = await getUncachableStripeClient();
  console.log("Seeding Bio-Frequency Analytics products in Stripe (CAD)...\n");

  for (const plan of PLANS) {
    const existing = await stripe.products.search({
      query: `metadata['plan']:'${plan.plan}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      const p = existing.data[0]!;
      console.log(`✓ ${plan.name} already exists (${p.id}) — skipping`);
      continue;
    }

    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: { plan: plan.plan },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: "cad",
    });

    console.log(`✓ Created: ${plan.name}`);
    console.log(`  Product ID: ${product.id}`);
    console.log(`  Price ID:   ${price.id}  ($${(plan.amount / 100).toFixed(2)} CAD)\n`);
  }

  console.log("Done. Webhooks will sync these products to the local database automatically.");
}

seedProducts().catch((err) => {
  console.error("Error seeding products:", err);
  process.exit(1);
});
