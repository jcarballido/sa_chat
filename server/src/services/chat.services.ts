import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import { AssistantMessageContentSchema, RequestMessageSchema, ReturnedSpecValue, SpecificationMapSchema } from "../schemas/schemas.js"
import type { FilteredSpecSchemaKeys, LLMcall, RawLLMResult, SpecificationRow, SpecSchemaReturnTypes, TransformedSpec } from "../types/types.js"
import { specificationSchema } from "../plugins/specificationStore.plugin.js"
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "../constants/constants.js"
import fp from "fastify-plugin"
import type { FastifyInstance } from "fastify"

export async function buildChatServices(inventoryQuery: FastifyInstance["inventoryQuery"], specQuery: FastifyInstance["specQuery"]){

  // async function determineIntent(message: z.infer<typeof RequestMessageSchema>) {
  //   const confirmedInventoryModelNumbers = executionService.strippedModelNumbers
  //   return await llm.invokeIntentAgent(message.content,message.title ?? "",confirmedInventoryModelNumbers)
  // }

  // const transformers: {
  //   [K in FilteredSpecSchemaKeys]: (raw: string[] | null) => SpecSchemaReturnTypes[K]
  // } = Object.fromEntries(
  //   Object.entries(specificationSchema).map(([key, conversionFn]) => {
  //     const transformFn = (raw: string[] | null) => {
  //       const singleReturn = conversionFn(raw?.[0] ?? "true")
  //       return typeof singleReturn === "boolean"
  //         ? singleReturn
  //         : (raw ?? []).map((element,i,arr) => {
  //           if(arr.length === 1) {
  //             const digits = element.match(/\d+/) || ["null"]
  //             return conversionFn(digits[0])
  //           }
  //           const isLast = arr.length - 1
  //           if(i === 0) {
  //             const digits = element.match(/\d+/) || ["0"]
  //             return conversionFn(digits[0])
  //           }
  //           if(i === isLast) {
  //             const digits = element.match(/\d+/) || ["Infinity"]
  //             return conversionFn(digits[0])
  //           }
  //         })
  //     }
  //     return [key,transformFn] 
  //   })
  // )as { [K in FilteredSpecSchemaKeys]: (raw: string[] | null) => SpecSchemaReturnTypes[K]}

  // function transformSpecs<K extends FilteredSpecSchemaKeys>(
  //   spec: RawLLMResult & {category: K}
  // ): {category: K,value: SpecSchemaReturnTypes[K]}
  // {
  //   return {category:spec.category,value: transformers[spec.category](spec.value) }
  // }
  
  // async function executeIntent(agentState:State): Promise<z.infer<typeof AssistantMessageContentSchema>>  {

  //   const {initialMessageClassification, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, filteredMatches, title} = agentState

  //   if(initialMessageClassification === "malicious") {
  //     const number = Math.floor(Math.random() * ((MALICIOUS_INTENT_RESPONSES.length - 1)));
  //     return {title: title ?? "",type:"malicious",text:MALICIOUS_INTENT_RESPONSES[number] ?? "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere.",data:null}
  //   }

  //   if(initialMessageClassification === "out_of_scope"){
  //     const number = Math.floor(Math.random() * (OUT_OF_SCOPE_RESPONSES.length - 1));
  //     return {title: title ?? "",type:"out_of_scope",text:MALICIOUS_INTENT_RESPONSES[number] ?? "That\’s outside my lane, I\’m here for more specific tasks.",data:null}
  //   }

  //   if(relatedIntent) return {title: title ?? "",type:"related", text: relatedIntentLLMResponse ,data:null}

  //   if(focusedIntent){
  //     console.log("Focused Intent Classification: ", focusedIntentClassification)
  //     if(focusedIntentClassification == "similar_products"){
  //       const res = await executionService.getSimilarModels(filteredMatches)
  //       return {title: title ?? "",type:"similar_products", text: null,data: res}        
  //     }

  //     if(focusedIntentClassification == "product_comparison"){
  //       if(filteredMatches.length < 2) return {title: title ?? "",type: "other", text:  "At least 2 model numbers required.",data:null}
  //       const specs = executionService.getModelSpecs(filteredMatches)
  //       if(specs.length < 2) return {title: title ?? "",type: "other", text:"Could not locate specs for all model numbers to compare",data:null}
  //       return {title: title ?? "",type: "product_comparison", text: null,data:specs}
  //     }
      
  //     if(focusedIntentClassification == "product_lookup_by_model"){
  //         const res = executionService.getModelSpecs(filteredMatches)
  //         return {title: title ?? "",type:"product_lookup_by_model", text:null,data:res}
  //     }
  //     if(focusedIntentClassification == "product_lookup_by_specs"){
  //       const returnedSpecValues:z.infer<(typeof ReturnedSpecValue)> = agentState.focusedIntentSpecValuesExtracted.specValues
  //       const convertedSpecValues = returnedSpecValues.map( spec => {
  //         const test = transformSpecs(spec)
  //         return test
  //       }) as TransformedSpec[]
  //       const filteredRequestedSpecValues = convertedSpecValues.filter(spec => spec.value !== null )
  //       const res = await executionService.getSpecs(filteredRequestedSpecValues)
  //       if (res !== undefined) return {title: title ?? "",type:"product_lookup_by_specs",text:null,data:res}
  //     }
  //   }
  //   return {title: title ?? "",type: "other", text: "Something went wrong",data:null}
  // }

  // async function generateRespone(userPrompt:z.infer<typeof RequestMessageSchema>): Promise<z.infer<typeof AssistantMessageContentSchema>> {
  //   try {
  //     const intent = await determineIntent(userPrompt)
  //     const executionResult = await executeIntent(intent)

  //     return executionResult      
  //   } catch (error) {
  //     console.log("ERROR IN chat.service: ",error)
  //     throw error
  //   }
  // }

  async function generateRespone() {
    
  }
  return{
    generateRespone
  }
}

export type ChatServices = ReturnType<typeof buildChatServices>

// export default fp(buildChatServices)

