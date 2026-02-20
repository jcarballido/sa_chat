import { type FastifyReply, type FastifyRequest } from "fastify";
import { llm } from "../services/llm.services.js";
import z from "zod";
import { messageStore } from "../services/message-store.js";

type RequestBody = {
  message: string
}

const MessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1,"Message cannot be emtpy")
    .max(200,"Maximum message length exceeded")
}).strict()

export async function createChat (
  request: FastifyRequest<{ Body: RequestBody }>,
  reply: FastifyReply
) {
  try {
    const body = MessageSchema.parse(request.body)
    const { message } = body
    console.log("Message in the body: ", message)
    messageStore.addUserMessage(message)
    const response = await llm(messageStore.getMessages())
    messageStore.addAssistantMessage(response)    
    console.log("Message History: ",messageStore.getMessages())
    return { response }
  } catch (error) {
    throw error    
  }

}