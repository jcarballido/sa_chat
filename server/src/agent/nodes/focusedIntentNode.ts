import { GENERAL_CHAT_PROMPT } from "../../constants/system_prompts.js";
import type { State, Update } from "../state.js";
import { askLLM } from "../util/askLLM.js";

export async function focusedIntentNode(state:State): Promise<Update> {
  console.log("FOCUSED INTENT NODE running.")

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: GENERAL_CHAT_PROMPT})
    console.log("GENERAL CHAT RESPONSE:")
    console.log(response.message.content)
    return {
      lastLLMResponse: response.message.content,
      adjacentIntent: true,
      maliciousIntent:false,
      outOfScopeIntent: false,
      focusedIntent: false
    }
  } catch (error) {
    throw error
  }  

  return {
    focusedIntent: true,
    adjacentIntent: false,
    outOfScopeIntent: false,
    maliciousIntent: false
  }
}