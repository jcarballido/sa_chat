import z from "zod";
import type { State, Update } from "../state.js";
import stringExists from "../util/seekString.js";

const FocusedIntentResponse = z.object({
  intent: z.enum(["similar_products","product_comparison","product_lookup","other"])
})

export async function verifyFocusedIntentNode(state: State): Promise<Update> {
  
  console.log("VERIFY FOCUSED INTENT running.")
  if(!state.lastLLMResponse) throw new Error("LLM response is missing in state passed to verifyFocusedIntentNode.")
  const responseRegex = /(\{\s*"intent"\s*\:\s*(?:.*)\s*\})/
  const regexTest = stringExists(state.lastLLMResponse, responseRegex)
  if(!regexTest.result) {
    console.log("RESPONSE NOT FOUND IN VERIFICATION NODE")
    return {
      retries: state.retries + 1
    }
  }
  const parsedResponse = JSON.parse(regexTest.match.trim())
  const safeParseResult = FocusedIntentResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  const focusedIntentResult = safeParseResult.data?.intent
  console.log("CLASSIFICATION IN VERIFICATION NODE:")
  console.log(focusedIntentResult)
  return {
    focusedIntentResult
  }
}