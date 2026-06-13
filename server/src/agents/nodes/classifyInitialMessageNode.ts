import type { State, Update } from "../intentAgentState.js"
import { CLASSIFICATION_SYSTEM_PROMPT } from "../../constants/system_prompts.js"
import { prompt } from "../util/prompt.js"

export async function classifyInitialMessageNode(state: State): Promise<Update>{

  console.log("CLASSIFYING INITIAL MESSAGE NODE running.")

  try {
    const initialMessage = state.initialMessage.replace("-","")
    console.log("INITIAL MESSAGE: ")
    console.log(initialMessage)
    const response = await prompt(initialMessage, CLASSIFICATION_SYSTEM_PROMPT)
    console.log("RESPONSE FROM OLLAMA:")
    console.log(JSON.parse(response.message.content))
    return{
      latestLLMResponse: response.message.content
    }    
  } catch (error) {
    throw error
  }
}
