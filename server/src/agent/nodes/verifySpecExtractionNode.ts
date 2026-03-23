import z from "zod"
import type { State, Update } from "../state.js"
import stringExists from "../util/stringExists.js"

const SpecCategoriesResponse = z.object({
  specCategories: z.array(z.string())
})

export async function verifySpecExtractionNode(state: State) : Promise<Update> {

  console.log("VERIFY SPEC EXTRACTION running.")
  
  if(!state.latestLLMResponse) throw new Error("LLM response is missing in state passed to verifySpecExtractionNode.")
  const specCategoriesRegex = /(\{\s*"specCategories"\s*\:\s*(?:.*)\s*\})/
  const regexTest = stringExists(state.latestLLMResponse, specCategoriesRegex)
  if(!regexTest.result) {
    console.log("RESPONSE NOT FOUND IN VERIFICATION NODE")
    return {
      retries: state.retries + 1
    }
  }

  const parsedResponse = JSON.parse(regexTest.match.trim())
  const safeParseResult = SpecCategoriesResponse.safeParse(parsedResponse)
  if(safeParseResult.error){
    console.log("SAFE PARSE RESULT ERROR")
    console.log(safeParseResult)
    return {
      retries: state.retries + 1
    }
  }
  
  const specCategories = safeParseResult.data?.specCategories
  console.log("VERIFICATION OF SPEC CATEGORIES NODE:")
  console.log(specCategories)
  return {
    focusedIntentSpecsExtracted: specCategories,
    retries: 0
  }
}