import { generalLLMAgent } from "../agents/generalAgent.js";
import { intentAgent } from "../agents/intentAgent.js"
import type { LLMcall, Prompts, SpecificationRow } from "../types/types.js"
import * as prompt from "../constants/system_prompts.js"


export async function buildLlmCall(): Promise<LLMcall> {
  async function invokeIntentAgent(message: string, inventoriedModelNumbers: string[]) {

    function sanitizeUserPrompt(originalString: string): string{
      const targetRegex =  /[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/g;
      const updatedString = originalString.replace(targetRegex, (match) => {
        return match.replace(/-/g,"")
      })
      return updatedString
    } 

    const sanitizedInputMessage = sanitizeUserPrompt(message)
    try {
      const response = await intentAgent.invoke({
        initialMessage: sanitizedInputMessage,
        inventoryStore: inventoriedModelNumbers
      })
      return response
    } catch (error) {
      console.log("ERROR INVOKING intentAgent")
      throw error
    }
  }
  
  async function invokeGeneralLLMAgent(models: SpecificationRow[], systemPrompt: string ) {
    // try {
    //   const res = await generalLLMAgent.invoke({
    //     systemPrompt
    //   })
    //   return res
    // } catch (error) {
    //   console.log("ERROR INVOKING generalAgent")
    //   throw error
    // }
  }

  return {
    invokeIntentAgent,
  }
}


