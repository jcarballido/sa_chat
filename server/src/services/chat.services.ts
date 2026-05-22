// import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "../constants/constants.js"
import type { InventoryQueryType } from "../queries/inventoryQuery.queries.js"
import type { SpecQueryType } from "../queries/specQuery.queries.js"
import type { AgentInvokerType } from "../types/agentInvoker.types.js"
import { SpecRowSchema } from "../types/stores.types.js"
import type { ExtractedSpecMapType, ExtractedSpecType } from "../types/llmResponse.types.js"
import type { DomainExecutionType } from "./domainExecution.services.js"
import type { LLMResponseType, IncomingMessageType, RequestMessageSchema, OutgoingMessageType, UserMessageType } from "../types/api.types.js"
import type { QueriesType } from "../db/queries.js"
import { llmResponses } from "../llmResponses.js"
import type { InsertMessage, SelectMessage } from "../db/schema/messages.schema.js"

export function buildChatServices(inventoryQuery: InventoryQueryType, specQuery: SpecQueryType, agentInvoker: AgentInvokerType, domainExecution: DomainExecutionType, queries: QueriesType){

  async function determineIntent(message: SelectMessage, title: string | undefined) {
    const content = message.content
    const inventoryModels = inventoryQuery.getColumnValues("model") //Change to a stored value instead of calling it everytime a message comes in
    return await agentInvoker.invoke( content, inventoryModels, title )
  }
  
  async function executeIntent(agentState:State): Promise<LLMResponseType>  {

    const {initialMessageClassification, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, filteredMatches, title} = agentState

    if(initialMessageClassification === "malicious" || initialMessageClassification === "out_of_scope") {
      return llmResponses.reject(initialMessageClassification,title)
      // const number = Math.floor(Math.random() * ((MALICIOUS_INTENT_RESPONSES.length - 1)));
      // return {title: title ?? "",type:"malicious",text:MALICIOUS_INTENT_RESPONSES[number] ?? "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere.",data:null}
    }

    if(relatedIntent){
      return llmResponses.related(relatedIntentLLMResponse,title)
    }

    // if(initialMessageClassification === "out_of_scope"){
    //   return llmResponses.reject(initialMessageClassification,title)
      // const number = Math.floor(Math.random() * (OUT_OF_SCOPE_RESPONSES.length - 1));
      // return {title: title ?? "",type:"out_of_scope",text:MALICIOUS_INTENT_RESPONSES[number] ?? "That\’s outside my lane, I\’m here for more specific tasks.",data:null}
    // }

    // if(relatedIntent) return {title: title ?? "",type:"related", text: relatedIntentLLMResponse ,data:null}

    if(focusedIntent){
      if(focusedIntentClassification == "similar_products"){
        const res = domainExecution.getSimilarModelsByModel("any",filteredMatches)
        return llmResponses.similarProducts(res, title)
        // return {title: title ?? "",type:"similar_products", text: null,data: res}  
      }

      if(focusedIntentClassification == "product_comparison"){
        if(filteredMatches.length < 2) {
          // return llmResponses.productComparison(filteredSpecs, title, text:"At least 2 models required for comparison.")
          return {title: title ?? "",type: "other", text:  "At least 2 model numbers required.",data:null}
        }

        const allSpecs = filteredMatches.map( match => {
          const specs = specQuery.getRowsWhere("model",match)
          return specs[0]
        })
        const filteredSpecs = allSpecs.filter(spec => spec != undefined)
        if(filteredSpecs.length < 2) return {title: title ?? "",type: "other", text:"Could not locate specs for all model numbers to compare",data:null}
        return llmResponses.productComparison(filteredSpecs, title)
        // return {title: title ?? "",type: "product_comparison", text: null,data:filteredSpecs}
      }
      
      if(focusedIntentClassification == "product_lookup_by_model"){
        const allSpecs = filteredMatches.map( match => {
          const specs = specQuery.getRowsWhere("model",match)
          return specs[0]
        })
        const filteredSpecs = allSpecs.filter(spec => spec != undefined)
        return llmResponses.productLookupByModel(filteredSpecs,title )
        return {title: title ?? "",type: "product_comparison", text: null,data:filteredSpecs}
      }

      if (focusedIntentClassification == "product_lookup_by_specs"){

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
        return llmResponses.productLookupBySpecs(res,title)

        // if (res !== undefined) return {title: title ?? "",type:"product_lookup_by_specs",text:null,data:res}
      }
    }
    
    // return {title: title ?? "",type: "other", text: "Something went wrong",data:null}
    return llmResponses.reject("other", title)
  }

  async function processIncomingMessage(incomingMessage: IncomingMessageType, userId:{sub: string}): Promise<OutgoingMessageType> {
    // Convert incoming message to an agentPayload
    /*
export const messages = table("messages",{
  id: serial().primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull(),
  role: text({ enum:["user","assistant"] }).notNull(),
  content: text()
})

addMessage: (newMessage: {
    role: "user" | "assistant";
    content: string;
    conversationId: number;
    id?: number | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;

    */
    const {title, conversationId, newMessage} = incomingMessage 

    // 1. Cast conversation id to stored conversation ID
    const assignConversationId = async(conversationId: string | number) => {
      if(typeof conversationId === "string"){
        try {
          const [ result ] = await queries.createConversation(userId.sub)
          if(!result?.newConversationId) throw new Error("A new conversation could not be created.")
          return result?.newConversationId!
        } catch (error) {
          console.log("ERROR CREATING NEW CONVERSATION:")
          console.log(error)
          throw error        
        }
      }else{
        return conversationId
      }
    }  
    const storedConversationId = await assignConversationId(conversationId)

    // 2. Cast message to InsertMessage type
    const toInsertUserMessage = (rawMessage: IncomingMessageType["newMessage"], conversationId: number): InsertMessage & {role: "user"} => {
      return {
        conversationId,
        role:"user",
        content: rawMessage.content
      }
    }

    const insertUserMessage = toInsertUserMessage(newMessage, storedConversationId) 

    // 3. Add message to the conversation by conv. id 
    const [ storedMessage ] = await queries.addMessage(insertUserMessage)
    if(!storedMessage) throw new Error("Error adding user message.")
      
    // 4. Pass resulting message to intent agent
    try {
      const intent = await determineIntent(storedMessage, title)
      const result   = await executeIntent(intent)

      // 5. Convert result to outgoing message, being returned to chat.controller.processMessage
      // CHORE: Establish conversion function "toOutgoingMessage()"
      // console.log("EXECUTION RESULT:")
      // console.log(executionResult)
      // return {agentResponse: executionResult, conversationId: conversationId!}
      const toOutgoingMessage = (result) => {

      }
      // return {
      //   title:,
      //   conversationId,
      //   newMessage:[]
      // }    


    } catch (error) {
      console.log("ERROR IN chat.service: ",error)
      throw error
    }
  }

  return{
    processIncomingMessage
  }
}

export type ChatServices = ReturnType<typeof buildChatServices>