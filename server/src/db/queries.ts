import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { conversations, type InsertConversation, type SelectConversation } from "./schema/conversations.schema.js";
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

  async function getStoredConversation(conversationId:SelectConversation["id"]) {
    const result = await db 
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId))
    return result
   } 


  async function getStoredMessages(id:SelectConversation["id"]) {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId,id))
    return result
  }

  return {
    createConversation,
    getConversationMetadata,
    addMessage,
    getStoredConversation,
    getStoredMessages
  }
}

export type QueriesType = Awaited<ReturnType<typeof buildQueries>>