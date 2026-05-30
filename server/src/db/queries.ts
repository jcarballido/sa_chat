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

  async function getConversationMetadata() {
    const result = await db
      .select({
        conversationId: {
          temp: conversations.tempId,
          storage: conversations.id
        },
        title: conversations.title
      })
      .from(conversations)
    return result
  }

  async function addMessage(newMessage: InsertMessage) {
    const result = await db
      .insert(messages)
      .values(newMessage)
      .returning()
    return result    
  }

  return {
    createConversation,
    getConversationMetadata,
    addMessage
  }
}

export type QueriesType = Awaited<ReturnType<typeof buildQueries>>