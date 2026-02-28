import ollama, { type Message } from "ollama"
import { MODEL } from "../constants/constants.js"

export type LLMcall = {
  chatLLM: (messageHistory: Message[]) => Promise<string>
}

export async function buildLlmCall(): Promise<LLMcall>{  
  async function chatLLM(messageHistory: Message[]){
    try {
      const res = await ollama.chat({
        model: MODEL,
        stream: false,
        messages:messageHistory 
      })
      
      return res.message.content    
    } catch (error) {
      throw error
   }
  }

  return {
    chatLLM
  }
}
