import { agent } from "../agent/agent.js"

export type LLMcall = {
  generalChat: (message: string) => Promise<unknown>,
  // classification: (prompt: string) => Promise<string>,
  // extractObjectives: (prompt: string) => Promise<string>,
  // extractModel: (prompt: string) => Promise<string>
}

export async function buildLlmCall(inventoryModels: string[]): Promise<LLMcall> {
  async function invokeAgent(message: string) {
    try {
      const response = agent.invoke({
        initialMessage: message
      })
      console.log("LLM RESPONSE")
      console.log(response)
    } catch (error) {
      throw error
    }
  }

  return {
    generalChat: invokeAgent
  }
}

  // const res = await ollama.chat({
  //   model: MODEL,
  //   stream: false,
  //   messages: [],
  //   format: "json"
  // })
  // return res.message.content

