import type { AgentInvokerType } from "../types/agentInvoker.types.js";
import type { IntentAgentType } from "./intentAgent.js"

export async function buildAgentInvoker(agent: IntentAgentType): Promise<AgentInvokerType> {

  async function invoke(message: string, inventoriedModelNumbers: string[], title?: string ) {

    console.log("---BUILD AGENT---")
      const response = await agent.invoke({
        title,
        initialMessage: message,
        inventoryStore: inventoriedModelNumbers
      })
      
      return response
    
  }  

  return {
    invoke
  }
}

export type AgentInvoker = Awaited<ReturnType<typeof buildAgentInvoker>>