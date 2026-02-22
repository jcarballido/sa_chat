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


// export async function createChat (
//   request: FastifyRequest<{ Body: RequestBody }>,
//   reply: FastifyReply
// ) {
//   try {
//     const body = MessageSchema.parse(request.body)
//     const { message } = body
//     console.log("Message in the body: ", message)
//     messageStore.addUserMessage(message)
//     const response = await llm(messageStore.getMessages())
//     messageStore.addAssistantMessage(response)    
//     console.log("Message History: ",messageStore.getMessages())
//     return { response }
//   } catch (error) {
//     throw error    
//   }

// }

export async function extractModelNumber(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = MessageSchema.parse(request.body)
    const { message } = body
    console.log("Message in the body: ", message)
    
    const inventoryModelNumbers = modelLookup.getColumn("model") 
    console.log("Confirmed models: ",inventoryModelNumbers)
    let messageHistory = [
      {
        role: "SYSTEM",
        content: `You will attempt to extract a model number submitted by the USER role. You will respond in JSON format and no additional text. Your response will be input into another model. If you successfully determine a model number answer in the following format:

          {
            result: success,
            extracted: MODEL NUMBER FROM USER PROMPT
          }

        If you CANNOT determine a model number from the USER role, your response must follow this format:
        {result: error, message: A model number could not be determined from your input.}
        `
      },
      {
        role: "USER",
        content:`${message}`
      }
    ]

    type Response = {
      result: "success",
      extracted: string
    } | {
      result: "error",
      message: string
    }
    
    const response= await llm(messageHistory)
    console.log("Response: ", response)
    const parsedResponse: Response = JSON.parse(JSON.stringify(response))
    console.log("Parsed Response: ", parsedResponse)
    if(parsedResponse.result !== "success"){
      return {
        response: "Confirm you have the correct model number."
      }
    }else {
      messageHistory = [
        {
          role: "SYSTEM",
          content:`You will attempt to match the following model number: ${response} extracted from a USER role message to the closest model number or numbers existing in the following list of confirmed model numbers that exist in inventory:
          ${inventoryModelNumbers.join()}
  
          It is extremely common for an existing dash to be positioned in the wrong location, for letters and numbers to be missing, and for typos.
          `
        }
      ]
      console.log("Updated message history: ", messageHistory)
      const matchingModel = await llm(messageHistory)  
      console.log("Matching model: ", matchingModel)
  
      return {
        match: matchingModel
      }
    }
  } catch (error) {
    throw error
  }
}

//        content: "You will look at a message from a USER role, attempt to extract what appears to be a model number and then check the provided list of confirmed existing model numbers to find the closest match and return the closest, confirmed model number from the provided list. You will ONLY return the closest,confirmed model number. Do not attempt to guess if a model number does not exists from a USER message. DO NOT make up confirmed model numbers. It is extremely common for the '-' to be in the wrong location from USER roles. It is also common for the digits to be off. If no model numbers are present in the message from a USER, or a confirmed model number do not exist, return an error message in the JSON format: {result: error, message:'Model number could not be extracted' or 'No model numbers come close to the extracted message'}"
