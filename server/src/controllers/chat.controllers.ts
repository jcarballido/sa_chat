import { type FastifyRequest } from "fastify";
import { ResponseMessageSchema } from "../schemas/schemas.js"

export function buildChatController(service:ReturnType<typeof import("../services/chat.services.js").buildServices>) {

  async function processMessage(request: FastifyRequest) {
    console.log("REQUEST BODY:")
    console.log(request.body)
    const body = ResponseMessageSchema.safeParse(request.body)
    if(body.error){
      return{
        status:"error",
        data:null,
        error:{
          code:"FAIL",
          message:"ERROR PARSING BODY."
        }
      }
    }
    const {id,conversationId,content} = body.data
    try {
      const llmResponse = await service.generateRespone(content)
  
      return {
        status:"success",
        data:{
          id,
          conversationId: conversationId,
          role:"assistant",
          content:llmResponse,
          createdAt: new Date().toISOString(),
          status: "delivered"
        },
        error: null
      }      
    } catch (error) {
      
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

  // async function test(request:FastifyRequest): Promise<z.infer<ReturnType<typeof ApiResponseSchema<typeof ResponseMessageSchema>>>> {
  //   console.log("REQUEST BODY:")
  //   console.log(request.body)
  //   const body = ResponseMessageSchema.safeParse(request.body)
  //   // const body = request.body
  //   if(body.error){
  //     console.log("ERROR PARSING BODY:")
  //     console.log(body)
  //     return{
  //       status:"error",
  //       data:null,
  //       error:{
  //         code:"FAIL",
  //         message:"Dummy fail message"
  //       }
  //     }
  //   }
  //   const {id,conversationId} = body.data
  //   return {
  //     status:"success",
  //     data:{
  //       id,
  //       conversationId: conversationId,
  //       role:"assistant",
  //       content:`Dummy Response ${Math.random()}`,
  //       createdAt: new Date().toISOString(),
  //       status: "delivered"
  //     },
  //     error: null
      
  //   }
  // }

  return{
    processMessage,
  }
}
