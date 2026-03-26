import z from "zod";
import type { State, Update } from "../intentAgentState.js";
import stringExists from "../util/stringExists.js";

const ModelExtractionResponse = z.array(z.string())

export async function verifyModelTokenExtractorNode(state:State): Promise<Update> {
  console.log("VERIFY MODEL TOKEN EXTRACTION running.")

  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifyModelTokenExtractorNode.")
  const matchRegex =/\{\s*"?candidates"?\s*:\s*(\[[^\]]*\])\s*(?:.*)\}/
  const regexTest = stringExists(state.latestLLMResponse, matchRegex)
  console.log("REGEX TEST:")
  console.log(regexTest)
  if(!regexTest.result) {
    console.log("'CANDIDATES' NOT FOUND IN MODEL TOKEN EXTRACTION NODE")
    return {
      retries: state.retries + 1
    }
  }
  const safeParseResult = ModelExtractionResponse.safeParse(regexTest.match)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  console.log("SAFE PARSE RESULT:")
  console.log(safeParseResult)
  const tokenResult = safeParseResult.data
  return {
    candidates: tokenResult
  }
}
