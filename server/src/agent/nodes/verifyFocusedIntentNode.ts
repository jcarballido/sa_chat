import type { State, Update } from "../state.js";
import { askLLM } from "../util/askLLM.js";

export async function verifyFocusedIntentNode(state: State): Promise<Update> {
  
  console.log("FOCUSED INTENT NODE running.")

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: ""})
    console.log("FOCUSED RESPONSE:")
    console.log(response.message.content)
    return {
      lastLLMResponse: response.message.content,
      adjacentIntent: false,
      maliciousIntent: true,
      outOfScopeIntent: false,
      focusedIntent: false
    }
  } catch (error) {
    throw error
  }  
}