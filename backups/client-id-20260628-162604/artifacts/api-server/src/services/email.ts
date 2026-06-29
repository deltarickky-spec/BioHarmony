import { Resend } from "resend";
import { logger } from "../lib/logger";
import { getPlanPrice, getPlanLabel, planHasAudio } from "../pricing";

const ADMIN_EMAIL =
  process.env["ADMIN_NOTIFICATION_EMAIL"] ??
  process.env["ADMIN_EMAIL"] ??
  "info@bioharmonysolutions.ca";
const SITE_URL = process.env["SITE_URL"] ?? "https://bioharmonysolutions.ca";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface ReportNotificationData {
  name: string;
  email: string;
  phone?: string;
  reportType: string;
  fileName?: string;
  language?: string;
  whatsapp?: boolean;
  note?: string;
  source?: "report" | "scan";
  submittedAt: Date;
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function row(label: string, value: string | undefined, fallback = "—"): string {
  return `
    <tr>
      <td style="padding:10px 14px;background:#0f2020;border-bottom:1px solid #1a3535;
                 color:#BFA14A;font-size:13px;font-weight:600;width:38%;vertical-align:top;
                 font-family:Georgia,serif;">${label}</td>
      <td style="padding:10px 14px;background:#0c1919;border-bottom:1px solid #1a3535;
                 color:#F4EFE6;font-size:13px;font-family:Arial,sans-serif;vertical-align:top;">
        ${value ?? fallback}
      </td>
    </tr>`;
}

function textRow(label: string, value: string | undefined, fallback = "—"): string {
  return `${label}: ${value ?? fallback}\n`;
}

export function buildReportNotificationEmail(data: ReportNotificationData): EmailPayload {
  const sourceLabel = data.source === "scan" ? "Scan Upload" : "Report Request";
  const subject = `New BioHarmony ${sourceLabel} — ${data.name}`;
  const dateStr = formatDate(data.submittedAt);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);
                     border-radius:12px 12px 0 0;padding:32px 32px 24px;
                     border-top:3px solid #BFA14A;">
            <p style="margin:0 0 6px;color:#BFA14A;font-size:11px;
                      letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions — Admin Notification
            </p>
            <h1 style="margin:0;color:#F4EFE6;font-size:22px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              New ${sourceLabel} Received
            </h1>
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:16px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.7;">
              ${data.name}
            </p>
          </td>
        </tr>

        <!-- Details table -->
        <tr>
          <td style="background:#0c1919;padding:0;border-radius:0 0 12px 12px;overflow:hidden;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Client Name", data.name)}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#4ecdc4;text-decoration:none;">${data.email}</a>`)}
              ${data.phone ? row("Phone", data.phone) : ""}
              ${row("Report Type", data.reportType)}
              ${data.fileName ? row("File Uploaded", data.fileName) : ""}
              ${data.language ? row("Language", data.language) : ""}
              ${data.whatsapp !== undefined ? row("WhatsApp Delivery", data.whatsapp ? "Yes" : "No") : ""}
              ${data.note ? row("Note / Message", `<em style="color:#F4EFE6;opacity:0.85;">"${data.note}"</em>`) : ""}
              ${row("Submitted", dateStr)}
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:20px 24px;border-top:1px solid #1a3535;text-align:center;">
                  <a href="${SITE_URL}/admin"
                     style="display:inline-block;padding:10px 28px;background:#BFA14A;
                            color:#060D0D;font-size:13px;font-weight:600;text-decoration:none;
                            border-radius:6px;font-family:Arial,sans-serif;">
                    View in Admin Dashboard
                  </a>
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 24px 20px;text-align:center;">
                  <p style="margin:0;color:#F4EFE6;font-size:11px;opacity:0.35;font-family:Arial,sans-serif;">
                    BioHarmony Solutions &nbsp;·&nbsp; info@bioharmonysolutions.ca
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `New BioHarmony ${sourceLabel}`,
    `================================`,
    textRow("Client Name", data.name),
    textRow("Email", data.email),
    data.phone ? textRow("Phone", data.phone) : "",
    textRow("Report Type", data.reportType),
    data.fileName ? textRow("File Uploaded", data.fileName) : "",
    data.language ? textRow("Language", data.language) : "",
    data.whatsapp !== undefined
      ? textRow("WhatsApp Delivery", data.whatsapp ? "Yes" : "No")
      : "",
    data.note ? textRow("Note / Message", data.note) : "",
    textRow("Submitted", dateStr),
    ``,
    `View dashboard: ${SITE_URL}/admin`,
    ``,
    `BioHarmony Solutions`,
  ]
    .filter(Boolean)
    .join("\n");

  return { to: ADMIN_EMAIL, subject, html, text };
}

export interface ClientConfirmationData {
  name: string;
  email: string;
  reportType: string;
  source: "report" | "scan";
  fileName?: string;
  language?: string;
  whatsapp?: boolean;
  note?: string;
  promoCode?: string;
  discountAmount?: number;
  plan?: string;
}

// ── Delivered notification ─────────────────────────────────────────────────────

export interface DeliveredEmailData {
  name: string;
  email: string;
  requestId: string;  // e.g. "BH-0042"
  plan: string;       // "basic" | "advanced" | "premium"
  whatsapp: boolean;
  reportType: string;
  promoCode?: string;
  discountAmount?: number;
}

/**
 * Build the "Your BioHarmony Report Is Ready" client email.
 *
 * This email is triggered automatically by the pipeline scheduler when a request
 * reaches the "delivered" stage with a confirmed payment.
 *
 * Structured for SendGrid / Resend / SMTP — currently sent via Resend if
 * RESEND_API_KEY is set, otherwise logged as a mock email.
 */
export function buildDeliveredEmail(data: DeliveredEmailData): EmailPayload {
  const subject = "Your BioHarmony Report Is Ready";
  const firstName = data.name.split(" ")[0] ?? data.name;
  const trackUrl = `${SITE_URL}/track-report?id=${encodeURIComponent(data.requestId)}`;
  const isPremium = planHasAudio(data.plan);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);
                     border-radius:12px 12px 0 0;padding:44px 40px 36px;
                     border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 16px;color:#BFA14A;font-size:11px;
                      letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:24px;margin-bottom:20px;">✓</div>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:28px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Your Report Is Ready
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:16px;
                      font-family:Georgia,serif;font-style:italic;
                      opacity:0.65;line-height:1.6;">
              Hi ${firstName}, your BioHarmony report has been completed.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="border-top:1px solid #1a3535;"></td>
                <td style="padding:0 14px;white-space:nowrap;color:#BFA14A;font-size:11px;
                           letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">
                  Your personalised wellness report
                </td>
                <td style="border-top:1px solid #1a3535;"></td>
              </tr>
            </table>

            <!-- Message -->
            <p style="margin:0 0 24px;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.82;line-height:1.8;">
              Your BioHarmony report is ready. You can view and download your report by visiting the link below:
            </p>

            ${data.promoCode && data.discountAmount != null ? `
            <!-- Promo savings note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#0f2020;border-left:3px solid #BFA14A;
                           padding:12px 18px;border-radius:0 8px 8px 0;">
                  <p style="margin:0;color:#F4EFE6;font-size:13px;opacity:0.8;
                             font-family:Arial,sans-serif;line-height:1.5;">
                    🏷️ You saved <strong style="color:#BFA14A;">$${data.discountAmount}</strong> with promo code
                    <span style="font-family:monospace;color:#BFA14A;font-weight:600;">${data.promoCode}</span>.
                  </p>
                </td>
              </tr>
            </table>
            ` : ""}

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;padding:8px 0;">
                  <a href="${trackUrl}"
                     style="display:inline-block;padding:14px 36px;
                            background:linear-gradient(135deg,#0F5C5E,#0a4a4c);
                            color:#F4EFE6;font-size:15px;font-weight:600;
                            text-decoration:none;border-radius:8px;
                            font-family:Arial,sans-serif;
                            border:1px solid rgba(191,161,74,0.35);
                            box-shadow:0 0 20px rgba(15,92,94,0.4);">
                    View My Report →
                  </a>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;padding-top:10px;">
                  <p style="margin:0;color:#F4EFE6;font-size:11px;opacity:0.3;
                             font-family:Arial,sans-serif;">
                    Request ID: ${data.requestId}
                  </p>
                </td>
              </tr>
            </table>

            ${(data.whatsapp || isPremium) ? `
            <!-- Delivery note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#0f2020;border-left:3px solid #BFA14A;
                           padding:14px 18px;border-radius:0 8px 8px 0;">
                  <p style="margin:0 0 6px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    Additional delivery options
                  </p>
                  <p style="margin:0;color:#F4EFE6;font-size:13px;opacity:0.75;
                             font-family:Arial,sans-serif;line-height:1.6;">
                    ${data.whatsapp ? "WhatsApp delivery will be sent to your registered number shortly. " : ""}
                    ${isPremium ? "Your audio narration will appear on your report page when available." : ""}
                  </p>
                </td>
              </tr>
            </table>
            ` : ""}

            <!-- Questions -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 8px;color:#F4EFE6;font-size:14px;
                             font-family:Georgia,serif;opacity:0.75;">
                    Questions about your report?
                  </p>
                  <a href="mailto:info@bioharmonysolutions.ca?subject=Re: My BioHarmony Report ${encodeURIComponent(data.requestId)}"
                     style="color:#4ecdc4;font-size:13px;font-family:Arial,sans-serif;
                            text-decoration:none;font-weight:600;">
                    info@bioharmonysolutions.ca
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:28px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.55;">
              Warmly,
            </p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;
                      font-family:Georgia,serif;font-weight:600;opacity:0.85;">
              Kathy Owens
            </p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.3;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because you submitted a scan request at bioharmonysolutions.ca
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Your BioHarmony Report Is Ready`,
    `=================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `Your BioHarmony report is ready.`,
    ``,
    `You can view and download your report here:`,
    trackUrl,
    `Request ID: ${data.requestId}`,
    ``,
    data.promoCode && data.discountAmount != null
      ? `🏷️ You saved $${data.discountAmount} with promo code ${data.promoCode}.`
      : "",
    data.whatsapp ? `WhatsApp delivery will be sent to your registered number shortly.` : "",
    isPremium ? `Your audio narration will appear on your report page when available.` : "",
    ``,
    `If you have any questions about your report, please reply to this email`,
    `or contact us at info@bioharmonysolutions.ca`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].filter((l) => l !== undefined).join("\n");

  return { to: data.email, subject, html, text };
}

// ── Payment reminder email ─────────────────────────────────────────────────────

export interface PaymentReminderData {
  name: string;
  email: string;
  requestId: string;
  paymentUrl: string;
  whatsapp: boolean;
  promoCode?: string;
  discountAmount?: number;
  plan?: string;
}

/**
 * Build the "Complete Your BioHarmony Report" payment reminder email.
 * Sent automatically 24 hours after a pending scan request has not been paid.
 */
export function buildPaymentReminderEmail(data: PaymentReminderData): EmailPayload {
  const subject = "Complete Your BioHarmony Report";
  const firstName = data.name.split(" ")[0] ?? data.name;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);
                     border-radius:12px 12px 0 0;padding:44px 40px 36px;
                     border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;
                      letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:22px;margin-bottom:20px;">⏳</div>
            <h1 style="margin:0 0 12px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Your report is ready to begin
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;
                      font-family:Georgia,serif;font-style:italic;
                      opacity:0.65;line-height:1.6;">
              Hi ${firstName}, we're just waiting for your payment to start processing.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">

            <p style="margin:0 0 ${data.promoCode ? "16px" : "28px"};color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.82;line-height:1.8;">
              Your report is ready to begin — we're just waiting for your payment to start processing.
              Once your payment is confirmed, your report will immediately enter the AI processing queue.
            </p>

            ${data.promoCode && data.discountAmount != null ? `
            <!-- Promo discount banner -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#0f2020;border:1px solid rgba(191,161,74,0.3);
                           border-radius:10px;padding:14px 20px;">
                  <p style="margin:0 0 4px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.18em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    Your promo discount
                  </p>
                  <p style="margin:0;color:#F4EFE6;font-size:14px;
                             font-family:Georgia,serif;line-height:1.5;opacity:0.9;">
                    Code <strong style="color:#BFA14A;font-family:monospace;">${data.promoCode}</strong>
                    saves you <strong style="color:#BFA14A;">$${data.discountAmount}</strong>
                    ${data.plan ? `— your price is <strong style="color:#F4EFE6;">$${Math.max(0, getPlanPrice(data.plan) - data.discountAmount)}</strong>` : ""}.
                    This discount is already applied to your order.
                  </p>
                </td>
              </tr>
            </table>
            ` : ""}

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;padding:8px 0;">
                  <a href="${data.paymentUrl}"
                     style="display:inline-block;padding:16px 40px;
                            background:linear-gradient(135deg,#BFA14A,#d4b456);
                            color:#060D0D;font-size:16px;font-weight:700;
                            text-decoration:none;border-radius:8px;
                            font-family:Arial,sans-serif;
                            box-shadow:0 0 24px rgba(191,161,74,0.4);">
                    Complete My Payment →
                  </a>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;padding-top:10px;">
                  <p style="margin:0;color:#F4EFE6;font-size:11px;opacity:0.3;font-family:Arial,sans-serif;">
                    Reference: ${data.requestId}
                  </p>
                </td>
              </tr>
            </table>

            <!-- What's included note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#0f2020;border-left:3px solid #BFA14A;
                           padding:14px 18px;border-radius:0 8px 8px 0;">
                  <p style="margin:0 0 6px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    Once payment is confirmed
                  </p>
                  <p style="margin:0;color:#F4EFE6;font-size:13px;opacity:0.75;
                             font-family:Arial,sans-serif;line-height:1.6;">
                    Your scan data immediately enters our AI pipeline — typically completing within 2–4 hours.
                    ${data.whatsapp ? "Your completed report will be delivered via WhatsApp." : "Your completed report will be sent to this email address."}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Questions CTA -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 8px;color:#F4EFE6;font-size:13px;
                             font-family:Arial,sans-serif;opacity:0.65;">
                    Need help or have questions?
                  </p>
                  <a href="mailto:info@bioharmonysolutions.ca?subject=Re: Payment - ${data.requestId}"
                     style="color:#4ecdc4;font-size:13px;font-family:Arial,sans-serif;
                            text-decoration:none;font-weight:600;">
                    info@bioharmonysolutions.ca
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:28px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.55;">
              Warmly,
            </p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;
                      font-family:Georgia,serif;font-weight:600;opacity:0.85;">
              Kathy Owens
            </p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.3;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because you submitted a scan request at bioharmonysolutions.ca.
              If you no longer wish to proceed, simply ignore this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Complete Your BioHarmony Report`,
    `================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `Your report is ready to begin — we're just waiting for your payment to start processing.`,
    ``,
    data.promoCode && data.discountAmount != null
      ? `Promo code ${data.promoCode} saves you $${data.discountAmount}${data.plan ? ` — your price is $${Math.max(0, getPlanPrice(data.plan) - data.discountAmount)}` : ""}.`
      : "",
    `Complete your request here:`,
    data.paymentUrl,
    `Reference: ${data.requestId}`,
    ``,
    `Once completed, your report will immediately enter the AI processing queue.`,
    ``,
    data.whatsapp
      ? `Your completed report will be delivered via WhatsApp.`
      : `Your completed report will be sent to this email address.`,
    ``,
    `Questions? Email us at info@bioharmonysolutions.ca`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.email, subject, html, text };
}

// ── Shared send helper ─────────────────────────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", pt: "Portuguese",
  de: "German", zh: "Chinese", ar: "Arabic", hi: "Hindi",
};

export function buildClientConfirmationEmail(data: ClientConfirmationData): EmailPayload {
  const isScan = data.source === "scan";
  const subject = `We've received your request — BioHarmony Solutions`;
  const firstName = data.name.split(" ")[0];
  const langLabel = data.language ? (LANG_LABELS[data.language] ?? data.language) : null;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);
                     border-radius:12px 12px 0 0;padding:40px 36px 32px;
                     border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 12px;color:#BFA14A;font-size:11px;
                      letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Thank you, ${firstName}.
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.65;line-height:1.6;">
              Your ${isScan ? "scan upload" : "report request"} has been received.<br>
              We'll be in touch with you shortly.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#0c1919;padding:32px 36px;border-radius:0 0 12px 12px;">

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="border-top:1px solid #1a3535;"></td>
                <td style="padding:0 12px;white-space:nowrap;color:#BFA14A;font-size:11px;
                           letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">
                  What we received
                </td>
                <td style="border-top:1px solid #1a3535;"></td>
              </tr>
            </table>

            <!-- Summary pills -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:${data.promoCode ? "16px" : "28px"};">
              <tr>
                <td>
                  ${summaryPill("Report Type", data.reportType)}
                  ${langLabel ? summaryPill("Language", langLabel) : ""}
                  ${data.fileName ? summaryPill("File", data.fileName) : ""}
                  ${data.whatsapp ? summaryPill("Delivery", "WhatsApp") : ""}
                </td>
              </tr>
            </table>

            ${data.promoCode && data.discountAmount != null ? `
            <!-- Promo savings banner -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:linear-gradient(135deg,#1a2e10,#162810);
                           border:1px solid rgba(191,161,74,0.35);border-radius:10px;padding:14px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p style="margin:0 0 3px;color:#BFA14A;font-size:11px;
                                   letter-spacing:0.18em;text-transform:uppercase;font-family:Arial,sans-serif;">
                          Promo code applied
                        </p>
                        <p style="margin:0;color:#F4EFE6;font-size:14px;
                                   font-family:Georgia,serif;line-height:1.5;">
                          Code <strong style="color:#BFA14A;font-family:monospace;">${data.promoCode}</strong>
                          — you saved <strong style="color:#BFA14A;">$${data.discountAmount}</strong>
                          ${data.plan ? `· Your price: <strong style="color:#F4EFE6;">$${Math.max(0, getPlanPrice(data.plan) - data.discountAmount)}</strong>` : ""}
                        </p>
                      </td>
                      <td style="width:36px;text-align:right;vertical-align:middle;">
                        <span style="font-size:22px;">🏷️</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            ` : ""}

            ${data.note ? `
            <!-- Note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#0f2020;border-left:3px solid #BFA14A;
                           padding:14px 18px;border-radius:0 8px 8px 0;">
                  <p style="margin:0 0 4px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    Your note
                  </p>
                  <p style="margin:0;color:#F4EFE6;font-size:13px;font-style:italic;
                             opacity:0.8;font-family:Georgia,serif;line-height:1.6;">
                    "${data.note}"
                  </p>
                </td>
              </tr>
            </table>
            ` : ""}

            <!-- What happens next -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td>
                  <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    What happens next
                  </p>
                  ${nextStep("1", "Review", "Kathy personally reviews every request to ensure the highest quality analysis.")}
                  ${nextStep("2", "Preparation", isScan
                    ? "Your uploaded scan data is processed and your personalized report is prepared."
                    : "Your personalized bioenergetic report is carefully prepared.")}
                  ${nextStep("3", "Delivery", data.whatsapp
                    ? "Your completed report will be delivered to you via WhatsApp."
                    : "Your completed report will be sent to " + data.email + ".")}
                </td>
              </tr>
            </table>

            <!-- Questions CTA -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:20px 24px;text-align:center;">
                  <p style="margin:0 0 8px;color:#F4EFE6;font-size:14px;
                             font-family:Georgia,serif;opacity:0.8;">
                    Questions or changes to your request?
                  </p>
                  <a href="mailto:info@bioharmonysolutions.ca"
                     style="color:#4ecdc4;font-size:13px;font-family:Arial,sans-serif;
                            text-decoration:none;font-weight:600;">
                    info@bioharmonysolutions.ca
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;color:#F4EFE6;font-size:11px;opacity:0.25;font-family:Arial,sans-serif;">
              BioHarmony Solutions &nbsp;·&nbsp; Kathy Owens
            </p>
            <p style="margin:4px 0 0;color:#F4EFE6;font-size:10px;opacity:0.15;font-family:Arial,sans-serif;">
              You received this because you submitted a request at bioharmonysolutions.ca
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Thank you, ${firstName}!`,
    ``,
    `Your ${isScan ? "scan upload" : "report request"} has been received by BioHarmony Solutions.`,
    `We'll be in touch with you shortly.`,
    ``,
    `--- What we received ---`,
    `Report Type: ${data.reportType}`,
    langLabel ? `Language: ${langLabel}` : "",
    data.fileName ? `File: ${data.fileName}` : "",
    data.whatsapp ? `Delivery: WhatsApp` : "",
    data.promoCode && data.discountAmount != null
      ? `Promo Code: ${data.promoCode} (you saved $${data.discountAmount}${data.plan ? ` — price: $${Math.max(0, getPlanPrice(data.plan) - data.discountAmount)}` : ""})`
      : "",
    data.note ? `\nYour note: "${data.note}"` : "",
    ``,
    `--- What happens next ---`,
    `1. Kathy personally reviews every request.`,
    `2. Your personalized report is carefully prepared.`,
    `3. Your completed report will be ${data.whatsapp ? "delivered via WhatsApp" : "sent to " + data.email}.`,
    ``,
    `Questions? Email us at info@bioharmonysolutions.ca`,
    ``,
    `BioHarmony Solutions · Kathy Owens`,
  ].filter((l) => l !== undefined).join("\n");

  return { to: data.email, subject, html, text };
}

function summaryPill(label: string, value: string): string {
  return `<span style="display:inline-block;margin:0 6px 8px 0;padding:5px 12px;
    background:#0f2020;border:1px solid #1a3535;border-radius:20px;
    color:#F4EFE6;font-size:12px;font-family:Arial,sans-serif;">
    <span style="color:#BFA14A;font-weight:600;">${label}:</span> ${value}
  </span>`;
}

function nextStep(num: string, title: string, body: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr>
      <td width="28" style="vertical-align:top;padding-top:1px;">
        <span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;
                     background:#BFA14A;border-radius:50%;color:#060D0D;
                     font-size:11px;font-weight:700;font-family:Arial,sans-serif;">${num}</span>
      </td>
      <td style="padding-left:10px;vertical-align:top;">
        <p style="margin:0 0 2px;color:#F4EFE6;font-size:13px;font-weight:600;font-family:Arial,sans-serif;">
          ${title}
        </p>
        <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.6;font-family:Arial,sans-serif;line-height:1.5;">
          ${body}
        </p>
      </td>
    </tr>
  </table>`;
}

// ── Referral reward email ───────────────────────────────────────────────────────

export interface ReferralRewardData {
  referrerEmail: string;
  referrerName?: string;
  referredName: string;
  rewardCode: string;
  rewardLabel: string;
}

export function buildReferralRewardEmail(data: ReferralRewardData): EmailPayload {
  const subject = "You've earned a BioHarmony reward!";
  const firstName = data.referrerName?.split(" ")[0] ?? "Friend";

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);
                     border-radius:12px 12px 0 0;padding:44px 40px 36px;
                     border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;
                      letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:26px;margin-bottom:20px;">🎁</div>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Thank you for the referral!
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;
                      font-family:Georgia,serif;font-style:italic;
                      opacity:0.65;line-height:1.6;">
              Hi ${firstName}, <strong style="color:#F4EFE6;opacity:0.85;">${data.referredName}</strong>
              just submitted their first BioHarmony report.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">

            <p style="margin:0 0 28px;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.82;line-height:1.8;">
              As a thank-you for spreading the word, here's your exclusive discount code for your next report:
            </p>

            <!-- Code block -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;padding:24px;background:#0f2020;
                           border:2px dashed rgba(191,161,74,0.35);border-radius:12px;">
                  <p style="margin:0 0 8px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    Your reward code
                  </p>
                  <p style="margin:0 0 6px;color:#F4EFE6;font-size:28px;font-weight:700;
                             font-family:monospace;letter-spacing:0.12em;">
                    ${data.rewardCode}
                  </p>
                  <p style="margin:0;color:#BFA14A;font-size:13px;font-family:Arial,sans-serif;opacity:0.8;">
                    ${data.rewardLabel}
                  </p>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;">
                  <a href="${SITE_URL}/upload-scan"
                     style="display:inline-block;padding:14px 36px;
                            background:linear-gradient(135deg,#BFA14A,#d4b456);
                            color:#060D0D;font-size:15px;font-weight:700;
                            text-decoration:none;border-radius:8px;
                            font-family:Arial,sans-serif;">
                    Use My Reward →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Expiry note -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:18px 24px;text-align:center;">
                  <p style="margin:0;color:#F4EFE6;font-size:13px;opacity:0.6;
                             font-family:Arial,sans-serif;line-height:1.6;">
                    Enter this code on the upload form to apply your discount.<br>
                    Questions? Reply to this email or contact
                    <a href="mailto:info@bioharmonysolutions.ca"
                       style="color:#4ecdc4;text-decoration:none;">info@bioharmonysolutions.ca</a>
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:28px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.55;">Warmly,</p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;
                      font-family:Georgia,serif;font-weight:600;opacity:0.85;">Kathy Owens</p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.3;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because someone listed you as a referral source on bioharmonysolutions.ca
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Thank you for the referral!`,
    ``,
    `Hi ${firstName},`,
    ``,
    `${data.referredName} just submitted their first BioHarmony report — thanks to you!`,
    ``,
    `Here's your reward code for your next report:`,
    ``,
    `  ${data.rewardCode}  —  ${data.rewardLabel}`,
    ``,
    `Enter this code on the upload form at ${SITE_URL}/upload-scan`,
    ``,
    `Questions? Contact info@bioharmonysolutions.ca`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.referrerEmail, subject, html, text };
}

// ── Practitioner commission notification ───────────────────────────────────────

export interface PractitionerCommissionData {
  practitionerName: string;
  practitionerEmail: string;
  referralCode: string;
  commissionRate: number;
  reportType: string;
  plan: string;
  reportValue: number;
  commissionEarned: number;
  totalEarned: number;
  totalReferrals: number;
  completedReports: number;
  pendingPayout: number;
  dashboardUrl: string;
}

export function buildPractitionerCommissionEmail(data: PractitionerCommissionData): EmailPayload {
  const subject = `Commission Earned — BioHarmony Report Delivered (+$${data.commissionEarned})`;
  const firstName = data.practitionerName.split(" ")[0] ?? data.practitionerName;
  const planLabel = getPlanLabel(data.plan);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);
                     border-radius:12px 12px 0 0;padding:44px 40px 36px;
                     border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;
                      letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions — Affiliate Notification
            </p>
            <div style="display:inline-block;width:54px;height:54px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:54px;
                        text-align:center;font-size:26px;margin-bottom:18px;">💰</div>
            <h1 style="margin:0 0 8px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Commission Earned
            </h1>
            <p style="margin:0;color:#BFA14A;font-size:32px;font-family:Georgia,serif;
                      font-weight:700;letter-spacing:0.02em;">
              +$${data.commissionEarned}
            </p>
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:14px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.6;">
              Hi ${firstName}, a referred client's report was just delivered.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">

            <!-- This delivery -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="background:#0f2020;border:1px solid rgba(191,161,74,0.25);
                           border-radius:10px;padding:20px 24px;">
                  <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    This Delivery
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#F4EFE6;font-size:13px;opacity:0.55;font-family:Arial,sans-serif;padding-bottom:8px;">Report Type</td>
                      <td style="color:#F4EFE6;font-size:13px;font-weight:600;font-family:Arial,sans-serif;text-align:right;padding-bottom:8px;">${data.reportType}</td>
                    </tr>
                    <tr>
                      <td style="color:#F4EFE6;font-size:13px;opacity:0.55;font-family:Arial,sans-serif;padding-bottom:8px;">Plan</td>
                      <td style="color:#F4EFE6;font-size:13px;font-weight:600;font-family:Arial,sans-serif;text-align:right;padding-bottom:8px;">${planLabel}</td>
                    </tr>
                    <tr>
                      <td style="color:#F4EFE6;font-size:13px;opacity:0.55;font-family:Arial,sans-serif;padding-bottom:8px;">Report Value</td>
                      <td style="color:#F4EFE6;font-size:13px;font-weight:600;font-family:Arial,sans-serif;text-align:right;padding-bottom:8px;">$${data.reportValue}</td>
                    </tr>
                    <tr>
                      <td style="color:#F4EFE6;font-size:13px;opacity:0.55;font-family:Arial,sans-serif;
                                 border-top:1px solid #1a3535;padding-top:10px;">
                        Your Commission (${data.commissionRate}%)
                      </td>
                      <td style="color:#BFA14A;font-size:16px;font-weight:700;font-family:Georgia,serif;
                                 text-align:right;border-top:1px solid #1a3535;padding-top:10px;">
                        +$${data.commissionEarned}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Lifetime stats -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="padding:0 0 12px;">
                  <p style="margin:0;color:#F4EFE6;font-size:11px;
                             letter-spacing:0.2em;text-transform:uppercase;
                             opacity:0.4;font-family:Arial,sans-serif;">
                    Your Lifetime Stats
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="33%" style="text-align:center;padding:14px 8px;
                                             background:#0f2020;border-radius:8px 0 0 8px;
                                             border:1px solid #1a3535;">
                        <p style="margin:0 0 4px;color:#F4EFE6;font-size:10px;opacity:0.4;
                                   text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                          Referrals
                        </p>
                        <p style="margin:0;color:#F4EFE6;font-size:22px;font-weight:700;
                                   font-family:Georgia,serif;opacity:0.85;">
                          ${data.totalReferrals}
                        </p>
                      </td>
                      <td width="33%" style="text-align:center;padding:14px 8px;
                                             background:#0f2020;border:1px solid #1a3535;
                                             border-left:none;">
                        <p style="margin:0 0 4px;color:#F4EFE6;font-size:10px;opacity:0.4;
                                   text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                          Total Earned
                        </p>
                        <p style="margin:0;color:#BFA14A;font-size:22px;font-weight:700;
                                   font-family:Georgia,serif;">
                          $${data.totalEarned}
                        </p>
                      </td>
                      <td width="33%" style="text-align:center;padding:14px 8px;
                                             background:#0f2020;border-radius:0 8px 8px 0;
                                             border:1px solid #1a3535;border-left:none;">
                        <p style="margin:0 0 4px;color:#F4EFE6;font-size:10px;opacity:0.4;
                                   text-transform:uppercase;letter-spacing:0.15em;font-family:Arial,sans-serif;">
                          Pending Payout
                        </p>
                        <p style="margin:0;color:${data.pendingPayout > 0 ? "#f6ad55" : "#68d391"};font-size:22px;font-weight:700;
                                   font-family:Georgia,serif;">
                          ${data.pendingPayout > 0 ? `$${data.pendingPayout}` : "—"}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;padding:8px 0;">
                  <a href="${data.dashboardUrl}"
                     style="display:inline-block;padding:13px 32px;
                            background:linear-gradient(135deg,#0F5C5E,#0a4a4c);
                            color:#F4EFE6;font-size:14px;font-weight:600;
                            text-decoration:none;border-radius:8px;
                            font-family:Arial,sans-serif;
                            border:1px solid rgba(191,161,74,0.3);">
                    View Your Affiliate Dashboard →
                  </a>
                </td>
              </tr>
              <tr>
                <td style="text-align:center;padding-top:8px;">
                  <p style="margin:0;color:#F4EFE6;font-size:11px;opacity:0.28;font-family:Arial,sans-serif;">
                    Your referral code: <span style="font-family:monospace;color:#BFA14A;opacity:1;">${data.referralCode}</span>
                  </p>
                </td>
              </tr>
            </table>

            <!-- Note on payouts -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:18px 22px;">
                  <p style="margin:0 0 6px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.15em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    About Payouts
                  </p>
                  <p style="margin:0;color:#F4EFE6;font-size:13px;opacity:0.65;
                             font-family:Arial,sans-serif;line-height:1.6;">
                    Commissions are tracked automatically. Kathy will process your pending payout periodically — 
                    typically monthly. Questions? Reply to this email or contact
                    <a href="mailto:info@bioharmonysolutions.ca"
                       style="color:#4ecdc4;text-decoration:none;">info@bioharmonysolutions.ca</a>
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Signature -->
        <tr>
          <td style="padding:28px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;
                      font-family:Georgia,serif;font-style:italic;opacity:0.5;">Warmly,</p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;
                      font-family:Georgia,serif;font-weight:600;opacity:0.85;">Kathy Owens</p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.28;font-family:Arial,sans-serif;">
              BioHarmony Solutions
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because you are a registered affiliate partner of BioHarmony Solutions.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Commission Earned — BioHarmony Solutions`,
    `=========================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `A referred client's report was just delivered. Here's your commission breakdown:`,
    ``,
    `  Report Type:     ${data.reportType}`,
    `  Plan:            ${planLabel}`,
    `  Report Value:    $${data.reportValue}`,
    `  Your Commission: +$${data.commissionEarned} (${data.commissionRate}%)`,
    ``,
    `Lifetime Stats`,
    `--------------`,
    `  Total Referrals:  ${data.totalReferrals}`,
    `  Delivered Reports: ${data.completedReports}`,
    `  Total Earned:     $${data.totalEarned}`,
    `  Pending Payout:   ${data.pendingPayout > 0 ? `$${data.pendingPayout}` : "Nil"}`,
    ``,
    `View your affiliate dashboard:`,
    data.dashboardUrl,
    `Your referral code: ${data.referralCode}`,
    ``,
    `Commissions are tracked automatically and paid out periodically.`,
    `Questions? Contact info@bioharmonysolutions.ca`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.practitionerEmail, subject, html, text };
}

// ── Payment received (client) ──────────────────────────────────────────────────

export interface PaymentReceivedData {
  name: string;
  email: string;
  requestId: string;
  plan: string;
  reportType: string;
  amount: number;
}

export function buildPaymentReceivedEmail(data: PaymentReceivedData): EmailPayload {
  const subject = "Payment Confirmed — Your BioAnalytics Report Is Being Prepared";
  const firstName = data.name.split(" ")[0] ?? data.name;
  const trackUrl = `${SITE_URL}/track-report?id=${encodeURIComponent(data.requestId)}`;
  const planLabel = getPlanLabel(data.plan);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);border-radius:12px 12px 0 0;
                     padding:44px 40px 36px;border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;letter-spacing:0.3em;
                      text-transform:uppercase;font-family:Arial,sans-serif;">
              BioAnalytics by BioHarmony Solutions
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:24px;margin-bottom:20px;">✓</div>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Payment Confirmed
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      font-style:italic;opacity:0.65;line-height:1.6;">
              Hi ${firstName}, your payment has been received — your report is now in the queue.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              ${row("Request ID", data.requestId)}
              ${row("Report Type", data.reportType)}
              ${row("Plan", planLabel)}
              ${data.amount > 0 ? row("Amount Paid", `$${data.amount}`) : row("Payment", "Complimentary / Waived")}
            </table>
            <p style="margin:0 0 24px;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.80;line-height:1.8;">
              Your scan data has entered our AI processing pipeline. You'll receive another email
              as soon as your personalised BioAnalytics report is ready — typically within 24–48 hours.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="text-align:center;">
                  <a href="${trackUrl}"
                     style="display:inline-block;padding:13px 32px;
                            background:linear-gradient(135deg,#0F5C5E,#0a4a4c);
                            color:#F4EFE6;font-size:14px;font-weight:600;text-decoration:none;
                            border-radius:8px;font-family:Arial,sans-serif;
                            border:1px solid rgba(191,161,74,0.35);">
                    Track My Report →
                  </a>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:18px 24px;text-align:center;">
                  <p style="margin:0 0 6px;color:#F4EFE6;font-size:13px;opacity:0.7;font-family:Arial,sans-serif;">
                    Questions? Reply to this email or contact us at
                  </p>
                  <a href="mailto:info@bioharmonysolutions.ca"
                     style="color:#4ecdc4;font-size:13px;font-family:Arial,sans-serif;
                            text-decoration:none;font-weight:600;">
                    info@bioharmonysolutions.ca
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;font-family:Georgia,serif;font-style:italic;opacity:0.5;">Warmly,</p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;font-family:Georgia,serif;font-weight:600;opacity:0.85;">Kathy Owens</p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.28;font-family:Arial,sans-serif;">BioHarmony Solutions</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because you submitted a scan request at bioharmonysolutions.ca
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Payment Confirmed — BioAnalytics by BioHarmony Solutions`,
    `=========================================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `Your payment has been received and your report is now in the processing queue.`,
    ``,
    `Request ID:  ${data.requestId}`,
    `Report Type: ${data.reportType}`,
    `Plan:        ${planLabel}`,
    data.amount > 0 ? `Amount Paid: $${data.amount}` : `Payment:     Complimentary / Waived`,
    ``,
    `Your personalised BioAnalytics report will be ready within 24–48 hours.`,
    `Track your report: ${trackUrl}`,
    ``,
    `Questions? Contact info@bioharmonysolutions.ca`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.email, subject, html, text };
}

// ── Report processing started (client) ─────────────────────────────────────────

export interface ProcessingStartedData {
  name: string;
  email: string;
  requestId: string;
  reportType: string;
  plan: string;
}

export function buildProcessingStartedEmail(data: ProcessingStartedData): EmailPayload {
  const subject = "Your BioAnalytics Report Is Now Being Prepared";
  const firstName = data.name.split(" ")[0] ?? data.name;
  const trackUrl = `${SITE_URL}/track-report?id=${encodeURIComponent(data.requestId)}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);border-radius:12px 12px 0 0;
                     padding:44px 40px 36px;border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;letter-spacing:0.3em;
                      text-transform:uppercase;font-family:Arial,sans-serif;">
              BioAnalytics by BioHarmony Solutions
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:24px;margin-bottom:20px;">🔄</div>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Your Report Is Being Prepared
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      font-style:italic;opacity:0.65;line-height:1.6;">
              Hi ${firstName}, our AI pipeline has started processing your scan data.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 24px;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.80;line-height:1.8;">
              Your <strong style="color:#F4EFE6;">${data.reportType}</strong> scan data is now moving through
              our multi-stage interpretation pipeline. We'll extract your key wellness patterns,
              generate your personalised narrative, and run a quality review before your report
              is delivered.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-left:3px solid #BFA14A;
                          border-radius:0 8px 8px 0;margin-bottom:28px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 4px;color:#BFA14A;font-size:11px;letter-spacing:0.15em;
                             text-transform:uppercase;font-family:Arial,sans-serif;">Estimated delivery</p>
                  <p style="margin:0;color:#F4EFE6;font-size:14px;opacity:0.80;font-family:Georgia,serif;">
                    Within 24–48 hours — you'll receive an email the moment it's ready.
                  </p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr>
                <td style="text-align:center;">
                  <a href="${trackUrl}"
                     style="display:inline-block;padding:13px 32px;
                            background:linear-gradient(135deg,#0F5C5E,#0a4a4c);
                            color:#F4EFE6;font-size:14px;font-weight:600;text-decoration:none;
                            border-radius:8px;font-family:Arial,sans-serif;
                            border:1px solid rgba(191,161,74,0.35);">
                    Track My Report →
                  </a>
                  <p style="margin:8px 0 0;color:#F4EFE6;font-size:11px;opacity:0.3;font-family:Arial,sans-serif;">
                    Reference: ${data.requestId}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;font-family:Georgia,serif;font-style:italic;opacity:0.5;">Warmly,</p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;font-family:Georgia,serif;font-weight:600;opacity:0.85;">Kathy Owens</p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.28;font-family:Arial,sans-serif;">BioHarmony Solutions</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because you submitted a scan request at bioharmonysolutions.ca
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Your BioAnalytics Report Is Now Being Prepared`,
    `================================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `Your ${data.reportType} scan data is now in our AI processing pipeline.`,
    ``,
    `We'll extract your wellness patterns, generate your personalised narrative,`,
    `and run a quality review before your final report is delivered.`,
    ``,
    `Estimated delivery: within 24–48 hours.`,
    `Track your report: ${trackUrl}`,
    `Reference: ${data.requestId}`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.email, subject, html, text };
}

// ── Practitioner welcome ───────────────────────────────────────────────────────

export interface PractitionerWelcomeData {
  practitionerName: string;
  practitionerEmail: string;
  referralCode: string;
  commissionRate: number;
  dashboardUrl: string;
}

export function buildPractitionerWelcomeEmail(data: PractitionerWelcomeData): EmailPayload {
  const subject = "Welcome to the BioHarmony Solutions Practitioner Program";
  const firstName = data.practitionerName.split(" ")[0] ?? data.practitionerName;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);border-radius:12px 12px 0 0;
                     padding:44px 40px 36px;border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;letter-spacing:0.3em;
                      text-transform:uppercase;font-family:Arial,sans-serif;">
              BioHarmony Solutions — Practitioner Program
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:24px;margin-bottom:20px;">🌿</div>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              Welcome, ${firstName}
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      font-style:italic;opacity:0.65;line-height:1.6;">
              You've been added to the BioHarmony Solutions Practitioner Program.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 24px;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.80;line-height:1.8;">
              Your practitioner account is now active. You can start referring clients using
              your unique referral code — clients enter it when uploading their scan.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;padding:24px;background:#0f2020;
                           border:2px dashed rgba(191,161,74,0.35);border-radius:12px;">
                  <p style="margin:0 0 6px;color:#BFA14A;font-size:11px;
                             letter-spacing:0.25em;text-transform:uppercase;font-family:Arial,sans-serif;">
                    Your Referral Code
                  </p>
                  <p style="margin:0 0 8px;color:#F4EFE6;font-size:30px;font-weight:700;
                             font-family:monospace;letter-spacing:0.12em;">
                    ${data.referralCode}
                  </p>
                  <p style="margin:0;color:#BFA14A;font-size:13px;font-family:Arial,sans-serif;opacity:0.8;">
                    ${data.commissionRate}% commission on every completed report
                  </p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td>
                  <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;letter-spacing:0.2em;
                             text-transform:uppercase;font-family:Arial,sans-serif;">How It Works</p>
                  ${nextStep("1", "Share Your Code", "Give clients your code to enter when they upload their scan at bioharmonysolutions.ca.")}
                  ${nextStep("2", "Track Referrals", "Log in to your practitioner dashboard to see all referred clients and report status.")}
                  ${nextStep("3", "Earn Commissions", `You earn ${data.commissionRate}% on every completed, paid report — tracked automatically.`)}
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="text-align:center;">
                  <a href="${data.dashboardUrl}"
                     style="display:inline-block;padding:14px 36px;
                            background:linear-gradient(135deg,#0F5C5E,#0a4a4c);
                            color:#F4EFE6;font-size:15px;font-weight:600;text-decoration:none;
                            border-radius:8px;font-family:Arial,sans-serif;
                            border:1px solid rgba(191,161,74,0.35);">
                    View Your Dashboard →
                  </a>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:18px 24px;text-align:center;">
                  <p style="margin:0 0 6px;color:#F4EFE6;font-size:13px;opacity:0.7;font-family:Arial,sans-serif;">
                    Questions about your practitioner account?
                  </p>
                  <a href="mailto:info@bioharmonysolutions.ca"
                     style="color:#4ecdc4;font-size:13px;font-family:Arial,sans-serif;
                            text-decoration:none;font-weight:600;">
                    info@bioharmonysolutions.ca
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;font-family:Georgia,serif;font-style:italic;opacity:0.5;">Warmly,</p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;font-family:Georgia,serif;font-weight:600;opacity:0.85;">Kathy Owens</p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.28;font-family:Arial,sans-serif;">BioHarmony Solutions</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because you were registered as a BioHarmony Solutions Practitioner Partner.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `Welcome to the BioHarmony Solutions Practitioner Program`,
    `=========================================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `Your practitioner account is now active. Start referring clients immediately.`,
    ``,
    `Your Referral Code: ${data.referralCode}`,
    `Commission Rate:    ${data.commissionRate}% on every completed report`,
    ``,
    `How It Works`,
    `------------`,
    `1. Share your code with clients to enter when uploading at bioharmonysolutions.ca`,
    `2. Track referrals and report status in your practitioner dashboard`,
    `3. Earn ${data.commissionRate}% on every completed, paid report — tracked automatically`,
    ``,
    `View your dashboard: ${data.dashboardUrl}`,
    ``,
    `Questions? Contact info@bioharmonysolutions.ca`,
    ``,
    `Warmly,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.practitionerEmail, subject, html, text };
}

// ── Testimonial request ────────────────────────────────────────────────────────

export interface TestimonialRequestData {
  name: string;
  email: string;
  requestId: string;
  reportType: string;
}

export function buildTestimonialRequestEmail(data: TestimonialRequestData): EmailPayload {
  const subject = "How was your BioAnalytics report? We'd love your feedback";
  const firstName = data.name.split(" ")[0] ?? data.name;
  const feedbackUrl = `${SITE_URL}/feedback?ref=${encodeURIComponent(data.requestId)}`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#060D0D;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060D0D;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:linear-gradient(135deg,#0c1919,#0f2020);border-radius:12px 12px 0 0;
                     padding:44px 40px 36px;border-top:3px solid #BFA14A;text-align:center;">
            <p style="margin:0 0 14px;color:#BFA14A;font-size:11px;letter-spacing:0.3em;
                      text-transform:uppercase;font-family:Arial,sans-serif;">
              BioAnalytics by BioHarmony Solutions
            </p>
            <div style="display:inline-block;width:52px;height:52px;border-radius:50%;
                        background:#0f2b2b;border:2px solid #BFA14A;line-height:52px;
                        text-align:center;font-size:24px;margin-bottom:20px;">⭐</div>
            <h1 style="margin:0 0 10px;color:#F4EFE6;font-size:26px;
                       font-family:Georgia,serif;font-weight:400;line-height:1.3;">
              How was your experience?
            </h1>
            <p style="margin:0;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      font-style:italic;opacity:0.65;line-height:1.6;">
              Hi ${firstName}, we hope your ${data.reportType} report brought you clarity.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#0c1919;padding:36px 40px;border-radius:0 0 12px 12px;">
            <p style="margin:0 0 24px;color:#F4EFE6;font-size:15px;font-family:Georgia,serif;
                      opacity:0.80;line-height:1.8;">
              Your feedback means a great deal to us — and to the people considering their own
              wellness journey. If your BioAnalytics report was helpful, we'd love to hear what
              resonated most with you.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="text-align:center;">
                  <a href="${feedbackUrl}"
                     style="display:inline-block;padding:14px 36px;
                            background:linear-gradient(135deg,#BFA14A,#d4b456);
                            color:#060D0D;font-size:15px;font-weight:700;
                            text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;">
                    Share My Experience →
                  </a>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background:#0f2020;border-radius:10px;border:1px solid #1a3535;">
              <tr>
                <td style="padding:18px 24px;text-align:center;">
                  <p style="margin:0 0 6px;color:#F4EFE6;font-size:13px;opacity:0.7;font-family:Arial,sans-serif;">
                    It only takes a minute — or simply reply to this email with your thoughts.
                  </p>
                  <a href="mailto:info@bioharmonysolutions.ca?subject=Feedback: My BioAnalytics Report ${encodeURIComponent(data.requestId)}"
                     style="color:#4ecdc4;font-size:13px;font-family:Arial,sans-serif;
                            text-decoration:none;font-weight:600;">
                    info@bioharmonysolutions.ca
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 0 8px;text-align:center;">
            <p style="margin:0 0 4px;color:#F4EFE6;font-size:14px;font-family:Georgia,serif;font-style:italic;opacity:0.5;">With gratitude,</p>
            <p style="margin:0 0 2px;color:#BFA14A;font-size:14px;font-family:Georgia,serif;font-weight:600;opacity:0.85;">Kathy Owens</p>
            <p style="margin:0;color:#F4EFE6;font-size:12px;opacity:0.28;font-family:Arial,sans-serif;">BioHarmony Solutions</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 20px;text-align:center;border-top:1px solid #1a3535;">
            <p style="margin:8px 0 0;color:#F4EFE6;font-size:10px;opacity:0.18;font-family:Arial,sans-serif;">
              You received this because your BioAnalytics report was delivered. No further marketing emails.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `How was your BioAnalytics report?`,
    `==================================`,
    ``,
    `Hi ${firstName},`,
    ``,
    `We hope your ${data.reportType} report brought you clarity and useful insights.`,
    ``,
    `If your BioAnalytics report was helpful, we'd love to hear your experience.`,
    `Your feedback helps us improve and lets others know what to expect.`,
    ``,
    `Share your feedback: ${feedbackUrl}`,
    `Or simply reply to this email — we read every response.`,
    ``,
    `With gratitude,`,
    `Kathy Owens`,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: data.email, subject, html, text };
}

// ── Email send ─────────────────────────────────────────────────────────────────

/**
 * Send an email via Resend if RESEND_API_KEY is set.
 * Falls back to structured mock logging — never crashes — when the key is absent.
 *
 * From:     BioAnalytics by BioHarmony Solutions <reports@bioharmonysolutions.ca>
 * Reply-To: info@bioharmonysolutions.ca
 * Domain:   bioharmonysolutions.ca  (verified sending subdomain: mail.bioharmonysolutions.ca)
 */
export interface SendEmailResult {
  sent: boolean;
  mode: "resend" | "mock";
  error?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<SendEmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];

  if (apiKey) {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "BioAnalytics by BioHarmony Solutions <reports@mail.bioharmonysolutions.ca>",
      replyTo: "info@bioharmonysolutions.ca",
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    if (error) {
      logger.error({ error, to: payload.to, subject: payload.subject }, "Resend delivery failed — falling back to mock log");
      // Log mock so the email content is not lost
      logger.warn(
        {
          from: "BioAnalytics by BioHarmony Solutions <reports@mail.bioharmonysolutions.ca>",
          to: payload.to,
          subject: payload.subject,
          preview: payload.text.slice(0, 300),
          resendError: error.message,
        },
        "[EMAIL FALLBACK] Resend failed — email was NOT delivered",
      );
      return { sent: false, mode: "resend", error: error.message };
    }

    logger.info({ to: payload.to, subject: payload.subject }, "Email sent via Resend");
    return { sent: true, mode: "resend" };
  }

  // No RESEND_API_KEY — log as mock email, never crash
  logger.info(
    {
      from: "BioAnalytics by BioHarmony Solutions <reports@mail.bioharmonysolutions.ca>",
      replyTo: "info@bioharmonysolutions.ca",
      to: payload.to,
      subject: payload.subject,
      preview: payload.text.slice(0, 300),
    },
    "[EMAIL MOCK] Set RESEND_API_KEY secret to enable real delivery via Resend",
  );
  return { sent: false, mode: "mock" };
}
