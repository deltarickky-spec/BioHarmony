import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const reportAudioTable = pgTable("report_audio", {
  id: serial("id").primaryKey(),
  cacheKey: varchar("cache_key", { length: 100 }).notNull().unique(),
  voice: varchar("voice", { length: 30 }).notNull().default("shimmer"),
  audioBase64: text("audio_base64").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ReportAudio = typeof reportAudioTable.$inferSelect;
