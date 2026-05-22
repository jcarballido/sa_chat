import { integer, serial, pgTable as table, text, timestamp } from "drizzle-orm/pg-core"
import { conversations } from "./conversations.schema.js"

export const messages = table("messages",{
  id: serial().primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull(),
  role: text({ enum:["user","assistant"] }).notNull(),
  content: text().notNull()
})

export type InsertMessage = typeof messages.$inferInsert
export type SelectMessage = typeof messages.$inferSelect 
