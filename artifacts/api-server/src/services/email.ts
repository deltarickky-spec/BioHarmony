import { Resend } from "resend";
import { logger } from "../lib/logger";

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] ?? "info@bioharmonysolutions.ca";

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
                  <a href="https://bioharmonysolutions.ca/admin"
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
    `View dashboard: https://bioharmonysolutions.ca/admin`,
    ``,
    `BioHarmony Solutions`,
  ]
    .filter(Boolean)
    .join("\n");

  return { to: ADMIN_EMAIL, subject, html, text };
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

  // No provider configured — log the email for development
  logger.info(
    {
      to: payload.to,
      subject: payload.subject,
      preview: payload.text.slice(0, 300),
    },
    "[EMAIL MOCK] Add RESEND_API_KEY secret to enable real delivery",
  );
}
