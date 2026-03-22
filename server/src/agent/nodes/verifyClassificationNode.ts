import z from "zod";
import type { State, Update } from "../state.js";
import stringExists from "../util/stringExists.js";

const IntentResponse = z.object({
  intent: z.enum(["malicious","out_of_scope","adjacent","focused"])
})

export async function verifyClassificationNode(state:State): Promise<Update> {
  
  console.log("VERIFYING CLASSIFICATION NODE")
  
  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifyClassificationNode.")
  const intentRegex = /(\{\s*"intent"\s*\:\s*(?:"malicious"|"out_of_scope"|"adjacent"|"focused")\s*\})/
  const regexTest = stringExists(state.latestLLMResponse, intentRegex)
  if(!regexTest.result) {
    console.log("INTENT NOT FOUND IN VERIFICATION NODE")
    return {
      retries: state.retries + 1
    }
  }

  const parsedResponse = JSON.parse(regexTest.match.trim())
  const safeParseResult = IntentResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  const classification = safeParseResult.data?.intent
  console.log("CLASSIFICATION IN VERIFICATION NODE:")
  console.log(classification)
  return {
    latestLLMResponse: null,
    initialMessageClassification: classification,
    retries: 0
  }
}