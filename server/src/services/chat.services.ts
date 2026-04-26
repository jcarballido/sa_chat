import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import { ReturnedSpecValue } from "../schemas/schemas.js"
import type { FilteredSpecSchemaKeys, LLMcall, RawLLMResult, SpecificationRow, SpecSchemaReturnTypes, TransformedSpec } from "../types/types.js"
import { specificationSchema } from "../plugins/specificationStore.plugin.js"
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "../constants/constants.js"

export function buildServices(llm: LLMcall, executionService: ReturnType<typeof import("../infrastructure/buildDomainExecutionService.js").buildDomainExecutionServices>){

  async function determineIntent(message:string) {
    const confirmedInventoryModelNumbers = executionService.strippedModelNumbers
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

    if(initialMessageClassification === "malicious") {
      const number = Math.floor(Math.random() * ((MALICIOUS_INTENT_RESPONSES.length - 1)));
      return MALICIOUS_INTENT_RESPONSES[number] ?? "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere."
    }

    if(initialMessageClassification === "out_of_scope"){
      const number = Math.floor(Math.random() * (OUT_OF_SCOPE_RESPONSES.length - 1));
      return MALICIOUS_INTENT_RESPONSES[number] ?? JSON.stringify({type:"out_of_scope",text:"That\’s outside my lane, I\’m here for more specific tasks.",data:null})
    }

    if(relatedIntent) return relatedIntentLLMResponse

    if(focusedIntent){
      console.log("Focused Intent Classification: ", focusedIntentClassification)
      if(focusedIntentClassification == "similar_products"){
        const res = await executionService.getSimilarModels(filteredMatches)
        return JSON.stringify({type:"similar_products", text: null,data: res})        
      }

      if(focusedIntentClassification == "product_comparison"){
        if(filteredMatches.length < 2) return "At least 2 model numbers required."
        const specs = executionService.getModelSpecs(filteredMatches)
        if(specs.length < 2) return "Could not locate specs for all model numbers to compare"
        const resultingSpecs: {[K in SpecificationRow["model"]]:Omit<SpecificationRow,"model">} = {}
        for(const spec of specs){
          const {model,...rest} = spec
          resultingSpecs[model] = {...rest} 
        }
        return JSON.stringify({type: "product_comparison", text: null,data:resultingSpecs})
      }
      
      if(focusedIntentClassification == "product_lookup_by_model"){
          const res = executionService.getModelSpecs(filteredMatches)
          return JSON.stringify({type:"product_lookup_by_model", text:null,data:res})
      }
      if(focusedIntentClassification == "product_lookup_by_specs"){
        const returnedSpecValues:z.infer<(typeof ReturnedSpecValue)> = agentState.focusedIntentSpecValuesExtracted.specValues
        const convertedSpecValues = returnedSpecValues.map( spec => {
          const test = transformSpecs(spec)
          return test
        }) as TransformedSpec[]
        const filteredRequestedSpecValues = convertedSpecValues.filter(spec => spec.value !== null )
        const res = await executionService.getSpecs(filteredRequestedSpecValues)
        if (res !== undefined) return JSON.stringify({type:"product_lookup_by_specs",text:null,data:res})
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