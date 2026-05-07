import { type FastifyInstance, type FastifyRequest } from "fastify";
// import { RequestMessageSchema } from "../schemas/schemas.js"
import type { ChatServices } from "../services/chat.services.js";
import { RequestMessageSchema } from "../types/api.types.js";

export function buildChatController(chatService: ChatServices) {
  console.log("LOADING buildChatController")
  async function processMessage(request: FastifyRequest) {
    console.log("REQUEST BODY:")
    console.log(request.body)
    const result = RequestMessageSchema.safeParse(request.body)
    if(result.error){
      return{
        status:"error",
        data:null,
        error:{
          code:"FAIL",
          message:"ERROR PARSING BODY."
        }
      }
    }

    const requestMessage = result.data

    console.log("---chat.controller---")
    console.log("BODY DATA")
    console.log(result.data)
    console.log(typeof(result.data))

    try {
      const agentResult = await chatService.generateRespone(result.data)
      console.log("AGENT RESULT")
      console.log(agentResult)
      console.log(typeof(agentResult))
      const {title,...rest} = agentResult
  
      return {
        status:"success",
        data:{
          title,
          id: requestMessage.id,
          conversationId: requestMessage.conversationId,
          conversationTitle: title,
          role:"assistant",
          content:rest,
          createdAt: new Date().toISOString(),
          status: "delivered"
        },
        error: null
      }      
    } catch (error) {
      console.log("ERROR  in chat.controllers")
      console.log(error)
      return {
        status:"error",
        data:null,
        error:{
          code:"FAIL",
          message:`${error}`
        }
      }
    }
  }

  return{
    processMessage,
  }
}

export type ChatController = ReturnType<typeof buildChatController>