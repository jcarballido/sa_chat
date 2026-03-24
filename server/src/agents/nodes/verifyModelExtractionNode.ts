import z from "zod";
import type { State, Update } from "../intentAgentState.js";
import stringExists from "../util/stringExists.js";

const ModelExtractionResponse = z.object({
  match: z.array(z.string())
})


export async function verifyModelExtractionNode(state:State): Promise<Update> {
  console.log("VERIFY MODEL EXTRACTION running.")
  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifyModelExtractionNode.")
  const matchRegex =/\{\s*"?match"?\s*:\s*\[[^\]]*\]\s*\}/
  const regexTest = stringExists(state.latestLLMResponse, matchRegex)
  if(!regexTest.result) {
    console.log("RESPONSE NOT FOUND IN MODEL EXTRACTION NODE")
    return {
      retries: state.retries + 1
    }
  }
  const parsedResponse = JSON.parse(regexTest.match.trim())
  const safeParseResult = ModelExtractionResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  const matchResult = safeParseResult.data?.match
  const inventoryTransformation = new Set(state.inventoryStore)
  const filter = matchResult.filter(model => inventoryTransformation.has(model))
  console.log("VERIFY MODEL EXTRACTED NODE:")
  console.log(matchResult)
  console.log("FILTERED MATCH RESULT:")
  console.log(filter)
  return {
    focusedIntentModelsExtracted: filter
  }
}
