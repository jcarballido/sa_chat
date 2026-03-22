import { array } from "zod"
import type { State } from "../agent/state.js"
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
    const confirmedInventoryModelNumbers = executionService.getInventoriedModelNumbers()
    return await llm.invokeAgent(message,confirmedInventoryModelNumbers)
  }

  async function executeIntent(agentState:State): Promise<string> {
    const {maliciousIntent, outOfScopeIntent, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, focusedIntentSpecsExtracted, focusedIntentModelsExtracted} = agentState

    if(maliciousIntent) return 'Malicious intent detected'
    if(outOfScopeIntent) return 'Out of Scope intent'
    if(relatedIntent) return relatedIntentLLMResponse
    if(focusedIntent){
      const isModelsArray = Array.isArray(focusedIntentModelsExtracted)
      if(focusedIntentModelsExtracted.length == 0) return 'Must provide at least one existing model number.'
      if(focusedIntentClassification == "similar_products"){
        if(isModelsArray && focusedIntentModelsExtracted.length > 0){
          const res = await executionService.getSimilarModels(focusedIntentModelsExtracted[0]!)
          return `Similar models found: \n
          ${res}
          `
        }else if(typeof(focusedIntentModelsExtracted) == "string"){
          const res = await executionService.getSimilarModels(focusedIntentModelsExtracted)
          return JSON.stringify(res)
        }
      }
      if(focusedIntentClassification == "product_comparison"){
        // if: "product_comparison" -> require: (2) model numbers, pull specs, use LLM to compare, use LLM to generate a response -> end
        return 'Classified as "product_comparison"'
      }
      if(focusedIntentClassification == "product_lookup"){
        // if: "product_lookup" -> require: (1) model number',pull all specs -> end
        if(isModelsArray){
          const res = await executionService.getModelSpecs(focusedIntentModelsExtracted[0]!)
          return JSON.stringify(res)
        }
        const res = await executionService.getModelSpecs(focusedIntentModelsExtracted)
        return JSON.stringify(res)
      }
    }
    return "Error determining INTENT"
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