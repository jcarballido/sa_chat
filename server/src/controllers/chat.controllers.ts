import { type FastifyReply, type FastifyRequest } from "fastify";
// import { RequestMessageSchema } from "../schemas/schemas.js"
import type { ChatServices } from "../services/chat.services.js";
import { buildApiResponseSchema, NewUserMessageSchema, UserMessageSchema } from "../types/api.types.js";
import type { QueriesType } from "../db/queries.js";
import type z from "zod";
import { failure } from "../api/responseGenerators.js";

export function buildChatController(chatService: ChatServices, queries: QueriesType, ) {
// console.log("---chat.controller---")

//   export const LLMResponseSchema = z.object({
//   conversation: z.object({
//     title: z.string(),
//     conversationId: z.string(),
//     messages: z.tuple([AssistantMessageSchema, EnhancedUserMessageSchema])
  //   }) 
  // })

  // export const NewUserMessageSchema = z.object({
  // conversation: z.object({
  //   title: z.string().nullable(),
  //   conversationId: z.string().nullable(),
  //   newMessage: UserMessageSchema
  // }) 
  // }) 
  async function processMessage(request: FastifyRequest,reply: FastifyReply) {

    console.log("REQUEST BODY:")
    console.log(request.body)

    const result = NewUserMessageSchema.safeParse(request.body)
    if(result.error){
      return failure("FAIL","ERROR PARSING BODY")
      // return{
      //   status:"error",
      //   data:null,
      //   error:{
      //     code:"FAIL",
      //     message:"ERROR PARSING BODY."
      //   }
      // }
    }

    const data = result.data

    // let llmPayload: z.infer<typeof UserMessageSchema>

    // if "New message" -> Create conversation
    // if(!userMessage.conversationId){
    //   try {
    //     const [ newConversation ] = await queries.createConversation(request.user?.sub!)
    //     llmPayload = {
    //       ...userMessage,
    //       conversationId: newConversation?.newConversationId!
    //     }
    //     await queries.addMessage(llmPayload)
    //   } catch (error) {
    //     console.log("ERROR CREATING CONVERSATION:")
    //     console.log(error)
    //     throw error        
    //   }
    // }else{
    //   llmPayload = userMessage
    // }

    try {
      const llmResponse = await chatService.generateRespone(data, request.user!)
      // const {title,...rest} = agentResult
      return llmResponse
      // LLM Response Shape:
      // *****
      // return {
      //   status:"success",
      //   data:{
      //      conversation:{
      //        title:"",
      //        convId: number,
      //        newAsssitantMessage:[
      //          {role:user,content:originalMessage,status}
      //          {role:assistant,content:,status }
      //        ]
      //      }
      //   },
      // }      
      // *****
      // return {
      //   status:"success",
      //   data:{
      //     title,
      //     id: userMessage.id,
      //     conversationId: userMessage.conversationId,
      //     conversationTitle: title,
      //     role:"assistant",
      //     content:rest,
      //     createdAt: new Date().toISOString(),
      //     status: "delivered"
      //   },
      //   error: null
      // }      
    } catch (error) {
      console.log("ERROR  in chat.controllers")
      console.log(error)
      return failure("FAIL",`${error}`)

      // return {
      //   status:"error",
      //   data:null,
      //   error:{
      //     code:"FAIL",
      //     message:`${error}`
      //   }
      // }
    }
  }

  return{
    processMessage,
  }
}

export type ChatController = ReturnType<typeof buildChatController>