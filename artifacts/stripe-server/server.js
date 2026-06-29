import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";

// ── Paths ────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env from the bioharmony frontend project
const ENV_PATH = path.resolve(__dirname, "..", "bioharmony", ".env");

function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error(`[stripe-server] .env not found at ${ENV_PATH}`);
    return {};
  }
  const raw = fs.readFileSync(ENV_PATH, "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error("[stripe-server] STRIPE_SECRET_KEY not found in .env — aborting");
  process.exit(1);
}

// Determine if test mode
const IS_TEST = STRIPE_SECRET_KEY.startsWith("sk_test_");

import Stripe from "stripe";
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

// ── Pricing Tiers ─────────────────────────────────────────────────────────────
const PLANS = {
  "practitioner-solo":   { label: "Solo Practitioner",   price: 4900, scans: 10  },  // $49.00
  "practitioner-growth": { label: "Growth Practitioner", price: 7900, scans: 25  },  // $79.00
  "practitioner-elite":  { label: "Elite Practitioner",  price: 14900, scans: 60 },  // $149.00
};

const MEMBERSHIP_PLANS = {
  "membership-access": { label: "BioHarmony Access", price: 9700, scans: 1 },
  "membership-pro":    { label: "BioHarmony Pro",    price: 14700, scans: 2 },
  "membership-unlimited": { label: "BioHarmony Unlimited", price: 24700, scans: -1 },
};

const ALL_PLANS = { ...PLANS, ...MEMBERSHIP_PLANS };

// ── Promo Codes ───────────────────────────────────────────────────────────────
const PROMO_CODES = {
  WELLNESS20:    { type: "percent", value: 20, label: "20% Wellness Discount" },
  FIRST10:       { type: "flat",    value: 10, label: "$10 First-Time Discount" },
  PRACTITIONER:  { type: "percent", value: 30, label: "30% Practitioner Discount" },
  TEST100:       { type: "percent", value: 100, label: "100% Off - Test Only" },
  TEST50:        { type: "percent", value: 50, label: "50% Off - Test Only" },
};

function getPromoCode(raw) {
  const code = (raw || "").trim().toUpperCase();
  return PROMO_CODES[code] || null;
}

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: true, credentials: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", mode: IS_TEST ? "test" : "live", timestamp: new Date().toISOString() });
});

// ── Promo Code Validation ─────────────────────────────────────────────────────
app.get("/api/promo/validate", (req, res) => {
  const raw = req.query.code;
  if (!raw) {
    return res.status(400).json({ valid: false, error: "No code provided" });
  }
  const promo = getPromoCode(raw);
  if (!promo) {
    return res.status(404).json({ valid: false, error: "Invalid promo code" });
  }
  res.json({ valid: true, ...promo });
});

// ── Subscription Checkout ─────────────────────────────────────────────────────
app.post("/api/stripe/subscription-checkout", express.json(), async (req, res) => {
  try {
    const { planId, promoCode, customerEmail, successUrl, cancelUrl } = req.body;

    if (!planId || !ALL_PLANS[planId]) {
      return res.status(400).json({ error: `Invalid plan: ${planId}. Valid: ${Object.keys(ALL_PLANS).join(", ")}` });
    }

    const plan = ALL_PLANS[planId];
    let finalPrice = plan.price; // in cents
    let appliedPromo = null;

    // Apply promo code if provided
    if (promoCode) {
      const promo = getPromoCode(promoCode);
      if (!promo) {
        return res.status(400).json({ error: `Invalid promo code: ${promoCode}` });
      }
      appliedPromo = promo;
      if (promo.type === "percent") {
        finalPrice = Math.round(finalPrice * (100 - promo.value) / 100);
      } else {
        finalPrice = Math.max(0, finalPrice - promo.value * 100);
      }
    }

    // For subscriptions, we need to create or retrieve a price in Stripe
    // If promo code applied, we use a one-time discount via coupon or adjust line items
    // Simplest approach: create the product + price in Stripe if not exists, or use ad-hoc pricing

    // Create a one-time price for this specific checkout
    const product = await stripe.products.create({
      name: `BioHarmony ${plan.label}`,
      description: `${plan.scans === -1 ? "Unlimited" : plan.scans} scans/month`,
      metadata: { planId, scans: String(plan.scans) },
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: finalPrice,
      currency: "usd",
      recurring: { interval: "month" },
    });

    const domain = req.headers.origin || "http://localhost:5173";

    const sessionParams = {
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: successUrl || `${domain}/membership?success=true&plan=${planId}`,
      cancel_url: cancelUrl || `${domain}/membership?cancelled=true`,
      metadata: {
        planId,
        scans: String(plan.scans),
        ...(appliedPromo ? { promoCode, promoType: appliedPromo.type, promoValue: String(appliedPromo.value), promoLabel: appliedPromo.label } : {}),
      },
      subscription_data: {
        metadata: {
          planId,
          scans: String(plan.scans),
          ...(appliedPromo ? { promoCode, promoLabel: appliedPromo.label } : {}),
        },
      },
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log(`[stripe-server] Checkout created: plan=${planId}, price=${finalPrice}¢, session=${session.id}${appliedPromo ? `, promo=${promoCode}` : ""}`);

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("[stripe-server] Checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Stripe Webhook ────────────────────────────────────────────────────────────
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res.status(400).json({ error: "Missing stripe-signature" });
  }

  let event;
  try {
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // No webhook secret configured — parse directly (development only)
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error("[stripe-server] Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log(`[stripe-server] ✅ Checkout completed: ${session.id}, customer: ${session.customer}, subscription: ${session.subscription}`);
        console.log(`[stripe-server]   Plan: ${session.metadata.planId}, Scans: ${session.metadata.scans}`);
        if (session.metadata.promoCode) {
          console.log(`[stripe-server]   Promo applied: ${session.metadata.promoCode} (${session.metadata.promoLabel})`);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        console.log(`[stripe-server] 💰 Invoice paid: ${invoice.id}, subscription: ${invoice.subscription}, amount: ${invoice.amount_paid}¢`);
        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object;
        console.log(`[stripe-server] ❌ Invoice payment failed: ${failedInvoice.id}, subscription: ${failedInvoice.subscription}`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        console.log(`[stripe-server] 🔄 Subscription updated: ${sub.id}, status: ${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object;
        console.log(`[stripe-server] 🗑️ Subscription cancelled: ${deletedSub.id}`);
        break;
      }

      default:
        console.log(`[stripe-server] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[stripe-server] Webhook handler error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Serve Built Frontend ──────────────────────────────────────────────────────
const FRONTEND_DIST = path.resolve(__dirname, "..", "bioharmony", "dist");
if (fs.existsSync(FRONTEND_DIST)) {
  console.log(`[stripe-server] Serving static frontend from: ${FRONTEND_DIST}`);
  app.use(express.static(FRONTEND_DIST));

  // SPA fallback — all non-API routes serve index.html for client-side routing
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api/")) return; // shouldn't reach here
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
} else {
  console.log(`[stripe-server] ⚠ Frontend build not found at ${FRONTEND_DIST}`);
  console.log(`[stripe-server]   Run: cd ../bioharmony && pnpm build`);
}

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "8303", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n╔══════════════════════════════════════════════╗`);
  console.log(`║   BioHarmony Stripe Server                  ║`);
  console.log(`║   Mode: ${IS_TEST ? "TEST (sk_test)" : "LIVE (sk_live)".padEnd(37)}║`);
  console.log(`║   Port: ${String(PORT).padEnd(37)}║`);
  console.log(`║   Plans: ${Object.keys(ALL_PLANS).length} configured             ║`);
  console.log(`║   Promos: ${Object.keys(PROMO_CODES).length} configured             ║`);
  console.log(`╚══════════════════════════════════════════════╝\n`);
});
