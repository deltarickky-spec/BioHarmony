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
1. Get an API key from [Resend](https://resend.com) (free tier: 3,000 emails/month) or SendGrid
2. Add the key as a secret: `RESEND_API_KEY` or `SENDGRID_API_KEY`
3. Set `EMAIL_PROVIDER=resend` or `EMAIL_PROVIDER=sendgrid` as an env var
4. Implement the provider call in the `sendEmail()` function body in `email.ts`

Admin notification email goes to `info@bioharmonysolutions.ca` (override with `ADMIN_EMAIL` env var).

### Admin Dashboard
- URL: `/admin/leads` — password protected (default: `bioharmony2025`, override with `ADMIN_PASSWORD` env var)
- Two tabs: Report Requests (modal) + Scan Uploads (upload form)

### Audio Narration
- Uses OpenAI TTS (`shimmer` voice) via `POST /api/narrate`
- Cached in `report_audio` DB table by `cacheKey-language` (e.g. `jane-en`, `jane-es`)
- Non-English: text is translated via GPT-4o-mini before TTS generation
