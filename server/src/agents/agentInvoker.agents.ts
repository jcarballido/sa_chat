import type { AgentInvokerType } from "../types/agentInvoker.types.js";
import type { IntentAgentType } from "./intentAgent.js"

export async function buildAgentInvoker(agent: IntentAgentType): Promise<AgentInvokerType> {

  async function invoke(message: string, inventoriedModelNumbers: string[], title?: string ) {

    console.log("---BUILD AGENT---")
    console.log("INVENTORIED MODELS:")
    console.log(inventoriedModelNumbers)
    try {
      const response = await agent.invoke({
        title,
        initialMessage: message.replaceAll("-",""),
        inventoryStore: inventoriedModelNumbers
      })
      console.log("---BUILD AGENT COMPLETE---")
      console.log("BUILD AGENT RESULT:")
      console.log(response)
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