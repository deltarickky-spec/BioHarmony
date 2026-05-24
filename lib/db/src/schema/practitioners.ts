import { pgTable, serial, varchar, boolean, integer, text, timestamp } from "drizzle-orm/pg-core";

export const practitionersTable = pgTable("practitioners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  commissionRate: integer("commission_rate").notNull().default(10),
  tier: varchar("tier", { length: 30 }).default("professional"),
  active: boolean("active").notNull().default(true),
  notes: text("notes"),
  totalPaid: integer("total_paid").notNull().default(0),
  businessName: varchar("business_name", { length: 150 }),
  logoUrl: text("logo_url"),
  credits: integer("credits").notNull().default(0),
  creditsUsed: integer("credits_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
