import { type FastifyReply, type FastifyRequest } from "fastify";
import { llm } from "../services/llm.services.js";
import z from "zod";
import { messageStore } from "../services/message-store.js";
import path from "node:path";
import { modelParse } from "../services/model-spec.services.js";

type RequestBody = {
  message: string
}

const MessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1,"Message cannot be emtpy")
    .max(200,"Maximum message length exceeded")
}).strict()

const dataPath = path.join(process.cwd(),"data/modelSpec.csv")
const modelLookup = await modelParse(dataPath)


export async function createChat (
  request: FastifyRequest<{ Body: RequestBody }>,
  reply: FastifyReply
) {
  try {
    const body = MessageSchema.parse(request.body)
    const { message } = body
    console.log("Message in the body: ", message)
    messageStore.addUserMessage(message)
    const response = await llm(messageStore.getMessages())
    messageStore.addAssistantMessage(response)    
    console.log("Message History: ",messageStore.getMessages())
    return { response }
  } catch (error) {
    throw error    
  }

}

export async function extractModelNumber(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = MessageSchema.parse(request.body)
    const { message } = body
    console.log("Message in the body: ", message)
    
    const inventoryModelNumbers = modelLookup.getColumn("model") 

    const messageHistory = [
      {
        role: "SYSTEM",
        content: "You are an efficient extractor. You will look at a message from a USER role, attempt to extract what appears to be a model number and then check the provided list of confirmed existing model numbers to find the closest match and return the closest, confirmed model number from the provided list. You will ONLY return the closest,confirmed model number. Do not attempt to guess if a model number does not exists from a USER message. DO NOT make up confirmed model numbers. It is extremely common for the '-' to be in the wrong location from USER roles. It is also common for the digits to be off. If no model numbers are present in the message from a USER, or a confirmed model number do not exist, return an error message in the JSON format: {result: error, message:'Model number could not be extracted' or 'No model numbers come close to the extracted message'}"
      },
      {
        role: "SYSTEM",
        content:`This is the list of confirmed model numbers existing in inventory: ${modelLookup.getColumn("model")}`
      },
      {
        role: "USER",
        content:`${message}`
      }
    ]

    const response = await llm(messageHistory)

    return {
      response
    }

  } catch (error) {
    throw error
  }
}