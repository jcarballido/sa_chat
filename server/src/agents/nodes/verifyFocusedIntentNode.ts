import z from "zod";
import type { State, Update } from "../intentAgentState.js";
import stringExists from "../util/stringExists.js";

const FocusedIntentResponse = z.object({
  intent: z.enum(["similar_products","product_comparison","product_lookup_by_model","product_lookup_by_specs","other"])
})

export async function verifyFocusedIntentNode(state: State): Promise<Update> {
  
  console.log("VERIFY FOCUSED INTENT running.")
  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifyFocusedIntentNode.")
  const intentRegex = /(\{\s*"intent"\s*\:\s*(?:"similar_products"|"product_comparison"|"product_lookup_by_model"|"product_lookup_by_specs"|"other")\s*(?:.*)\})/
  const regexTest = stringExists(state.latestLLMResponse, intentRegex)
  if(!regexTest.result) {
    console.log("RESPONSE NOT FOUND IN FOCUSED INTENT VERIFICATION NODE")
    return {
      retries: state.retries + 1
    }
  }
  const parsedResponse = regexTest.match
  const safeParseResult = FocusedIntentResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  const focusedIntentClassification = safeParseResult.data?.intent
  console.log("CLASSIFICATION IN VERIFY FOCUSED INTENT NODE:")
  console.log(focusedIntentClassification)
  return {
    focusedIntentClassification,
    retries: 0
  }
}