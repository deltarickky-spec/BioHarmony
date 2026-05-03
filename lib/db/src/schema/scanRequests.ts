import { pgTable, serial, varchar, boolean, text, timestamp } from "drizzle-orm/pg-core";

export const scanRequestsTable = pgTable("scan_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  reportType: varchar("report_type", { length: 50 }).notNull(),
  language: varchar("language", { length: 10 }).notNull().default("en"),
  fileName: varchar("file_name", { length: 255 }),
  whatsapp: boolean("whatsapp").default(false),
  plan: varchar("plan", { length: 20 }),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  pipelineStage: varchar("pipeline_stage", { length: 30 }).notNull().default("queued"),
  note: text("note"),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
