import { useState } from "react"
import { useMessageStore } from "../stores/message.store"
import { messageService } from "../services/message.services"
import { AssistantMessageSchema, ResponseMessageSchema, type AssistantMessageType, type NewUserMessageType, type UserMessageType } from "../types/message.schema"
// import { useAuthStore } from "../stores/auth.store"

export const useChat = () => {
  const [ isLoading, setIsLoading ] = useState(false)
  const messageStore = useMessageStore()
  const { activeConversationId, addMessage, conversations } = messageStore
  // const session = useAuthStore(s => s.session)

  const title = activeConversationId ? conversations.filter(conv => conv.conversationId === activeConversationId)[0].title : null

  const sendUserMessage = async(input: string) => {

    const newUserMessage = ( newUserMessage:string ): NewUserMessageType => ({
        title,
        conversationId: activeConversationId ?? `temp_${Math.floor(Math.random()*1000000) + 1}`,
        newMessage:{
          role:"user",
          content: newUserMessage,
          id:{
            temp:`temp_${Math.floor(Math.random()*1000000) + 1}`,
            storage: undefined
          }
        }
    })

    const userMessage = newUserMessage(input)

    try {
      // addMessage(userMessage)
      const response = await messageService.send(userMessage)
      console.log("RESPONSE RECEIVED:")
      console.log(response)
      // response: original message WITH id assigned + llm response
      // const result: AssistantMessageType = AssistantMessageSchema.parse(response)
      // addMessage(result)

      const result = ResponseMessageSchema.parse(response)
      if(result.status === "error") throw new Error(`${result.error.code}: ${result.error.message}`)
      return result
    } catch (error) {
      console.log("ERROR sending and parsing response from backend.")
      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }
  
  return { sendUserMessage, isLoading }
  
}