import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import * as prompts from "../constants/system_prompts.js"
import { ReturnedSpecValue, SpecificationMap } from "../schemas/schemas.js"
import type { FilteredSpecSchemaKeys, LLMcall, RawLLMResult, SpecificationRow, SpecSchemaReturnTypes, TransformedSpec } from "../types/types.js"
import { specificationSchema } from "../plugins/specificationStore.plugin.js"
import { number, readonly, type keyof } from "zod"

export function buildServices(llm: LLMcall, executionService: ReturnType<typeof import("../infrastructure/buildDomainExecutionService.js").buildDomainExecutionServices>){

  async function determineIntent(message:string) {
    const confirmedInventoryModelNumbers = executionService.strippedModelNumbersInInventory
    return await llm.invokeIntentAgent(message,confirmedInventoryModelNumbers)
  }


  const transformers: {
    [K in FilteredSpecSchemaKeys]: (raw: string[] | null) => SpecSchemaReturnTypes[K]
  } = Object.fromEntries(
    Object.entries(specificationSchema).map(([key, conversionFn]) => {
      const transformFn = (raw: string[] | null) => {
        const singleReturn = conversionFn(raw?.[0] ?? "true")
        return typeof singleReturn === "boolean"
          ? singleReturn
          : (raw ?? []).map((element,i,arr) => {
            if(arr.length === 1) {
              const digits = element.match(/\d+/) || ["null"]
              return conversionFn(digits[0])
            }
            const isLast = arr.length - 1
            if(i === 0) {
              const digits = element.match(/\d+/) || ["0"]
              return conversionFn(digits[0])
            }
            if(i === isLast) {
              const digits = element.match(/\d+/) || ["Infinity"]
              return conversionFn(digits[0])
            }
          })
      }
      return [key,transformFn] 
    })
  )as { [K in FilteredSpecSchemaKeys]: (raw: string[] | null) => SpecSchemaReturnTypes[K]}

  function transformSpecs<K extends FilteredSpecSchemaKeys>(
    spec: RawLLMResult & {category: K}
  ): {category: K,value: SpecSchemaReturnTypes[K]}
  {
    return {category:spec.category,value: transformers[spec.category](spec.value) }
  }
  
  async function executeIntent(agentState:State): Promise<string>  {
    const {initialMessageClassification, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, filteredMatches} = agentState
    // if(latestLLMResponse) return latestLLMResponse
    if(initialMessageClassification === "malicious") return 'Malicious intent detected'
    if(initialMessageClassification === "out_of_scope") return 'Out of Scope intent'
    if(relatedIntent) return relatedIntentLLMResponse
    if(focusedIntent){
      console.log("Focused Intent Classification: ", focusedIntentClassification)
      if(focusedIntentClassification == "similar_products"){
        //CHORE: Update getSimilarModels to accept an array
        const res = await executionService.getSimilarModels(filteredMatches)
        return JSON.stringify({domainData: res})
        
      }
      if(focusedIntentClassification == "product_comparison"){
        console.log('Classified as "product_comparison"')
        if(filteredMatches.length < 2) return "At least 2 model numbers required."
        const specs = executionService.getModelSpecs(filteredMatches)
        if(specs.length < 2) return "Could not locate specs for all model numbers to compare"
        const resultingSpecs: {[K in SpecificationRow["model"]]:Omit<SpecificationRow,"model">} = {}
        for(const spec of specs){
          const {model,...rest} = spec
          resultingSpecs[model] = {...rest} 
        }
        // const toString = JSON.stringify(resultingSpecs)
        // const comparisonPrompt = prompts.COMPARSION_SYSTEM_PROMPT(toString)
        // const res = await llm.invokeGeneralLLMAgent(comparisonPrompt)
        return JSON.stringify({domainData:resultingSpecs})
      }
      if(focusedIntentClassification == "product_lookup_by_model"){
          const res = executionService.getModelSpecs(filteredMatches)
          return JSON.stringify({domainData:res})
      }
      if(focusedIntentClassification == "product_lookup_by_specs"){
        const returnedSpecValues:z.infer<(typeof ReturnedSpecValue)> = agentState.focusedIntentSpecValuesExtracted.specValues
        const convertedSpecValues = returnedSpecValues.map( spec => {
          const test = transformSpecs(spec)
          return test
        }) as TransformedSpec[]
        const filteredRequestedSpecValues = convertedSpecValues.filter(spec => spec.value !== null )
        const res = await executionService.getSpecs(filteredRequestedSpecValues)
        if (res !== undefined) return JSON.stringify({domainData:res})
      }
    }
    return "FOCUSED INTENT RETURNED, BUT NOT SIMILAR PRODUCTS CLASSIFICATION"
  }

  async function generateRespone(userPrompt:string): Promise<string> {
    try {
      const intent = await determineIntent(userPrompt)
      const executionResult = await executeIntent(intent)

      return executionResult      
    } catch (error) {
      console.log("ERROR IN chat.service: ",error)
      throw error
    }
  }

  return{
    generateRespone
  }
}