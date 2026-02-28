import fastify from "fastify"
import type { LLMcall } from "../infrastructure/buildLlmCall.js"
import type { MessageStore } from "../infrastructure/buildMessageStore.js"
import type { CsvQuery } from "../infrastructure/buildStore.js"

export function buildChatService(inventoryStore: CsvQuery, specificationStore:CsvQuery, llm: LLMcall, messageStore: MessageStore){

  async function processMessage(prompt: string){
      
    // Classify intent: focused, adjacent, out_of_scope, malicious
    const classification = await llm.classificationLLM(prompt)
    // Branch
    const { intent, objectives } = classification

    switch(intent){
      case "malicious":
        // return message: "Not allowed to continue with request."
        //break
      case "out_of_scope":
        // return message: "This is outside the scope of my abilities. Is there anything about our safes I can help you determine?"
        //break
      case "adjacent":
        // answer the question but do not store any messages witht this classification
        // break
      case "focused":
        // answer the question and store the data
    }
    // Store new message
    // Build prompt with chat history
    // Get domain knowledge
    // Store response
    // Return response
    
    return{
      response
    }
  }

  return{
    processMessage
  }
}