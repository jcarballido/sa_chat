import { type FastifyRequest } from "fastify";
import { PromptSchema } from "../schemas/schemas.js"

export function buildChatController(service:ReturnType<typeof import("../services/chat.services.js").buildServices>) {

  async function processMessage(request: FastifyRequest) {
    const body = PromptSchema.safeParse(request.body)
    if(!body.error){
      const { message } = body.data
      return await service.processMessage(message)
    }
    console.log("ERROR in caht.controller")
    throw new Error(body.error.message)

    // return service.processMessage(message)
  }
  return{
    processMessage
  }
}
