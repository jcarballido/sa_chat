import { type FastifyReply, type FastifyRequest } from "fastify";
// import { RequestMessageSchema } from "../schemas/schemas.js"
import type { ChatServices } from "../services/chat.services.js";
import { buildApiResponseSchema, IncomingMessageSchema, UserMessageSchema, type IncomingMessageType, type OutgoingMessageType } from "../types/api.types.js";
import type { QueriesType } from "../db/queries.js";
import { failure, success } from "../api/responseGenerators.js";
import type { SelectConversation } from "../db/schema/conversations.schema.js";

export function buildChatController(chatService: ChatServices) {

  console.log("---chat.controller---")
  
  async function processMessage(request: FastifyRequest,reply: FastifyReply) {

    console.log("REQUEST BODY:")
    console.log(request.body)

    const result = IncomingMessageSchema.safeParse(request.body)
    if(result.error){
      console.log("FAILED VALIDATION:")
      console.log(result.error)
      reply.code(400)
      return failure("INVALID_INPUT",`${JSON.stringify(result.error.flatten)}`)
    }

    const incomingMessage: IncomingMessageType = result.data

    try {
      const outgoingMessage: OutgoingMessageType = await chatService.processIncomingMessage(incomingMessage, request.user!)
      
      reply.code(201)
      return success(outgoingMessage)
  
    } catch (error) {
      console.log("ERROR  in chat.controllers")
      console.log(error)
      return failure("INTERNAL_SERVICE_ERROR",`${error}`)
    }
  }

  async function getStoredConversationMetadata(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user!
    try {
      const result = await chatService.getStoredConversationMetadata(userId.sub)
      reply.code(201)
      return success(result)      
    } catch (error) {
      console.log("ERROR AT CONTROLLER")
      reply.code(400)
      return failure("INTERNAL SERVICE ERROR", `${error}`)
    }
  }

  async function getStoredConversation(request: FastifyRequest<{
  Params: {
    id: string
  }
}>, reply: FastifyReply) {
    const userId = request.user!
    try {
      const id: SelectConversation["id"] = Number(request.params.id)
      const result = await chatService.getStoredConversation(id, userId.sub)
      reply.code(201)
      return success(result)            
    } catch (error) {
      console.log("ERROR AT CONTROLLER")
      console.log(error)
      reply.code(400)
      return failure("INTERNAL SERVICE ERROR", `${error}`)      
    }
  }

  return{
    processMessage,
    getStoredConversationMetadata,
    getStoredConversation
  }
}

export type ChatController = ReturnType<typeof buildChatController>