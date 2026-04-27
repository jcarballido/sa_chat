import { GENERATE_TITLE } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function generateTitleNode(state:State): Promise<Update> {

  console.log("---GENERATE TITLE RUNNING---")  
  try {
    const res = await askLLM(state.initialMessage,{systemPrompt: GENERATE_TITLE})
    console.log("---GENERATE TITLE RESPONSE---")
    res
    console.log("------")
  console.log("---GENERATE TITLE COMPLETE---")
  return {
    latestLLMResponse: res.message.content
  }
  } catch (error) {
    throw error    
  }
}