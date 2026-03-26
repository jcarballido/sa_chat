import { MATCH_CANDIDATES, NONENGLISH_MODEL_NUMBERS } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function modelMatchingNode(state:State): Promise<Update> {
  
  console.log("MODEL MATCHING NODE running.")

  const candidates = state.candidates
  const matchPrompt = MATCH_CANDIDATES(candidates, state.inventoryStore)
  console.log("INVENTORY PASSED IN:")
  console.log(state.inventoryStore)

  try {
    const response = await askLLM(state.initialMessage,{systemPrompt: matchPrompt})
    console.log("MODEL matching response:")
    console.log(response.message.content)
    return {
      latestLLMResponse: response.message.content,
    }
  } catch (error) {
    console.log("Error thrown in MODEL EXTRACTION NODE")
    throw error
  }  
}