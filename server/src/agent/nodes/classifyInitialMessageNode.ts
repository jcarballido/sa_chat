import ollama from "ollama"
import type { State, Update } from "../state.js"
import { MODEL } from "../../constants/constants.js"
import { CLASSIFICATION_SYSTEM_PROMPT } from "../../constants/system_prompts.js"
import z from "zod"
import { askLLM } from "../util/askLLM.js"

export async function classifyInitialMessageNode(state: State): Promise<Update>{

  console.log("CLASSIFYIN INITIAL MESSAGE NODE running.")

  try {
    const response = await askLLM(state.initialMessage, {systemPrompt: CLASSIFICATION_SYSTEM_PROMPT})
    console.log("RESPONSE FROM OLLAMA:")
    console.log(JSON.parse(response.message.content))
    return{
      lastLLMResponse: response.message.content
    }    
  } catch (error) {
    throw error
  }
}

// const response = await ollama.chat({
//   model:MODEL,
//   stream: false,
//   messages:[
//     {role: "system", content: CLASSIFICATION_SYSTEM_PROMPT},
//     {role: "user", content: state.initialMessage}
//   ],
//   format:"json"
// })
