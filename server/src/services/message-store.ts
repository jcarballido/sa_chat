import type { Message } from "../types/types.js"

export const createMessageStorage = () => {

  const initialMessage: Message = {
    role:"SYSTEM",
    content:"You are a customer service representative assistant who can traverse documents and return the most accurate response to a rep's question."
  }

  let messages:Message[] = [initialMessage]

  return {
    getMessages: () => messages,
    addMessage: (newMessage: Message) => messages.push(newMessage),
    clearMessages: () => messages = [initialMessage]    
  }
}