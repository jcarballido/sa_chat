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
      // "similar_products","product_comparison","product_lookup"
      // if: "product_lookup" -> require: (1) model number',pull all specs -> end
      // if: "product_comparison" -> require: (2) model numbers, pull specs, use LLM to compare, use LLM to generate a response -> end
      // if: "similar_products" -> require: (1) model number, run comparison algo, feed to LLM to write a response -> end
      

    }
    return ''
  }

  async function generateRespone(userPrompt:string): Promise<string> {
    const intent = await determineIntent(userPrompt)
    const executionResult = await executeIntent(intent)

    return executionResult
  }

  return{
    executeIntent
  }
}