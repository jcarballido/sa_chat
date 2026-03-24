import { EXTRACT_MODEL_SYSTEM_PROMPT } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function modelExtractionNode(state:State): Promise<Update> {
  
  console.log("MODEL EXTRACTION NODE running.")

  const inventory = EXTRACT_MODEL_SYSTEM_PROMPT(state.inventoryStore)

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: inventory})
    console.log("MODEL EXTRACTION response:")
    console.log(response.message.content)
    return {
      latestLLMResponse: response.message.content,
    }
  } catch (error) {
    console.log("Error thrown in MODEL EXTRACTION NODE")
    throw error
  }  
}