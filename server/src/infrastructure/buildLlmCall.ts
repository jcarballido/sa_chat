import { generalLLMAgent } from "../agents/generalAgent.js";
import { intentAgent } from "../agents/intentAgent.js"
import { RequestMessageSchema } from "../schemas/schemas.js";
import type { LLMcall } from "../types/types.js"


export async function buildLlmCall(): Promise<LLMcall> {
  async function invokeIntentAgent(message: string, title: string, inventoriedModelNumbers: string[]) {

    console.log("---BUILD LLM CALL---")
    console.log(typeof(message))
    console.log(message)

    function sanitizeUserPrompt(originalString: string): string{
      const targetRegex =  /[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/g;
      const updatedString = originalString.toUpperCase().replace(targetRegex, (match) => {
        return match.replace(/-/g,"")
      })
      return updatedString
    } 

    
    // const sanitizedInputMessage = sanitizeUserPrompt(message)
    // console.log("SANITIZED INPUT")
    // console.log(sanitizedInputMessage)
      // const parsed = JSON.parse(message)
      // console.log("JSON PARSED MESSAGE:")
      // console.log(typeof(parsed))
      // console.log(parsed)      
      // const validatedResult = RequestMessageSchema.safeParse(parsed)
      // if(validatedResult.error){
      //   console.log("Validation error:")
      //   console.log(validatedResult.error)
      //   throw new Error("Error validating sanitized user message")
  
      // }
      // const data = validatedResult.data
      // const title = data.title ?? null
      const response = await intentAgent.invoke({
        title,
        initialMessage: message,
        inventoryStore: inventoriedModelNumbers
      })
  return response
}  

  return {
    invokeIntentAgent,
    // invokeGeneralLLMAgent
  }
}


