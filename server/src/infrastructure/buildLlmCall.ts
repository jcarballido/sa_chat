import ollama, { type Message } from "ollama"
import { MODEL } from "../constants/constants.js"
import { CLASSIFICATION_SYSTEM_PROMPT, EXTRACTION_SYSTEM_PROMPT } from "../constants/system_prompts.js"
export type LLMcall = {
  chatLLM: (messageHistory: Message[]) => Promise<string>,
  classificationLLM: (prompt: string) => Promise<string>,
  extractionLLM: (prompt: string) => Promise<string>
}

export async function buildLlmCall(): Promise<LLMcall>{  
  async function chatLLM(messageHistory: Message[]){
    try {
      const res = await ollama.chat({
        model: MODEL,
        stream: false,
        messages:messageHistory,
        format: "json"
      })
      
      return res.message.content    
    } catch (error) {
      throw error
   }
  }
  async function classificationLLM(initialPrompt:string) {
    try {
      const res = await ollama.chat({
        model: MODEL,
        stream: false,
        messages:[{role:"SYSTEM",content:CLASSIFICATION_SYSTEM_PROMPT},{role:"USER",content:initialPrompt}],
        format: "json"

      })  
      return res.message.content    
    } catch (error) {
      throw error
   }    
  }
    async function extractionLLM(initialPrompt:string) {
    try {
      const res = await ollama.chat({
        model: MODEL,
        stream: false,
        messages:[{role:"SYSTEM",content:EXTRACTION_SYSTEM_PROMPT},{role:"USER",content:initialPrompt}],
        format: "json"

      })  
      return res.message.content    
    } catch (error) {
      throw error
   }    
  }


  return {
    chatLLM,
    classificationLLM,
    extractionLLM
  }
}
