import { fastify, type FastifyReply, type FastifyRequest } from "fastify";
import { llm } from "../services/llm.services.js";

type RequestBody = {
  message: string
}

export async function createChat (
  request: FastifyRequest<{ Body: RequestBody }>,
  reply: FastifyReply
) {
  const { message } = request.body
  console.log("Message in the body: ", message)
  try {
    const response = await llm(message)    
    return { response }
  } catch (error) {
    throw error    
  }

}