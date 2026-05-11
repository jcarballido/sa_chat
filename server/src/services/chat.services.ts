import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "../constants/constants.js"
import type { InventoryQueryType } from "../queries/inventoryQuery.queries.js"
import type { SpecQueryType } from "../queries/specQuery.queries.js"
import type { AgentInvokerType } from "../types/agentInvoker.types.js"
import { SpecRowSchema } from "../types/stores.types.js"
import type { ExtractedSpecMapType, ExtractedSpecType } from "../types/llmResponse.types.js"
import type { DomainExecutionType } from "./domainExecution.services.js"
import type { AssistantMessageContentSchema, RequestMessageSchema } from "../types/api.types.js"
import type { QueriesType } from "../db/queries.js"

export function buildChatServices(inventoryQuery: InventoryQueryType, specQuery: SpecQueryType, agentInvoker: AgentInvokerType, domainExecution: DomainExecutionType, queries: QueriesType){

  async function determineIntent(message: z.infer<typeof RequestMessageSchema>) {
    const { conversationId,title, content } = message
    const inventoryModels = inventoryQuery.getColumnValues("model")
    return await agentInvoker.invoke(content,inventoryModels,{title: title ?? null,conversationId} )
  }
  
  async function executeIntent(agentState:State): Promise<z.infer<typeof AssistantMessageContentSchema>>  {

    const {initialMessageClassification, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, filteredMatches, title} = agentState

    if(initialMessageClassification === "malicious") {
      const number = Math.floor(Math.random() * ((MALICIOUS_INTENT_RESPONSES.length - 1)));
      return {title: title ?? "",type:"malicious",text:MALICIOUS_INTENT_RESPONSES[number] ?? "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere.",data:null}
    }

    if(initialMessageClassification === "out_of_scope"){
      const number = Math.floor(Math.random() * (OUT_OF_SCOPE_RESPONSES.length - 1));
      return {title: title ?? "",type:"out_of_scope",text:MALICIOUS_INTENT_RESPONSES[number] ?? "That\’s outside my lane, I\’m here for more specific tasks.",data:null}
    }

    if(relatedIntent) return {title: title ?? "",type:"related", text: relatedIntentLLMResponse ,data:null}

    if(focusedIntent){
      console.log("Focused Intent Classification: ", focusedIntentClassification)
      if(focusedIntentClassification == "similar_products"){
        const res = domainExecution.getSimilarModelsByModel("any",filteredMatches)
        return {title: title ?? "",type:"similar_products", text: null,data: res}  
      }

      if(focusedIntentClassification == "product_comparison"){
        if(filteredMatches.length < 2) return {title: title ?? "",type: "other", text:  "At least 2 model numbers required.",data:null}
        const allSpecs = filteredMatches.map( match => {
          const specs = specQuery.getRowsWhere("model",match)
          return specs[0]
        })
        const filteredSpecs = allSpecs.filter(spec => spec != undefined)
        if(filteredSpecs.length < 2) return {title: title ?? "",type: "other", text:"Could not locate specs for all model numbers to compare",data:null}
        return {title: title ?? "",type: "product_comparison", text: null,data:filteredSpecs}
      }
      
      if(focusedIntentClassification == "product_lookup_by_model"){
        const allSpecs = filteredMatches.map( match => {
          const specs = specQuery.getRowsWhere("model",match)
          return specs[0]
        })
        const filteredSpecs = allSpecs.filter(spec => spec != undefined)
        return {title: title ?? "",type: "product_comparison", text: null,data:filteredSpecs}
      }

      if (focusedIntentClassification == "product_lookup_by_specs"){
        // {
        //   "specValues": [
        //      { "category": "fire_rating_temp", "value": ["1200","Infinity"] }
        //   ]
        // }
        // {
        //   "specValues": [
        //     { "category": "gun_count", "value": ["0","20"] },
        //     { "category": "waterproof", "value": ["true"] },
        //     { "category": "fire_rating_temp", "value": ["1400"] }
        //   ]
        // }
        const returnedSpecValues: ExtractedSpecType = agentState.focusedIntentSpecValuesExtracted.specValues
        const filteredExtractedSpecValues = returnedSpecValues.filter((spec):spec is typeof spec & { value: string[] } => spec.value !== null)
        const typedSpecValues = filteredExtractedSpecValues.map(spec => ({
          category: spec.category,
          value: spec.value?.map( val => SpecRowSchema.shape[spec.category].parse(val))
        })) as ExtractedSpecMapType
        // const convertedSpecValues = returnedSpecValues.map( spec => {
        //   const test = transformSpecs(spec)
        //   return test
        // }) as TransformedSpec[]
        // const filteredRequestedSpecValues = typedSpecValues.filter(spec => spec.value !== null )
        const res = domainExecution.getModelsBySpecs("any",typedSpecValues)
        if (res !== undefined) return {title: title ?? "",type:"product_lookup_by_specs",text:null,data:res}
      }
    }
    return {title: title ?? "",type: "other", text: "Something went wrong",data:null}
  }

  async function generateRespone(userMessage:z.infer<typeof RequestMessageSchema>): Promise<z.infer<typeof AssistantMessageContentSchema>> {
    try {
      const intent = await determineIntent(userMessage)
      const executionResult = await executeIntent(intent)
      console.log("EXECUTION RESULT:")
      console.log(executionResult)
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

export type ChatServices = ReturnType<typeof buildChatServices>