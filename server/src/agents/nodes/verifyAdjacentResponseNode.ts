import z from "zod";
import type { State, Update } from "../intentAgentState.js";
import stringExists from "../util/stringExists.js";

const AdjacentIntentResponse = z.object({
  response: z.string()
})

export async function verifyAdjacentIntentNode(state: State) : Promise<Update> {

  console.log("VERIFY ADJACENT INTENT running.")
  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifyAdjacentIntentNode.")
  const responseRegex = /(\{\s*"response"\s*\:\s*(?:.*)\s*\})/
  const regexTest = stringExists(state.latestLLMResponse, responseRegex)
  if(!regexTest.result) {
    console.log("RESPONSE NOT FOUND IN VERIFICATION NODE")
    return {
      retries: state.retries + 1
    }
  }
  const parsedResponse = JSON.parse(regexTest.match.trim())
  const safeParseResult = AdjacentIntentResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  const generalResponse = safeParseResult.data?.response
  console.log("CLASSIFICATION IN VERIFICATION NODE:")
  console.log(generalResponse)
  return {
    relatedIntentLLMResponse: generalResponse,
    retries: 0
  }
}