import type { AgentInvokerType } from "../types/agentInvoker.types.js";
import type { IntentAgentType } from "./intentAgent.js"

export async function buildAgentInvoker(agent: IntentAgentType): Promise<AgentInvokerType> {

  async function invoke(message: string, inventoriedModelNumbers: string[], title?: string ) {

    console.log("---BUILD AGENT---")
    try {
      const response = await agent.invoke({
        title,
        initialMessage: message,
        inventoryStore: inventoriedModelNumbers
      })
      console.log("---BUILD AGENT COMPLETE---")
      return response      
    } catch (error) {
      console.log("ERROR IN INVOKER")
      console.log("---BUILD AGENT COMPLETE---")
      throw error
    }
  }  
  return {
    invoke
  }
}

export type AgentInvoker = Awaited<ReturnType<typeof buildAgentInvoker>>