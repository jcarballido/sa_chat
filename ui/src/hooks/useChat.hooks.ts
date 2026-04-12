import { useState } from "react"
import { useMessageStore } from "../stores/message.store"
import { messageService } from "../services/message.services"
import type { UserMessageType } from "../types/message.schema"

export const useChat = () => {
  const [ isLoading, setIsLoading ] = useState(false)
  const messageStore = useMessageStore()
  const { activeConversationId, addMessage } = messageStore

  const sendUserMessage = async(input: string) => {

    const createNewMessage = (newUserMessage:string, activeConversationId: string | null): UserMessageType => ({
      id:`${Math.random()}`,
      conversationId: activeConversationId ?? `${Math.random()}`,
      role:"user",
      content: newUserMessage,
      createdAt:new Date().toISOString(),
      status:"sending",
    })

    const userMessage = createNewMessage(input, activeConversationId)
    console.log("USER MESSAGE CREATED WITH CONVO ID: ", userMessage.conversationId)
    console.log("ACTIVE CONVO ID IN STATE: ", activeConversationId)

    try {
      addMessage(userMessage)
      const assistantMessage = await messageService.send(userMessage)
      addMessage(assistantMessage)
    } catch (error) {
      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }
  
  return { sendUserMessage, isLoading }
  
}