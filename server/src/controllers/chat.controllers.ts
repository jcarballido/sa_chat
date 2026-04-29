import { type FastifyRequest } from "fastify";
import { RequestMessageSchema } from "../schemas/schemas.js"

export function buildChatController(service:ReturnType<typeof import("../services/chat.services.js").buildServices>) {

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
      const llmResponse = await service.generateRespone(result.data)
      console.log("LLMR RESPONSE")
      console.log(llmResponse)
      console.log(typeof(llmResponse))
      const {title,...rest} = llmResponse
  
      return {
        status:"success",
        data:{
          id: requestMessage.id,
          conversationId: requestMessage.conversationId,
          conversationTitle: title,
          role:"assistant",
          content:JSON.stringify(rest),
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
