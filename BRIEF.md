# BioHarmony Solutions — HP Integration Brief

This document describes how HP Sage/Hermes AI must call back into the BioHarmony API
once a report has been generated.

---

## Webhook Endpoint

HP must POST to:

```
POST https://<your-replit-domain>/api/webhooks/hp-report-generated
```

### Required Headers

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |
| `x-bioharmony-signature` | `$HP_WEBHOOK_SECRET` (shared secret — see below) |

### Request Body

```json
{
  "request_id":        "BH-0042",
  "status":            "success",
  "report_text":       "Full plain-text report content here...",
  "report_pdf_url":    "https://your-storage.example.com/reports/BH-0042.pdf",
  "audio_url":         "https://your-storage.example.com/audio/BH-0042.mp3",
  "language":          "English",
  "bioharmony_score":  { "overall": 78 }
}
```

**Error case:**

```json
{
  "request_id":    "BH-0042",
  "status":        "error",
  "error_message": "Scan file was unreadable — please resubmit"
}
```

### Field Reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `request_id` | string | ✅ | Format: `BH-XXXX` (e.g. `BH-0001`) |
| `status` | `"success"` or `"error"` | ✅ | |
| `report_text` | string | No | Full text content of report |
| `report_pdf_url` | string | No | Public URL of generated PDF |
| `audio_url` | string | No | Public URL of narrated audio |
| `language` | string | No | e.g. `"English"`, `"French"` |
| `bioharmony_score.overall` | integer 0–100 | No | Stored and shown to client |
| `error_message` | string | No | Included when `status = "error"` |

---

## Security — Signature Verification

BioHarmony uses a shared secret to verify that callbacks are genuinely from HP.

### How it works

- Kathy generates a strong random secret and configures it as `HP_WEBHOOK_SECRET` in Replit Secrets.
- HP stores the same value and sends it as the `x-bioharmony-signature` header on every callback.
- BioHarmony compares the header to the stored secret using a constant-time comparison (prevents timing attacks).
- Any request with a missing or incorrect signature is rejected with **401 Unauthorized** — no DB changes, no emails.

### When verification is enforced

| `AI_PROCESSING_MODE` | Signature required? |
|---|---|
| `mock` (default) | No — safe for testing |
| `live` | Yes — required on every call |

### Switching to live mode

Set both secrets in Replit:

```
AI_PROCESSING_MODE = live
HP_WEBHOOK_SECRET  = <agreed shared secret with HP>
HP_AI_SERVER_URL   = https://your-hp-server.example.com
```

---

## What happens on a successful callback

1. Signature verified ✅
2. `request_id` parsed → database row located
3. `bioharmony_score` saved (if provided)
4. Pipeline stage advanced to `delivered`
5. Client receives **"Your Report Is Ready"** email automatically
6. If a practitioner referred this client, they receive a **commission notification** email

---

## Test Route (internal use only)

```
POST /api/test/hp-webhook
Authorization: Bearer <admin-password>
Content-Type: application/json
```

- Bypasses `AI_PROCESSING_MODE` gate — always processes the payload
- Protected by admin auth — not reachable without the admin password
- Use `"request_id": "BH-TEST-001"` for a dry-run (no DB changes)
- Use a real `"request_id": "BH-0001"` to exercise the full pipeline

---

## Existing Webhook Placeholders

These endpoints exist and return 200 for future use:

| Endpoint | Purpose |
|---|---|
| `POST /api/webhooks/payment-success` | Payment confirmation from payment provider |
| `POST /api/webhooks/report-generated` | Generic report-ready signal |
| `POST /api/webhooks/audio-ready` | Audio narration ready |
| `POST /api/webhooks/delivery-complete` | Delivery confirmed |
| `POST /api/webhooks/sage-hermes-status` | Stage progress updates from Sage/Hermes |
