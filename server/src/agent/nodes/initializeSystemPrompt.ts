import type { State, Update } from "../state.js";
import { CLASSIFICATION_SYSTEM_PROMPT } from "../../constants/system_prompts.js";

export async function initializeSystemPrompt(state:State): Promise<Update> {

  console.log("Initializing System Prompt")
  
  return{
    messages: {role:"system", content: CLASSIFICATION_SYSTEM_PROMPT}
  }
}