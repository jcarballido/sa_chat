import { NONENGLISH_MODEL_NUMBERS } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function modelTokenExtractorNode(state:State): Promise<Update> {
  
  console.log("TOKEN EXTRACTION NODE running.")

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: NONENGLISH_MODEL_NUMBERS})
    console.log("TOKEN EXTRACTION response:")
    console.log(response.message.content)
    return {
      latestLLMResponse: response.message.content,
    }
  } catch (error) {
    console.log("Error thrown in MODEL EXTRACTION NODE")
    throw error
  }  
}