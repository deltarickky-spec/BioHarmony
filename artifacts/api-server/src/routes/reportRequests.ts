import { Router } from "express";
import { db } from "@workspace/db";
import { reportRequestsTable } from "@workspace/db/schema";
import { z } from "zod";
import { buildReportNotificationEmail, buildClientConfirmationEmail, sendEmail } from "../services/email";

const router = Router();

const RequestSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).trim(),
  reportType: z.string().min(1).max(50).trim(),
  note: z.string().max(1000).trim().optional(),
});

router.post("/report-requests", async (req, res) => {
  const parsed = RequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;

  try {
    const [row] = await db
      .insert(reportRequestsTable)
      .values(data)
      .returning({ id: reportRequestsTable.id });

    req.log.info({ id: row.id, email: data.email }, "New report request submitted");

    const emailPayload = buildReportNotificationEmail({
      source: "report",
      name: data.firstName,
      email: data.email,
      reportType: data.reportType,
      note: data.note,
      submittedAt: new Date(),
    });

    const confirmPayload = buildClientConfirmationEmail({
      source: "report",
      name: data.firstName,
      email: data.email,
      reportType: data.reportType,
      note: data.note,
    });

    await Promise.all([
      sendEmail(emailPayload).catch((err: unknown) => {
        req.log.error({ err }, "Admin email notification failed (non-fatal)");
      }),
      sendEmail(confirmPayload).catch((err: unknown) => {
        req.log.error({ err }, "Client confirmation email failed (non-fatal)");
      }),
    ]);

    res.status(201).json({ success: true, id: row.id });
  } catch (err) {
    req.log.error({ err }, "Failed to save report request");
    res.status(500).json({ error: "Could not save your request. Please try again." });
  }
});

export default router;
