import ollama from "ollama"
import type { ChatModels } from "../types/types.js"

export async function llm(prompt:string) {
  console.log("Sending prompt to ollama")
  const res = await ollama.chat({
    model: "llama3.1",
    stream: false,
    messages:[{role:"user",content:prompt}]
  })
  return res.message.content
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
