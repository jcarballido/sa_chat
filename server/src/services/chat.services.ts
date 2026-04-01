import type { State } from "../agents/intentAgentState.js"
import * as prompts from "../constants/system_prompts.js"
import type { SpecificationMap } from "../schemas/schemas.js"
import type { LLMcall, SpecificationRow } from "../types/types.js"

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
      if(focusedIntentClassification == "similar_products"){
        //CHORE: Update getSimilarModels to accept an array
        const res = await executionService.getSimilarModels(filteredMatches)
        return `Similar models found: 
        ${JSON.stringify(res)}
        `
      }
      if(focusedIntentClassification == "product_comparison"){
        console.log('Classified as "product_comparison"')
        if(filteredMatches.length < 2) return "At least 2 model numbers required."
        const specs = executionService.getModelSpecs(filteredMatches)
        if(specs.length < 2) return "Could not locate specs for all model numbers to compare"
        const resultingSpecs: {
        [K in SpecificationRow["model"]]:Omit<SpecificationRow,"model">
        } = {}
        for(const spec of specs){
          const {model,...rest} = spec
          resultingSpecs[model] = {...rest} 
        }

        const toString = JSON.stringify(resultingSpecs)

        const comparisonPrompt = prompts.COMPARSION_SYSTEM_PROMPT(toString)

        const res = await llm.invokeGeneralLLMAgent(comparisonPrompt)

        return res.res
      }
      if(focusedIntentClassification == "product_lookup_by_model"){
          const res = executionService.getModelSpecs(filteredMatches)
          return JSON.stringify(res)
      }
      if(focusedIntentClassification == "product_lookup_by_specs"){
        const requestedSpecsAsStrings:{category: keyof typeof SpecificationMap,value:string | null}[] = agentState.focusedIntentSpecValuesExtracted.specValues
        // Take specStrings and convert them to correct values based on types
        const convertedRequestedSpecs = requestedSpecsAsStrings.map( spec => {
          if(spec.value === null){
            return {category: spec.category, value: null}
          }
          if(spec.category == "model") return {category:spec.category,value: spec.value}
          if(spec.category == "waterproof"){
            const waterproofValue = spec.value.toLowerCase()
            if(waterproofValue === "false") return {category:spec.category,value: false}
            return {category:spec.category,value: true}
          }
          console.log("SPEC VALUE:")
          console.log(spec.value)
          console.log("DIGITS EXIST:")
          const digitsExist = spec.value.match(/\d+/) || []
          console.log(digitsExist)
          const extractedDigits = digitsExist[0]
          if(extractedDigits){
            return { category:spec.category, value: Number(extractedDigits) }
          }
          return { category:spec.category, value: null }
        })
        console.log("CONVERTED REQUESTED SPECS:")
        console.log(convertedRequestedSpecs)
        const filteredRequestedSpecs = convertedRequestedSpecs.filter(spec => spec.value !== null)
        console.log("filteredRequestedSpecs:")
        console.log(filteredRequestedSpecs)

        const res = await executionService.getSpecs(filteredRequestedSpecs)
        if (res !== undefined) return JSON.stringify(res)
      }
    }
    console.log("Focused Intent Classification: ", focusedIntentClassification)
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