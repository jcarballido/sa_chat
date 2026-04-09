import { type FastifyRequest } from "fastify";
import { ApiResponseSchema, PromptSchema, ResponseMessageSchema } from "../schemas/schemas.js"
import z from "zod";

export function buildChatController(service:ReturnType<typeof import("../services/chat.services.js").buildServices>) {

  async function processMessage(request: FastifyRequest) {
    const body = PromptSchema.safeParse(request.body)
    if(!body.error){
      const { message } = body.data
      return await service.generateRespone(message)
    }
    console.log("ERROR in chat.controller")
    throw new Error(body.error.message)

    // return service.processMessage(message)
  }

  async function test(request:FastifyRequest): Promise<z.infer<ReturnType<typeof ApiResponseSchema<typeof ResponseMessageSchema>>>> {
    // const body = PromptSchema.safeParse(request.body)
    const body = request.body
    return {
      status:"success",
      data:{
        id:"1",
        conversationId:"1",
        role:"assistant",
        content:"Dummy Response",
        createdAt: new Date().toISOString(),
        status: "delivered"
      },
      error: null
    }
  }

  return{
    processMessage,
    test
  }
}
