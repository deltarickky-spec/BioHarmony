# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## BioHarmony Solutions — Feature Notes

### Email Notifications (`artifacts/api-server/src/services/email.ts`)
Email notifications are currently **mocked** (logged to server console via pino). The structure is fully ready for a real provider.

**To enable real email delivery:**
- Sign up for a free Resend account at [resend.com](https://resend.com) (3,000 emails/month free)
- Verify your domain `bioharmonysolutions.ca` in the Resend dashboard
- Add your API key as a secret named `RESEND_API_KEY`
- That's it — the code in `email.ts` already checks for this key and sends via Resend automatically

Note: The Replit Resend integration was dismissed during setup. To use their OAuth flow instead of a manual key, reconnect via the Integrations panel.

Admin notification email goes to `info@bioharmonysolutions.ca` (override with `ADMIN_EMAIL` env var).

### Admin Dashboard
- URL: `/admin/leads` — password protected (default: `bioharmony2025`, override with `ADMIN_PASSWORD` env var)
- Two tabs: Report Requests (modal) + Scan Uploads (upload form)

### Stripe Payments (PENDING SETUP)
All payment code is fully implemented and ready — **Stripe just needs to be connected**.

**Plans:** Basic $55 CAD, Advanced $99 CAD, Premium $149 CAD (one-time payments)

**To activate:**
1. Connect Stripe via the Replit Integrations panel (or add `STRIPE_SECRET_KEY` as a secret manually)
2. Run the seed script once: `pnpm --filter @workspace/scripts run seed-products`
   - This creates the 3 products/prices in Stripe; webhooks sync them to the local DB automatically

**Payment flow (already coded):**
- UploadScan submit → `POST /api/scan-requests` → `POST /api/stripe/checkout` → redirect to Stripe hosted checkout
- On `checkout.session.completed` webhook → `paymentStatus = paid` → pipeline auto-starts

**Key files:**
- `artifacts/api-server/src/stripeClient.ts` — Stripe + StripeSync client
- `artifacts/api-server/src/webhookHandlers.ts` — webhook verification
- `artifacts/api-server/src/services/paymentHandler.ts` — sets `paymentStatus=paid` on checkout complete
- `artifacts/api-server/src/routes/stripe.ts` — `POST /api/stripe/checkout`
- `scripts/src/seed-products.ts` — idempotent product seed script

NOTE: The Replit Stripe integration was dismissed during setup. Reconnect via the Integrations panel or store `sk_test_...` key as a secret.

### Affiliate / Referral Partner System
Full practitioner referral system for tracking commissions and partner-referred submissions.

**DB tables:**
- `practitioners` — partner records (name, email, referralCode, commissionRate, totalPaid, active)
- `scan_requests.practitioner_code` — links submissions to a practitioner referral

**API routes** (`artifacts/api-server/src/routes/practitioners.ts`):
- `GET/POST /api/admin/practitioners` — list (with live stats) + create (admin auth)
- `PATCH /api/admin/practitioners/:id` — update commission rate, notes, active status
- `POST /api/admin/practitioners/:id/payout` — record payout (increments totalPaid)
- `DELETE /api/admin/practitioners/:id` — remove partner
- `GET /api/practitioners/dashboard/:code` — public endpoint; auth by referral code

**Frontend:**
- **AdminDashboard** — `AffiliatesPanel` component: add partners, view live stats (referrals, revenue, earned commission, pending payout), mark paid
- **PractitionerPortal** — new "Referrals" tab: code lookup → stats + shareable link + recent referrals list
- **UploadScan** — reads `?ref=CODE` URL param → stores `practitionerCode` → included in scan submission

**Commission calculation:** earned = `revenueGenerated × commissionRate / 100`; pending = earned − totalPaid (computed live, not stored)

### Audio Narration
- Uses OpenAI TTS (`shimmer` voice) via `POST /api/narrate`
- Cached in `report_audio` DB table by `cacheKey-language` (e.g. `jane-en`, `jane-es`)
- Non-English: text is translated via GPT-4o-mini before TTS generation
