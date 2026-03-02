import ollama, { type Message } from "ollama"
import { MODEL } from "../constants/constants.js"
import { CLASSIFICATION_SYSTEM_PROMPT, EXTRACT_MODEL_SYSTEM_PROMPT, EXTRACT_OBJECTIVES_SYSTEM_PROMPT, GENERAL_CHAT_PROMPT } from "../constants/system_prompts.js"

export type LLMcall = {
  generalChat: (prompt: string) => Promise<string>,
  classification: (prompt: string) => Promise<string>,
  extractObjectives: (prompt: string) => Promise<string>,
  extractModel: (prompt:string) => Promise<string>
}

export async function buildLlmCall(inventoryModels:string[]): Promise<LLMcall>{  
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

  function generalChat(prompt:string){
    return chatLLM([{role:"SYSTEM",content:GENERAL_CHAT_PROMPT},{role:"USER",content:prompt}])
  }
  function extractModel(prompt: string){
    if(!inventoryModels){
      throw new Error("Inventory models undefined.")
    }
    return chatLLM([{role:"SYSTEM",content:EXTRACT_MODEL_SYSTEM_PROMPT(inventoryModels)},{role:"USER",content:prompt}])    
  }

  function extractObjectives(prompt: string){
    return chatLLM([{role:"SYSTEM",content:EXTRACT_OBJECTIVES_SYSTEM_PROMPT},{role:"USER",content:prompt}])    
  }

  function classification(prompt: string) {
    return chatLLM([{role:"SYSTEM",content:CLASSIFICATION_SYSTEM_PROMPT},{role:"USER",content:prompt}])
  }
  
  return {
    generalChat,
    classification,
    extractObjectives,
    extractModel
  }
}

