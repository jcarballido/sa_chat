import { db } from "./client.js";
import { conversations, type InsertConversation } from "./schema/conversations.schema.js";
import { messages, type InsertMessage } from "./schema/messages.schema.js";

export async function buildQueries() {

  async function createConversation(supabaseUserId: string) {
    const result = await db
      .insert(conversations)
      .values({supabaseUserId})
      .returning({newConversationId: conversations.id})    
    return result
  }

  async function getConversations() {
    const result = await db
      .select()
      .from(conversations)
    return result
  }

  async function addMessage(newMessage: InsertMessage) {
    const result = await db
      .insert(messages)
      .values(newMessage)
      .returning({newMessageId: messages.id})
    return result    
  }

  return {
    createConversation,
    getConversations,
    addMessage
  }
}

export type QueriesType = Awaited<ReturnType<typeof buildQueries>>