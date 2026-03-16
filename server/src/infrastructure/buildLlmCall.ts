import { agent } from "../agent/agent.js"

export type LLMcall = {
  generalChat: (message: string, inventoriedModelNumbers: string[]) => Promise<unknown>,
}

export async function buildLlmCall(inventoryModels: string[]): Promise<LLMcall> {
  async function invokeAgent(message: string, inventoriedModelNumbers: string[]) {
    try {
      const response = await agent.invoke({
        initialMessage: message,
        inventoryStore: inventoriedModelNumbers
      })
      if(response.maliciousIntent){
        return "I am unable to continue with your message. Please remember I am only able to answer questions about our product specificaitons or general questions about secure storage."
      }
      if(response.outOfScopeIntent){
        return "Sorry, your message is outside of my abilities as an assistant. I am only able to answer questions about our product specifications or general questions about the secure storage."
      }
      if(response.modelsExtracted){
        return `${response.modelsExtracted}`
      }
      console.log("No models extracted")
      return "Error somewhere."
    } catch (error) {
      console.log("ERROR DURING INVOCATION")
      throw error
    }
  }

  return {
    generalChat: invokeAgent
  }
}


