import { Router } from "express";

const router = Router();

// ── Promo code registry ────────────────────────────────────────────────────────

export interface PromoCode {
  code: string;
  type: "percent" | "flat";
  value: number;
  label: string;
}

export const PROMO_CODES: Record<string, PromoCode> = {
  WELLNESS20:    { code: "WELLNESS20",    type: "percent", value: 20, label: "20% Wellness Discount" },
  FIRST10:       { code: "FIRST10",       type: "flat",    value: 10, label: "$10 First-Time Discount" },
  PRACTITIONER:  { code: "PRACTITIONER",  type: "percent", value: 30, label: "30% Practitioner Discount" },
};

export function getPromoCode(raw: string): PromoCode | null {
  const code = raw.trim().toUpperCase();
  return PROMO_CODES[code] ?? null;
}

/**
 * Calculate the discount amount in dollars given a promo code and plan price.
 * Returns the discounted dollar amount (always positive, never exceeds price).
 */
export function calcDiscount(promo: PromoCode, priceUsd: number): number {
  if (promo.type === "percent") {
    return Math.round((priceUsd * promo.value) / 100);
  }
  return Math.min(promo.value, priceUsd);
}

// ── Route: validate promo code ─────────────────────────────────────────────────

/**
 * GET /api/promo/validate?code=WELLNESS20
 * Returns promo code details if valid, or 404 if not found.
 * No auth required — code names are semi-public (clients enter them).
 */
router.get("/promo/validate", (req, res) => {
  const raw = (req.query["code"] as string | undefined) ?? "";
  if (!raw.trim()) {
    res.status(400).json({ valid: false, error: "No code provided" });
    return;
  }

  const promo = getPromoCode(raw);
  if (!promo) {
    res.status(404).json({ valid: false, error: "Invalid promo code" });
    return;
  }

  res.json({ valid: true, ...promo });
});

export default router;
