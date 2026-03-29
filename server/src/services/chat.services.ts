import type { State } from "../agents/intentAgentState.js"
import * as prompts from "../constants/system_prompts.js"
import type { LLMcall } from "../types/types.js"

const logOut = (logs: string[]) => {
  console.log("---")
  for (const log of logs){
    console.log(log)
  }
  console.log("---")
}

export function buildServices(llm: LLMcall, executionService: ReturnType<typeof import("../infrastructure/buildDomainExecutionService.js").buildDomainExecutionServices>){

  async function determineIntent(message:string) {
    const confirmedInventoryModelNumbers = executionService.strippedModelNumbersInInventory
    return await llm.invokeIntentAgent(message,confirmedInventoryModelNumbers)
  }

  async function executeIntent(agentState:State): Promise<string> {
    const {initialMessageClassification, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, filteredMatches} = agentState
    // if(latestLLMResponse) return latestLLMResponse
    if(initialMessageClassification === "malicious") return 'Malicious intent detected'
    if(initialMessageClassification === "out_of_scope") return 'Out of Scope intent'
    if(relatedIntent) return relatedIntentLLMResponse
    if(focusedIntent){
      // if(focusedIntentClassification == "similar_products"){
      //   console.log("EXTRACTED MODEL NUMBER: ", filteredMatches)
      //   //CHORE: Update getSimilarModels to accept an array
      //   const res = await executionService.getSimilarModels(filteredMatches)
      //   return `Similar models found: 
      //   ${JSON.stringify(res)}
      //   `
      // }
      // if(focusedIntentClassification == "product_comparison"){
        // CHORE: Update getModelSpecs to accept an array
        // if(filteredMatches.length < 2) return "At least 2 model numbers required."
        // const [model1,model2] = filteredMatches
        // if(model1 !== undefined && model2 !== undefined){
        //   const model1Specs = await executionService.getModelSpecs(model1)
        //   const mod1 = model1Specs[0]!
        //   const model2Specs = await executionService.getModelSpecs(model2)
        //   const mod2 = model2Specs[0]!
        //   const comparisonPrompt = prompts.COMPARSION_SYSTEM_PROMPT([mod1,mod2])
        //   const res = await llm.invokeGeneralLLMAgent([mod1,mod2], comparisonPrompt)
        // }
        // return 'Classified as "product_comparison"'
      // }
      if(focusedIntentClassification == "product_lookup"){
          const res = executionService.getModelSpecs(filteredMatches)
          return JSON.stringify(res)
      }
    }
    return "FOCUSED INTENT RETURNED, BUT NOT SIMILAR PRODUCTS CLASSIFICATION"
  }

  async function generateRespone(userPrompt:string): Promise<string> {
    const intent = await determineIntent(userPrompt)
    const executionResult = await executeIntent(intent)

    return executionResult
  }

  return{
    generateRespone
  }
}