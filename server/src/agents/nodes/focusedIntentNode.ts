import { EXTRACT_OBJECTIVES_SYSTEM_PROMPT, GENERAL_CHAT_PROMPT } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function focusedIntentNode(state:State): Promise<Update> {
  console.log("FOCUSED INTENT NODE running.")

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: EXTRACT_OBJECTIVES_SYSTEM_PROMPT})
    console.log("FOCUSED INTENT LLM response:")
    console.log(response.message.content)
    console.log("END OF FOCUSED INTENT LLM response")
    return {
      latestLLMResponse: response.message.content,
      relatedIntent: false,
      maliciousIntent:false,
      outOfScopeIntent: false,
      focusedIntent: true
    }
  } catch (error) {
    throw error
  }  
}