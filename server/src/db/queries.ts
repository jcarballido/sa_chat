import { db } from "./client.js";
import { conversations, type InsertConversation } from "./schema/conversations.schema.js";
import { messages, type InsertMessage } from "./schema/messages.schema.js";

export async function buildQueries() {

  async function createConversation(newConversation: InsertConversation) {
    await db
      .insert(conversations)
      .values(newConversation)
      .returning({newConversationId: conversations.id})
  }

  async function getConversations() {
    const result = await db
      .select()
      .from(conversations)
    return result
  }

  async function addMessage(newMessage: InsertMessage) {
    await db
      .insert(messages)
      .values(newMessage)
      .returning({newMessageId: messages.id})    
  }

  return {
    createConversation,
    getConversations,
    addMessage
  }
}

export type QueriesType = ReturnType<typeof buildQueries>