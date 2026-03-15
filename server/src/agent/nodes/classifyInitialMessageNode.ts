import ollama from "ollama"
import type { State, Update } from "../state.js"
import { MODEL } from "../../constants/constants.js"
import { CLASSIFICATION_SYSTEM_PROMPT } from "../../constants/system_prompts.js"
import z from "zod"

export async function classifyInitialMessageNode(state: State): Promise<Update>{

  const response = await ollama.chat({
    model:MODEL,
    stream: false,
    messages:[
      {role: "system", content: CLASSIFICATION_SYSTEM_PROMPT},
      {role: "user", content: state.initialMessage}
    ],
    format:"json"
  })
  
  return{
    lastLLMResponse: response.message.content
  }
}