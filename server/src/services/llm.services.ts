import ollama, { type Message} from "ollama"
import type { ChatModels } from "../types/types.js"

const MODEL = "llama3.1"

export async function llm(messageHistory:Message[]) {
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

export async function modelNumberExtractor(inventoriedModelNumbers: string[], prompt: string){
  try {
    const res = await ollama.chat({
      model: MODEL,
      stream: false,
      messages:[{role:"USER",content: prompt}]
    })
    
    return res.message.content    
    
  } catch (error) {
    throw error
  }
}

export const checkOllamaReachable = async () => {
  try {
    const res = await fetch("http://localhost:11434")
    return res.ok     
  } catch (error) {
    throw error
  }
}


export const checkModelAvailble = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags")
    if(!response) throw new Error("Zero models available.")
    const data = (await response.json()) as ChatModels
    if(data.models.some(model => model.name.includes("llama"))) return true
  } catch (error) {
    throw error    
  }
}
