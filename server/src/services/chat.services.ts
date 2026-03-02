import fastify from "fastify"
import type { LLMcall } from "../infrastructure/buildLlmCall.js"
import type { MessageStore } from "../infrastructure/buildMessageStore.js"
import type { CsvQuery } from "../infrastructure/buildStore.js"

export function buildChatService(inventoryStore: CsvQuery, specificationStore:CsvQuery, llm: LLMcall, messageStore: MessageStore){

  async function processMessage(prompt: string){
      
    // Classify intent: focused, adjacent, out_of_scope, malicious
    const classification = await llm.classification(prompt)
    const parsedClassification: {"intent": "malicious"|"out_of_scope"|"adjacent"|"focused"} = JSON.parse(classification)
    const { intent } = parsedClassification
    switch(intent){
      case "malicious":
        console.log("---")
        console.log("MALICIOUS")
        console.log("---")

        return {message: "I cannot execute this task. Is there anything about our safes I can help you determine?"}
      case "out_of_scope":
        console.log("---")
        console.log("Out of Scope")
        console.log("---")
        return {message: "This is outside the scope of my abilities. Is there anything about our safes I can help you determine?"}
      case "adjacent":
        console.log("---")
        console.log("ADJACENT PROMPT")
        console.log("---")

      const response = await llm.generalChat(prompt)
        return {response}
      case "focused":
        console.log("---")
        console.log("FOCUSED PROMPT")
        console.log("---")

        const objectives = await llm.extractObjectives(prompt)
        // console.log("---")
        // console.log("Raw extracted Model:")
        // console.log(objectives)
        // console.log("---")
        return {message: objectives}
    }
            // Branch            
            // Store new message
            // const extractModel = await llm.extractModel(prompt)
            // Build prompt with chat history
    // Get domain knowledge
    // Store response
    // Return response
    
    // return{
    // }
  }

  return{
    processMessage
  }
}