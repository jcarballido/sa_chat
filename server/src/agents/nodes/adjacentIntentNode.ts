import { GENERAL_CHAT_PROMPT } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function adjacentIntentNode(state:State): Promise<Update> {

  console.log("ADJACENT INTENT NODE running.")

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: GENERAL_CHAT_PROMPT})
    console.log("GENERAL CHAT RESPONSE:")
    console.log(response.message.content)
    return {
      latestLLMResponse: response.message.content,
      relatedIntent: true,
      maliciousIntent:false,
      outOfScopeIntent: false,
      focusedIntent: false
    }
  } catch (error) {
    throw error
  }  

}