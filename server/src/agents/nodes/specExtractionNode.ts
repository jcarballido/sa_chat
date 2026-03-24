import { EXTRACT_SPECS } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";

export async function specExtractionNode(state:State): Promise<Update> {
    console.log("SPEC EXTRACTION NODE running...")

    try {
        const response = await askLLM(state.initialMessage, {systemPrompt: EXTRACT_SPECS})
        console.log("LLM RESPONE:")
        console.log(response)
        
        return{
            latestLLMResponse: response.message.content
        }
    } catch (error) {
        console.log("Error in SPEC EXTRACTION NODE.")
        throw error
    }
}