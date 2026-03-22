import { agent } from "../agent/agent.js"
import type { LLMcall } from "../types/types.js"

export async function buildLlmCall(inventoryModels: string[]): Promise<LLMcall> {
  
  function sanitizeUserPrompt(originalString: string): string{
    const targetRegex = /\b(?=[A-Za-z0-9-]*-)[A-Za-z0-9-]+\b/g;
    const updatedString = originalString.replace(targetRegex, (match) => {
      return match.replace("-","")
    })
    return updatedString
  } 
  
  async function invokeAgent(message: string, inventoriedModelNumbers: string[]) {

    const sanitizedInputMessage = sanitizeUserPrompt(message)
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


