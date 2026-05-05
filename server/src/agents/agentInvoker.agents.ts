import type { AgentInvokerType } from "../types/agentInvoker.types.js";
import type { IntentAgentType } from "./intentAgent.js"

export async function buildAgentInvoker(agent: IntentAgentType): Promise<AgentInvokerType> {

  async function invoke(message: string, title: string, inventoriedModelNumbers: string[]) {

    console.log("---BUILD LLM CALL---")
    console.log(typeof(message))
    console.log(message)

    // function sanitizeUserPrompt(originalString: string): string{
    //   const targetRegex =  /[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*/g;
    //   const updatedString = originalString.toUpperCase().replace(targetRegex, (match) => {
    //     return match.replace(/-/g,"")
    //   })
    //   return updatedString
    // } 

    
    // const sanitizedInputMessage = sanitizeUserPrompt(message)
    // console.log("SANITIZED INPUT")
    // console.log(sanitizedInputMessage)
      // const parsed = JSON.parse(message)
      // console.log("JSON PARSED MESSAGE:")
      // console.log(typeof(parsed))
      // console.log(parsed)      
      // const validatedResult = RequestMessageSchema.safeParse(parsed)
      // if(validatedResult.error){
      //   console.log("Validation error:")
      //   console.log(validatedResult.error)
      //   throw new Error("Error validating sanitized user message")
  
      // }
      // const data = validatedResult.data
      // const title = data.title ?? null
  const response = await agent.invoke({
    title,
    initialMessage: message,
    inventoryStore: inventoriedModelNumbers
  })
  return response
  }  

  return {
    invoke,
  }
}