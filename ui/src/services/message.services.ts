import { api } from "../api/apiClient";
import { type AssistantMessageType, AssistantMessageSchema, type NewUserMessageType, ResponseMessageSchema } from "../types/message.schema";

async function send (userMessage: NewUserMessageType ) {  
  try {
    const response = api.post("/chat/process", ResponseMessageSchema, userMessage)
    
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

