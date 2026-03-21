import { agent } from "../agent/agent.js"
import type { LLMcall } from "../types/types.js"

export async function buildLlmCall(inventoryModels: string[]): Promise<LLMcall> {
  async function invokeAgent(message: string, inventoriedModelNumbers: string[]) {
    try {
      const response = await agent.invoke({
        initialMessage: message,
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


