import { api } from "../api/apiClient";
import { type NewUserMessageType, ResponseMessageSchema } from "../types/message.schema";

async function send (userMessage: NewUserMessageType ) {  
  try {
    const response = await api.post("/chat/process", ResponseMessageSchema, userMessage)
    if(response.error) {
      const {code,message} = response.error
      throw new Error(`${code}: ${message}`)
    }
    
    return response

  } catch (error) {
    console.log("Error in message.service:send")
    throw error
  }
}

export const messageService = {
  send
}

