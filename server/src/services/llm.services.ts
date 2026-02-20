import ollama, { type Message} from "ollama"
import type { ChatModels } from "../types/types.js"

const MODEL = "llama3.1"

export async function llm(messageHistory:Message[]) {
  console.log("Sending prompt to ollama")
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
