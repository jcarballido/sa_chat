import { integer, serial, pgTable as table, text, timestamp } from "drizzle-orm/pg-core";

export const conversations = table("conversations", {
  id: serial().primaryKey(),
  supabaseUserId: integer("supabase_user_id").notNull(),
  title: text().notNull(),
})

export type SelectConversation = typeof conversations.$inferSelect
export type InsertConversation = typeof conversations.$inferInsert