import { getUncachableStripeClient } from "./stripeClient.js";

const PLANS = [
  {
    name: "BioHarmony Basic Report",
    description: "Personalized wellness overview with up to 5 focus areas.",
    plan: "basic",
    amount: 5500, // $55.00 CAD
  },
  {
    name: "BioHarmony Advanced Report",
    description: "In-depth narrative report covering 10+ focus areas with BioHarmony Score.",
    plan: "advanced",
    amount: 9900, // $99.00 CAD
  },
  {
    name: "BioHarmony Premium Report",
    description: "Comprehensive full report with BioHarmony Score, audio narration, and priority review.",
    plan: "premium",
    amount: 14900, // $149.00 CAD
  },
];

async function seedProducts() {
  const stripe = await getUncachableStripeClient();
  console.log("Seeding BioHarmony products in Stripe...\n");

  for (const plan of PLANS) {
    // Check if product already exists
    const existing = await stripe.products.search({
      query: `metadata['plan']:'${plan.plan}' AND active:'true'`,
    });

    if (existing.data.length > 0) {
      const p = existing.data[0]!;
      console.log(`✓ ${plan.name} already exists (${p.id}) — skipping`);
      continue;
    }

    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.description,
      metadata: { plan: plan.plan },
    });

    // Create one-time price in CAD
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
