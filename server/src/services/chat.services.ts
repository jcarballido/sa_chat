// import type z from "zod"
import type { State } from "../agents/intentAgentState.js"
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "../constants/constants.js"
import type { InventoryQueryType } from "../queries/inventoryQuery.queries.js"
import type { SpecQueryType } from "../queries/specQuery.queries.js"
import type { AgentInvokerType } from "../types/agentInvoker.types.js"
import { SpecRowSchema } from "../types/stores.types.js"
import type { ExtractedSpecMapType, ExtractedSpecType } from "../types/llmResponse.types.js"
import type { DomainExecutionType } from "./domainExecution.services.js"
import type { LLMResponseType, IncomingMessageType, RequestMessageSchema, OutgoingMessageType, UserMessageType, AssistantMessageType } from "../types/api.types.js"
import type { QueriesType } from "../db/queries.js"
import { llmResponses } from "../llmResponses.js"
import type { InsertMessage, SelectMessage } from "../db/schema/messages.schema.js"
import type { SelectConversation } from "../db/schema/conversations.schema.js"

export function buildChatServices(inventoryQuery: InventoryQueryType, specQuery: SpecQueryType, agentInvoker: AgentInvokerType, domainExecution: DomainExecutionType, queries: QueriesType) {

  async function determineIntent(message: SelectMessage, title: string | undefined) {
    const content = message.content
    const inventoryModels = inventoryQuery.normalizedModelNumbers //Change to a stored value instead of calling it everytime a message comes in
    return await agentInvoker.invoke(content, inventoryModels, title)
  }

  async function executeIntent(agentState: State): Promise<LLMResponseType> {

    const { initialMessageClassification, relatedIntent, relatedIntentLLMResponse, focusedIntent, focusedIntentClassification, filteredMatches, title } = agentState

    if (initialMessageClassification === "malicious" || initialMessageClassification === "out_of_scope") {
      return llmResponses.reject(initialMessageClassification, title)
    }

    if (relatedIntent) {
      return llmResponses.related(relatedIntentLLMResponse, title)
    }

    if (focusedIntent) {
      if (focusedIntentClassification == "similar_products") {
        const res = domainExecution.getSimilarModelsByModel("any", filteredMatches)
        console.log("RESPONSE FROM DOMAIN EXECUTION:")
        console.log(res)
        const convertRes: typeof res = res.map(r => {
          const [k] = (Object.keys(r) as string[])
          const val = r[k!]
          const productionModelNumber = specQuery.getProductionModelNumber(k!)
          return {
            [productionModelNumber!]: [...val!]
          }
        })
        console.log("CONVERTED RES:")
        console.log(convertRes) 
        return llmResponses.similarProducts(res, title)
      }

      if (focusedIntentClassification == "product_comparison") {
        if (filteredMatches.length < 2) {
          return { title: title ?? "", type: "other", text: "At least 2 model numbers required.", data: null }
        }

        const allSpecs = filteredMatches.map(match => {
          console.log("MODEL MATCHED: ")
          console.log(match)
          const productionModelNumber = inventoryQuery.getProductionModelNumber(match)
          const [specs] = specQuery.getRowsWhere("model", productionModelNumber!)
          return specs
        })

        const filteredSpecs = allSpecs.filter(spec => spec != undefined)
        if (filteredSpecs.length < 2) return { title: title ?? "", type: "other", text: "Could not locate specs for all model numbers to compare", data: null }
        console.log("FILTERED SPECS:")
        console.log(filteredSpecs)
        // const convertedFilteredSpecs = filteredSpecs.map(fSpecs => {
        //   const productionModelNumber = specQuery.getProductionModelNumber(fSpecs.model)
        //   return {
        //     ...fSpecs,
        //     model: productionModelNumber!
        //   }
        // })
        return llmResponses.productComparison(filteredSpecs, title)
      }

      if (focusedIntentClassification == "product_lookup_by_model") {
        const allSpecs = filteredMatches.map(match => {
          console.log("MODEL MATCHED: ")
          console.log(match)
          const productionModelNumber = inventoryQuery.getProductionModelNumber(match)
          const specs = specQuery.getRowsWhere("model", productionModelNumber!)
          return specs[0]
        })
        const filteredSpecs = allSpecs.filter(spec => spec != undefined)
        console.log("FILTERED SPECS:")
        console.log(filteredSpecs)
        // const convertedFilteredSpecs = filteredSpecs.map(fSpecs => {
        //   const productionModelNumber = specQuery.getProductionModelNumber(fSpecs.model)
        //   return {
        //     ...fSpecs,
        //     model: productionModelNumber!
        //   }
        // })
        // console.log("CONVERTED FILTERED SPECS:")
        // console.log(convertedFilteredSpecs)
        return llmResponses.productLookupByModel(filteredSpecs, title)
      }

      if (focusedIntentClassification == "product_lookup_by_specs") {

        const returnedSpecValues: ExtractedSpecType = agentState.focusedIntentSpecValuesExtracted.specValues
        const filteredExtractedSpecValues = returnedSpecValues.filter((spec): spec is typeof spec & { value: string[] } => spec.value !== null)
        const typedSpecValues = filteredExtractedSpecValues.map(spec => ({
          category: spec.category,
          value: spec.value?.map(val => SpecRowSchema.shape[spec.category].parse(val))
        })) as ExtractedSpecMapType
        const res = domainExecution.getModelsBySpecs("any", typedSpecValues)
        // const convertedFilteredSpecs = res.map(fSpecs => {
        //   const productionModelNumber = specQuery.getProductionModelNumber(fSpecs.model)
        //   console.log("CHAT.SERVICE")
        //   console.log("PRODUCTION MODEL FOUND: ")
        //   console.log(productionModelNumber)
        //   return {
        //     ...fSpecs,
        //     model: productionModelNumber!
        //   }
        // })
        return llmResponses.productLookupBySpecs(res, title)
      }
    }
    return llmResponses.reject("other", title)
  }

  async function processIncomingMessage(incomingMessage: IncomingMessageType, userId: { sub: string }): Promise<OutgoingMessageType> {

    console.log("INCOMING MESSAGE at chat service:")
    console.log(incomingMessage)

    const { title, conversationId, newMessage } = incomingMessage

    // 1. Cast conversation id to stored conversation ID
    const assignConversationId = async (conversationId: string | number) => {
      if (typeof conversationId === "string") {
        try {
          const [result] = await queries.createConversation(userId.sub, conversationId)
          if (!result?.newConversationId) throw new Error("A new conversation could not be created.")
          return result?.newConversationId!
        } catch (error) {
          console.log("ERROR CREATING NEW CONVERSATION:")
          console.log(error)
          throw error
        }
      } else {
        return conversationId
      }
    }
    const storedConversationId = await assignConversationId(conversationId)

    // 2. Cast message to InsertMessage type
    const toInsertUserMessage = (rawMessage: IncomingMessageType["newMessage"], conversationId: number): InsertMessage & { role: "user" } => {
      return {
        conversationId,
        tempId: rawMessage.id.temp,
        role: "user",
        content: rawMessage.content,

      }
    }

    const insertUserMessage = toInsertUserMessage(newMessage, storedConversationId)

    // 3. Add message to the conversation by conv. id 
    const [storedUserMessage] = await queries.addMessage(insertUserMessage)
    if (!storedUserMessage) throw new Error("Error adding user message.")

    // 4. Pass resulting message to intent agent
    try {
      const intent = await determineIntent(storedUserMessage, title)
      const result = await executeIntent(intent)
      console.log("AGENT RESULT AFTER EXECUTION:")
      console.log(result)
      const toInsertAssistantMessage = (agentResponse: LLMResponseType, storedConversationId: number): InsertMessage & { role: "assistant" } => {
        return {
          conversationId: storedConversationId,
          role: "assistant",
          content: JSON.stringify(agentResponse),
          tempId: null
        }
      }
      // Update conversation to include title:
      await queries.assignConversationTitle(result.title!, storedConversationId)
      // 5. Store assistant message
      const insertAssistantMessage = toInsertAssistantMessage(result, storedConversationId)
      const [storedAssistantMessage] = await queries.addMessage(insertAssistantMessage)
      if (!storedAssistantMessage) throw new Error("Error adding assistant message.")

      // 6. Convert result to outgoing message, being returned to chat.controller.processMessage
      const toOutgoingMessage = (storedAssistantMessage: SelectMessage): OutgoingMessageType => {
        console.log("STORED ASSISTANT MESSAGE")
        console.log(JSON.parse(storedAssistantMessage.content))

        const assistantMessage: AssistantMessageType = {
          role: "assistant",
          id: storedAssistantMessage.id,
          content: JSON.parse(storedAssistantMessage.content)
        }

        return {
          title: result.title!,
          conversationId: storedConversationId,
          responseMessage: [
            { ...newMessage, id: { ...newMessage.id, storage: storedUserMessage.id } },
            assistantMessage
          ]
        }
      }

      return toOutgoingMessage(storedAssistantMessage)
    } catch (error) {
      console.log("ERROR IN chat.service: ", error)
      throw error
    }
  }

  async function getStoredConversationMetadata() {
    const storedConversationMetadata = await queries.getConversationMetadata()
    return storedConversationMetadata
  }

  async function getStoredConversation(id: SelectConversation["id"]) {
    const [storedConversation] = await queries.getStoredConversation(id)
    const storedConversationMessages = await queries.getStoredMessages(id)

    return { conversation: storedConversation, messages: storedConversationMessages }
  }

  return {
    processIncomingMessage,
    getStoredConversationMetadata,
    getStoredConversation,
  }
}

export type ChatServices = ReturnType<typeof buildChatServices>