import { type FastifyReply, type FastifyRequest } from "fastify";
import { llm } from "../services/llm.services.js";
import z from "zod";

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
    const response = await llm(message)    
    return { response }
  } catch (error) {
    throw error    
  }

}