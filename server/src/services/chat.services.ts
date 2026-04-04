import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import * as prompts from "../constants/system_prompts.js"
import { ReturnedSpecValue, SpecificationMap } from "../schemas/schemas.js"
import type { LLMcall, SpecificationRow } from "../types/types.js"
import { specificationSchema } from "../plugins/specificationStore.plugin.js"
import { number, readonly, type keyof } from "zod"

export function buildServices(llm: LLMcall, executionService: ReturnType<typeof import("../infrastructure/buildDomainExecutionService.js").buildDomainExecutionServices>){

  async function determineIntent(message:string) {
    const confirmedInventoryModelNumbers = executionService.strippedModelNumbersInInventory
    return await llm.invokeIntentAgent(message,confirmedInventoryModelNumbers)
  }

  type SpecificationSchema = typeof specificationSchema

  type FilteredSpecSchema = Omit<SpecificationSchema,"model">

  type FilteredSpecSchemaKeys = keyof FilteredSpecSchema

  type RawLLMResult = {
    category: FilteredSpecSchemaKeys,
    value: string[] | null
  }

  type SingleReturnType<S extends FilteredSpecSchemaKeys> = ReturnType<FilteredSpecSchema[S]>

  type SpecSchemaReturnTypes = {
    [K in FilteredSpecSchemaKeys] : SingleReturnType<K> extends boolean 
      ? boolean | null
      : SingleReturnType<K>[] | null
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
            const p = conversionFn(element)
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
  
  // function parseReturnedSpec<K extends keyof Omit<typeof specificationSchema, "model">>(
  //   spec: {category: K, value: string[] | null }
  // ): Extract<ParsedSpec<SpecificationRow>,{category: K}>
  // {
  //   if(spec.value === null || spec.value.length ===  0) return {category:spec.category,value: null}
  //   const parse = specificationSchema[spec.category]
  //   if(spec.category == "waterproof"){
  //     const waterproofValue = spec.value?.[0] ?? "true"
  //     const waterproofValueToLowercase = waterproofValue.toLowerCase()
  //     return {category:spec.category, value: parse(waterproofValueToLowercase) as MapedValues<Omit<typeof specificationSchema,"model">>[K]} 
  //   }
  //   if(typeof(specificationSchema[spec.category])  === "number"){
  //     const minimumValue = spec.value[0] || ""
  //     const maximumValue = spec.value[1] || ""
  //     const digitsExistMinimumValue = minimumValue.match(/\d+/) || ["0"]
  //     const extractedMinValue = digitsExistMinimumValue[0]
  //     const digitsExistMaximumValue = maximumValue.match(/\d+/) || ["Infinity"]
  //     const extractedMaxValue = digitsExistMaximumValue[0]
  //     return { category: spec.category, value: [Number(extractedMinValue), Number(extractedMaxValue)] }
  //   }
  //   const extractedValue = spec.value[0] || ""
  //   const digitsExist = extractedValue.match(/\d+/) || []
  //   console.log(digitsExist)
  //   const extractedDigits = digitsExist[0]
  //   if(extractedDigits){
  //     return { category:spec.category, value: [Number(extractedDigits)] }
  //   }
  //   return {
  //     category: spec.category,value: null
  //   }
  // }
  
  async function executeIntent(agentState:State): Promise<string> {
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
        return `Similar models found: 
        ${JSON.stringify(res)}
        `
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
        const returnedSpecValues:z.infer<(typeof ReturnedSpecValue)> = agentState.focusedIntentSpecValuesExtracted.specValues
        const convertedSpecValues = returnedSpecValues.map( spec => {
            return transformSpecs(spec)
        })
        console.log("CONVERTED REQUESTED SPECS:")
        console.log(convertedSpecValues)
        const filteredRequestedSpecValues = convertedSpecValues.filter(spec => spec.value !== null )
        console.log("filteredRequestedSpecs:")
        console.log(filteredRequestedSpecValues)

        const res = await executionService.getSpecs(filteredRequestedSpecValues)
        if (res !== undefined) return JSON.stringify(res)
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