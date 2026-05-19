import { api } from "../api/apiClient";
import { type AssistantMessageType, AssistantMessageSchema, type NewUserMessageType } from "../types/message.schema";

async function send (userMessage: NewUserMessageType ): Promise<AssistantMessageType> {  
  try {
    const response = api.post("/chat/process", AssistantMessageSchema, userMessage)
    
    return response

  } catch (error) {
    console.log("Error in message.service:send")
    console.log(JSON.stringify(error))
    
    throw error
  }
}

export const messageService = {
  send
}

