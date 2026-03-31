import z from "zod"
import type { State, Update } from "../intentAgentState.js"
import stringExists from "../util/stringExists.js"

const SpecCategoriesResponse = z.object({
  specValues: z.array(z.object({category: z.string(),value: z.string()}))
})

export async function verifySpecValueExtractionNode(state: State) : Promise<Update> {

  console.log("---verifySpecValueExtractionNode RUNNING---")
  
  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifySpecValueExtractionNode.")
  console.log("verifySpecValueExtractionNode LLM RESULT:")
  console.log(state.latestLLMResponse)
  const specCategoriesRegex = /(\{\s*"specValues"\s*:\s*\[[\s\S]*?\]\s*})/
  const regexTest = stringExists(state.latestLLMResponse, specCategoriesRegex)
  if(!regexTest.result) {
    console.log("RESPONSE NOT FOUND IN SPEC VALUE VERIFICATION NODE")
    return {
      retries: state.retries + 1
    }
  }

  const parsedResponse = regexTest.match
  const safeParseResult = SpecCategoriesResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR in verifySpecValueExtractionNode")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  
  const specValues = safeParseResult.data
  console.log("VERIFICATION OF SPEC CATEGORIES NODE:")
  console.log(specValues)
  console.log("---verifySpecValueExtractionNode COMPLETE---")
  return {
    focusedIntentSpecValuesExtracted: specValues,
    retries: 0
  }
}