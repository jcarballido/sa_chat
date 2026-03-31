import { EXTRACT_SPEC_VALUES } from "../../constants/system_prompts.js";
import type { State,Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function specValueExtractionNode(state:State): Promise<Update> {
  
  console.log("---specValueExtractionNode RUNNING---")

  try {
    const response = await askLLM(state.initialMessage, {systemPrompt:EXTRACT_SPEC_VALUES})
    console.log("RESPONSE RECIEVED:")
    console.log(response)
    console.log("---specValueExtractionNode COMPLETE---")
    return {
      latestLLMResponse: response.message.content
    }
  } catch (error) {
    console.log("ERROR CAUGHT IN specValueExtractionNode")
    console.log("---specValueExtractionNode COMPLETE---")
    throw error
  }
}