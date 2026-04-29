import { ApiResponseSchema } from "../types/api.schema";
import { type UserMessageType, type AssistantMessageType, AssistantMessageSchema } from "../types/message.schema";

async function send (userMessage: UserMessageType ): Promise<AssistantMessageType> {
  
  try {
    const res = await fetch('api/chat/process', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userMessage) 
    })

    const raw = await res.json()
    console.log("RAW RESPONSE:")
    console.log(raw)

    const result = ApiResponseSchema(AssistantMessageSchema).safeParse(raw)
    
    if(!result.success){
      console.error("API Contract Violated:", result.error.issues)
      throw new Error("Unexpected result error.")
    }
    const {status, data, error} = result.data
    if(status === "error"){
      console.error("SERVER RETURNED AN ERROR: ", error.message)
      throw new Error(error.code)
    }

    return data
  
  } catch (error) {
    console.log("Error thrown: ", error)
    throw error
  }
}

export const messageService = {
  send
}

