import { type FastifyReply, type FastifyRequest } from "fastify";
import { llm } from "../services/llm.services.js";
import z from "zod";
import { messageStore } from "../services/message-store.js";
import path from "node:path";
import { loadCsv } from "../services/model-spec.services.js";

type RequestBody = {
  message: string
}
const inventoryPath = path.join(process.cwd(),"data/inventory.csv")
const modelLookup = await loadCsv(inventoryPath)
const modelNumbers = modelLookup.getColumnValues("model")

const specSheetPath = path.join(process.cwd(), "data/modelSpec.csv")
const specLookup = await loadCsv(specSheetPath)

const confirmedModelNumbers = modelNumbers

type ConfirmedModelNumbers = typeof confirmedModelNumbers[number]

const MessageSchema = z.object({
  message: z.object({
    model: z.string().trim().min(1, "Model cannot be empty").max(200, "Maximum message length exceeded"),
  }),
}).strict()

export function buildChatController(service:ReturnType<typeof import("../services/chat.services.js").buildChatService>) {

  async function getRowsByColumnValue(request: FastifyRequest) {
    const body = MessageSchema.parse(request.body)
    const { message } = body
    const modelNumber = message.model
    return service.getRowsByColumnValue("model",modelNumber)
  }
  return{
    getRowsByColumnValue
  }
}

// export async function extractModelNumber(request: FastifyRequest, reply: FastifyReply) {
//   try {
//     const body = MessageSchema.parse(request.body)
//     const { message } = body
//     console.log("Message in the body: ", message)
    
//     const inventoryModelNumbers = modelLookup.getColumnValues("model") 
//     console.log("Confirmed models: ",inventoryModelNumbers)
//     let messageHistory = [
//       {
//         role: "SYSTEM",
//         content: `ONLY THE FOLLOWING MODEL NUMBERS ARE VALID:
        
//         ${inventoryModelNumbers.join()}

//         You will parse a message from a USER role and extract a model number from it. It is extremly common for the USER role to erroneously misplace the '-' and commit typos. You will respond ONLY in valid JSON format and no additional text. Your response will be input into another model. If you successfully determine a model number, answer in the following format:

//         {"result": "success","extracted": "//MODEL NUMBER EXTRACTED FROM USER PROMPT"}

//         If you CANNOT determine a model number from the USER role, your response must follow this format:
        
//         {"result": "error", "message": "A model number could not be determined from your input."}

//         DO NOT GUESS AND DO NOT ASSUME MODEL NUMBERS.
//         `
//       },
//       {
//         role: "USER",
//         content:`${message}`
//       }
//     ]

//     type Response = {
//       result: "success",
//       extracted: string
//     } | {
//       result: "error",
//       message: string
//     }
    
//     const response = await llm(messageHistory)
//     // ADD VALIDATION STEP
//     console.log("Response: ", response)
//     const parsedResponse: Response = await JSON.parse(response)
//     console.log("Parsed Response: ", parsedResponse)
//     if(parsedResponse.result !== "success"){
//       console.log("parsed request when not success: ", parsedResponse)
//       console.log("Type check: ", typeof parsedResponse)
//       console.log("Parsed response result: ",Object.entries(parsedResponse))
//       return {
//         response: "Confirm you have the correct model number."
//       }
//     }else {
//       messageHistory = [
//         {
//           role: "SYSTEM",
//           content:`You are a model number inventory lookup. You will analyze a model number suggested by a USER role and determine the closest model number or model numbers from the following inventory list:
//           ${inventoryModelNumbers.join()}

//           When a message is recieved from the USER role, it is extremely common for an existing '-' to be positioned in the wrong location or completely missing, for letters and numbers to be missing, and for typos to exist. 
//           1. DO NOT RESPOND WITH ADDITIONAL TEXT, ONLY VALID JSON IN THE FOLLOWING FORMAT:
//           {"matches":string[]} 
//           2. ONLY SUGGEST MODEL NUMBERS THAT EXIST IN THE INVENTORY LIST.
//           3. DO NOT INVENT MODEL NUMBERS.
//           4. DO NOT TREAT THE '-' CHARACTER AS A SPLIT.

//           `
//         },
//         {
//           role:"USER",
//           content:`Analyze the extracted model number: ${parsedResponse.extracted}, and return any model number or model numbers that match the closest from the inventory list.
//           Return ONLY VALID JSON  with the potential matches as an array of strings in the following format:
//           {"matches":string[]}
//           `
//         }
//       ]
//       console.log("Updated message history: ", messageHistory)
//       const matchingModel = await llm(messageHistory)  
//       console.log("Matching model: ", matchingModel)
//       const parsedMatchingModel:{matches:string[]} = JSON.parse(matchingModel)
//       console.log("Parsed matching model: ",parsedMatchingModel)
//       const firstModel = parsedMatchingModel.matches[0]

//       if(firstModel){
//         const specs = specLookup.getRowsByColumnValue("model",firstModel)
//         console.log("Specs: ",specs)
//         return {
//           specs: specs
//         }
//       }
//     }
//   } catch (error) {
//     console.log("ERROR: ", error)
//     // throw error
//   }
// }

// export async function fetchModelSpecs(modelNumber:ConfirmedModelNumbers) {

// }
