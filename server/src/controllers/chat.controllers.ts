import { type FastifyReply, type FastifyRequest } from "fastify";
// import { RequestMessageSchema } from "../schemas/schemas.js"
import type { ChatServices } from "../services/chat.services.js";
import { buildApiResponseSchema, IncomingMessageSchema, UserMessageSchema, type IncomingMessageType, type OutgoingMessageType } from "../types/api.types.js";
import type { QueriesType } from "../db/queries.js";
import { failure, success } from "../api/responseGenerators.js";

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
    try {
      const result = await chatService.getStoredConversationMetadata()
      reply.code(201)
      return success(result)      
    } catch (error) {
      console.log("ERROR AT CONTROLLER")
      reply.code(400)
      return failure("INTERNAL SERVICE ERROR", `${error}`)
    }
  }

  return{
    processMessage,
    getStoredConversationMetadata
  }
}

export type ChatController = ReturnType<typeof buildChatController>