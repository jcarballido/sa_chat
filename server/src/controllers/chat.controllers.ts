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
        content: `ONLY THE FOLLOWING MODEL NUMBERS ARE VALID:
        
        ${inventoryModelNumbers.join()}

        You will parse a message from a USER role and extract a model number from it. It is extremly common for the USER role to erroneously misplace the '-' and commit typos. You will respond ONLY in valid JSON format and no additional text. Your response will be input into another model. If you successfully determine a model number, answer in the following format:

        {"result": "success","extracted": "//MODEL NUMBER EXTRACTED FROM USER PROMPT"}

        If you CANNOT determine a model number from the USER role, your response must follow this format:
        
        {"result": "error", "message": "A model number could not be determined from your input."}

        DO NOT GUESS AND DO NOT ASSUME MODEL NUMBERS.
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
    
    const response = await llm(messageHistory)
    // ADD VALIDATION STEP
    console.log("Response: ", response)
    const parsedResponse: Response = await JSON.parse(response)
    console.log("Parsed Response: ", parsedResponse)
    if(parsedResponse.result !== "success"){
      console.log("parsed request when not success: ", parsedResponse)
      console.log("Type check: ", typeof parsedResponse)
      console.log("Parsed response result: ",Object.entries(parsedResponse))
      return {
        response: "Confirm you have the correct model number."
      }
    }else {
      messageHistory = [
        {
          role: "SYSTEM",
          content:`You are a model number inventory lookup. You will analyze a model number suggested by a USER role and determine the closest model number or model numbers from the following inventory list:
          ${inventoryModelNumbers.join()}

          When a message is recieved from the USER role, it is extremely common for an existing '-' to be positioned in the wrong location or completely missing, for letters and numbers to be missing, and for typos to exist. 
          1. DO NOT RESPOND WITH ADDITIONAL TEXT, ONLY VALID JSON IN THE FOLLOWING FORMAT:
          {"matches":string[]} 
          2. ONLY SUGGEST MODEL NUMBERS THAT EXIST IN THE INVENTORY LIST.
          3. DO NOT INVENT MODEL NUMBERS.
          4. DO NOT TREAT THE '-' CHARACTER AS A SPLIT.

          `
        },
        {
          role:"USER",
          content:`Analyze the extracted model number: ${parsedResponse.extracted}, and return any model number or model numbers that match the closest from the inventory list.
          Return ONLY VALID JSON  with the potential matches as an array of strings in the following format:
          {"matches":string[]}
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
    console.log("ERROR: ", error)
    // throw error
  }
}

//        content: "You will look at a message from a USER role, attempt to extract what appears to be a model number and then check the provided list of confirmed existing model numbers to find the closest match and return the closest, confirmed model number from the provided list. You will ONLY return the closest,confirmed model number. Do not attempt to guess if a model number does not exists from a USER message. DO NOT make up confirmed model numbers. It is extremely common for the '-' to be in the wrong location from USER roles. It is also common for the digits to be off. If no model numbers are present in the message from a USER, or a confirmed model number do not exist, return an error message in the JSON format: {result: error, message:'Model number could not be extracted' or 'No model numbers come close to the extracted message'}"
