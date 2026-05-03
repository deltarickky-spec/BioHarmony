import { Resend } from "resend";
import { logger } from "../lib/logger";

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] ?? "info@bioharmonysolutions.ca";
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
  const isPremium = data.plan === "premium";

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
                    ${data.plan ? `— your price is <strong style="color:#F4EFE6;">$${Math.max(0, ({"basic":55,"advanced":99,"premium":149}[data.plan] ?? 99) - data.discountAmount)}</strong>` : ""}.
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
      ? `Promo code ${data.promoCode} saves you $${data.discountAmount}${data.plan ? ` — your price is $${Math.max(0, ({"basic":55,"advanced":99,"premium":149}[data.plan] ?? 99) - data.discountAmount)}` : ""}.`
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
                          ${data.plan ? `· Your price: <strong style="color:#F4EFE6;">$${Math.max(0, ({"basic":55,"advanced":99,"premium":149}[data.plan] ?? 99) - data.discountAmount)}</strong>` : ""}
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
      ? `Promo Code: ${data.promoCode} (you saved $${data.discountAmount}${data.plan ? ` — price: $${Math.max(0, ({"basic":55,"advanced":99,"premium":149}[data.plan] ?? 99) - data.discountAmount)}` : ""})`
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

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];

  if (apiKey) {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "BioHarmony Solutions <noreply@bioharmonysolutions.ca>",
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    if (error) {
      logger.error({ error }, "Resend delivery failed");
      throw new Error(`Resend error: ${error.message}`);
    }

    logger.info({ to: payload.to, subject: payload.subject }, "Email sent via Resend");
    return;
  }

  // No provider configured — log the mock email for development
  // Structured for SendGrid / Resend / SMTP — add RESEND_API_KEY secret to enable real delivery
  logger.info(
    {
      to: payload.to,
      subject: payload.subject,
      preview: payload.text.slice(0, 300),
    },
    "[EMAIL MOCK] Add RESEND_API_KEY secret to enable real delivery",
  );
}
