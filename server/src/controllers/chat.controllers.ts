import { type FastifyRequest } from "fastify";
import { MessageSchema } from "../schemas/schemas.js"

export function buildChatController(service:ReturnType<typeof import("../services/chat.services.js").buildServices>) {

  async function processMessage(request: FastifyRequest) {
    const body = MessageSchema.parse(request.body)
    const { message } = body
    return service.processMessage(message)

    // return service.processMessage(message)
  }
  return{
    processMessage
  }
}
