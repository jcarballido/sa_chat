import { useState } from "react"
import { useMessageStore } from "../stores/message.store"
import { messageService } from "../services/message.services"
import { AssistantMessageSchema, type AssistantMessageType, type UserMessageType } from "../types/message.schema"

export const useChat = () => {
  const [ isLoading, setIsLoading ] = useState(false)
  const messageStore = useMessageStore()
  const { activeConversationId, addMessage, conversations } = messageStore

  const title = activeConversationId ? conversations.filter(conv => conv.conversationId === activeConversationId)[0].title : null

  const sendUserMessage = async(input: string) => {

    const createNewMessage = (newUserMessage:string, activeConversationId: string | null): UserMessageType => ({
      id:`${Math.random()}`,
      conversationId: activeConversationId ?? `${Math.random()}`,
      title: title,
      role:"user",
      content: newUserMessage,
      createdAt:new Date().toISOString(),
      status:"sending",
    })

    const userMessage = createNewMessage(input, activeConversationId)

    try {
      addMessage(userMessage)
      const assistantMessage = await messageService.send(userMessage)
      console.log("ASSISTANT MESSAGE: ", assistantMessage)
      const result: AssistantMessageType = AssistantMessageSchema.parse(assistantMessage)
      addMessage(result)
    } catch (error) {

      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }
  
  return { sendUserMessage, isLoading }
  
}