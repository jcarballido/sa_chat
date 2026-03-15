import z from "zod";
import type { State, Update } from "../state.js";
import stringExists from "../util/seekString.js";

const IntentResponse = z.object({
  intent: z.enum(["malicious","out_of_scope","adjacent","focused"])
})

export async function verifyClassificationNode(state:State): Promise<Update> {  
  if(!state.lastLLMResponse) throw new Error("LLM response is missing in state passed to verifyClassificationNode.")
  const intentRegex = /(\{\s*"intent"\s*\:\s*(?:"malicious"|"out_of_scope"|"adjacent"|"focused")\s*\})/
  const regexTest = stringExists(state.lastLLMResponse, intentRegex)
  if(!regexTest.result) {
    return {
      retries: state.retries + 1
    }
  }
  const parsedResponse = JSON.parse(regexTest.match)
  const safeParseResult = IntentResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    return {
      retries: state.retries + 1
    }
  }
  const classification = safeParseResult.data?.intent
  return {
    lastLLMResponse: null,
    classification
  }
}