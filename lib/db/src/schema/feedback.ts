import { pgTable, serial, varchar, boolean, text, integer, timestamp } from "drizzle-orm/pg-core";

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  requestId: varchar("request_id", { length: 100 }),
  accuracyRating: integer("accuracy_rating").notNull(),
  clarityRating: integer("clarity_rating").notNull(),
  returnLikelihood: integer("return_likelihood").notNull(),
  testimonial: text("testimonial"),
  referralSource: varchar("referral_source", { length: 100 }),
  clientName: varchar("client_name", { length: 100 }),
  consentShare: boolean("consent_share").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
