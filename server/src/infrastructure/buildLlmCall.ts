import { agent } from "../agent/agent.js"
import type { LLMcall } from "../types/types.js"

export async function buildLlmCall(): Promise<LLMcall> {
  
  function sanitizeUserPrompt(originalString: string): string{
    const targetRegex =  /[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/g;
    const updatedString = originalString.replace(targetRegex, (match) => {
      return match.replace(/-/g,"")
    })
    return updatedString
  } 
  
  async function invokeAgent(message: string, inventoriedModelNumbers: string[]) {

    const sanitizedInputMessage = sanitizeUserPrompt(message)
    console.log("sanitized message:")
    console.log(sanitizedInputMessage)
    try {
      const response = await agent.invoke({
        initialMessage: sanitizedInputMessage,
        inventoryStore: inventoriedModelNumbers
      })
      return response
    } catch (error) {
      console.log("ERROR DURING INVOCATION")
      throw error
    }
  }

  return {
    invokeAgent
  }
}


