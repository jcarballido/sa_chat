import type { State, Update } from "../intentAgentState.js"
import { CLASSIFICATION_SYSTEM_PROMPT } from "../../constants/system_prompts.js"
import { askLLM } from "../util/askLLM.js"

export async function classifyInitialMessageNode(state: State): Promise<Update>{

  console.log("CLASSIFYING INITIAL MESSAGE NODE running.")

  try {
    const response = await askLLM(state.initialMessage, {systemPrompt: CLASSIFICATION_SYSTEM_PROMPT})
    console.log("RESPONSE FROM OLLAMA:")
    console.log(JSON.parse(response.message.content))
    return{
      latestLLMResponse: response.message.content
    }    
  } catch (error) {
    throw error
  }
}
