import { and, eq } from "drizzle-orm";
import { db } from "./client.js";
import { conversations, type InsertConversation, type SelectConversation } from "./schema/conversations.schema.js";
import { messages, type InsertMessage } from "./schema/messages.schema.js";
import { error } from "node:console";

export async function buildQueries() {

  async function createConversation(supabaseUserId: string, tempId: string) {
    const result = await db
      .insert(conversations)
      .values({supabaseUserId, tempId})
      .returning({newConversationId: conversations.id})    
    return result
  }

  async function getConversationMetadata(userId: SelectConversation["supabaseUserId"]) {
    const result = await db
      .select({
        conversationId: {
          temp: conversations.tempId,
          storage: conversations.id
        },
        title: conversations.title
      })
      .from(conversations)
      .where(
        eq(conversations.supabaseUserId, userId)
      )
    return result
  }

  async function addMessage(newMessage: InsertMessage, userId: SelectConversation["supabaseUserId"]) {
    const check = await db
      .select({
        conversationId: conversations.id
      })
      .from(conversations)
      .where(
        and(
          eq(conversations.id, newMessage.conversationId ),
          eq(conversations.supabaseUserId, userId)
        )
      )

    if(check.length === 0) throw new Error("UNAUTHORIZED REQUEST")

    const result = await db
      .insert(messages)
      .values(newMessage)
      .returning()
    return result    
  }

  async function getStoredConversation(conversationId:SelectConversation["id"], userId: SelectConversation["supabaseUserId"]) {
    const result = await db 
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.supabaseUserId, userId)
        )
      )
    return result
   } 


  async function getStoredMessages(id:SelectConversation["id"]) {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId,id))
    return result
  }

  async function assignConversationTitle(title: string, storedConverationId: number) {
    await db
    .update(conversations)
    .set({title})
    .where(eq(conversations.id, storedConverationId))    
  }

  return {
    createConversation,
    getConversationMetadata,
    addMessage,
    getStoredConversation,
    getStoredMessages,
    assignConversationTitle
  }
}

export type QueriesType = Awaited<ReturnType<typeof buildQueries>>