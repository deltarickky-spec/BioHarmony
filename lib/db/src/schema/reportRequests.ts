import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportRequestsTable = pgTable("report_requests", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  reportType: varchar("report_type", { length: 50 }).notNull(),
  note: text("note"),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportRequestSchema = createInsertSchema(reportRequestsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertReportRequest = z.infer<typeof insertReportRequestSchema>;
export type ReportRequest = typeof reportRequestsTable.$inferSelect;
