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
  const subject = `New BioHarmony Report Request — ${data.name}`;
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
              New Report Request Received
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
              ${row("Phone", data.phone)}
              ${row("Report Type", data.reportType)}
              ${row("File Uploaded", data.fileName)}
              ${row("Language", data.language)}
              ${row("WhatsApp Delivery", data.whatsapp === true ? "Yes" : data.whatsapp === false ? "No" : undefined)}
              ${row("Note / Message", data.note ? `<em style="color:#F4EFE6;opacity:0.85;">"${data.note}"</em>` : undefined)}
              ${row("Submitted", dateStr)}
            </table>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:20px 24px;border-top:1px solid #1a3535;text-align:center;">
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
    `New BioHarmony Report Request`,
    `================================`,
    textRow("Client Name", data.name),
    textRow("Email", data.email),
    textRow("Phone", data.phone),
    textRow("Report Type", data.reportType),
    textRow("File Uploaded", data.fileName),
    textRow("Language", data.language),
    textRow("WhatsApp Delivery", data.whatsapp === true ? "Yes" : data.whatsapp === false ? "No" : undefined),
    textRow("Note / Message", data.note),
    textRow("Submitted", dateStr),
    ``,
    `BioHarmony Solutions`,
  ].join("\n");

  return { to: ADMIN_EMAIL, subject, html, text };
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const provider = process.env["EMAIL_PROVIDER"];

  if (provider === "sendgrid") {
    logger.warn("SendGrid not yet wired — falling back to mock log");
  } else if (provider === "resend") {
    logger.warn("Resend not yet wired — falling back to mock log");
  }

  logger.info(
    {
      to: payload.to,
      subject: payload.subject,
      preview: payload.text.slice(0, 300),
    },
    "[EMAIL MOCK] Email notification (wire EMAIL_PROVIDER env var to send for real)",
  );
}
