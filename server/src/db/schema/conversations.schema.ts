import { integer, serial, pgTable as table, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const conversations = table("conversations", {
  id: serial().primaryKey(),
  supabaseUserId: uuid("supabase_user_id").notNull(),
  title: text(),
})

export type SelectConversation = typeof conversations.$inferSelect
export type InsertConversation = typeof conversations.$inferInsert