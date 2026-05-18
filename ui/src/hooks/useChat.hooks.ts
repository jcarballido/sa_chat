import { useState } from "react"
import { useMessageStore } from "../stores/message.store"
import { messageService } from "../services/message.services"
import { AssistantMessageSchema, LLMResponseSchema, type AssistantMessageType, type NewUserMessageType, type UserMessageType } from "../types/message.schema"
// import { useAuthStore } from "../stores/auth.store"

export const useChat = () => {
  const [ isLoading, setIsLoading ] = useState(false)
  const messageStore = useMessageStore()
  const { activeConversationId, addMessage, conversations } = messageStore
  // const session = useAuthStore(s => s.session)

  const title = activeConversationId ? conversations.filter(conv => conv.conversationId === activeConversationId)[0].title : null

  const sendUserMessage = async(input: string) => {

    const newUserMessage = ( newUserMessage:string ): NewUserMessageType => ({
      conversation: {
        title,
        conversationId: activeConversationId,
        newMessage:{
          role:"user",
          content: newUserMessage,
          status:"sending", 
        }
      }
    })

    const userMessage = newUserMessage(input)

    try {
      // addMessage(userMessage)
      const response = await messageService.send(userMessage)
      // response: original message WITH id assigned + llm response
      // const result: AssistantMessageType = AssistantMessageSchema.parse(response)
      // addMessage(result)

      const result = LLMResponseSchema.parse(response)
      return result.conversation
    } catch (error) {

      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }
  
  return { sendUserMessage, isLoading }
  
}