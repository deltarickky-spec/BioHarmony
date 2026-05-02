import { pgTable, serial, text, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportTranslationsTable = pgTable("report_translations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  language: varchar("language", { length: 10 }).notNull(),
  reportType: varchar("report_type", { length: 50 }).notNull().default("sample"),
  contentEnglish: jsonb("content_english").notNull(),
  contentTranslated: jsonb("content_translated").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportTranslationSchema = createInsertSchema(reportTranslationsTable).omit({ id: true, createdAt: true });
export type InsertReportTranslation = z.infer<typeof insertReportTranslationSchema>;
export type ReportTranslation = typeof reportTranslationsTable.$inferSelect;
