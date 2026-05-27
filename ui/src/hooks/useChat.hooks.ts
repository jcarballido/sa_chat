// import { useState } from "react"
import { useMessageStore } from "../stores/message.store"
import { messageService } from "../services/message.services"
import { type NewUserMessageType } from "../types/message.schema"
// import { number } from "zod"

export const useChat = () => {
  // const [ isLoading ] = useState(false)
  const messageStore = useMessageStore()
  const { activeConversationId, activeTitle, setActiveConversationID, addUserMessage } = messageStore

  const title = activeTitle

  const sendUserMessage = async(input: string) => {
    const createNewUserMessage = ( newUserMessage:string ): NewUserMessageType => ({
      title,
      conversationId: typeof(activeConversationId) === "number" ? activeConversationId : `temp_${Math.floor(Math.random()*1000000) + 1}`,
      newMessage:{
        role:"user",
        content: newUserMessage,
        id:{
          temp:`temp_${Math.floor(Math.random()*1000000) + 1}`,
          storage: undefined
        }
      }
    })
    
    const userMessage = createNewUserMessage(input)

    if(activeConversationId === null){
      setActiveConversationID(userMessage.conversationId)
    }
    
    addUserMessage(userMessage.newMessage.content)

    try {
      const response = await messageService.send(userMessage)
      console.log("RESPONSE RECEIVED:")
      console.log(response)
      const { data } = response 
      const { conversationId, responseMessage } = data
      // const { messages } = responseMessage
      const [originalUserMessage] = responseMessage.filter(mes => mes.role === "user")
      const storedId = originalUserMessage.id.storage!
      updateConversation(conversationId, {originalUserMessageIDs:{temp: originalUserMessage.id.temp, storage: originalUserMessage.id.storage}})
      // addMessage(result)
    } catch (error) {
      console.error(error)
    }
  }
  
  return { sendUserMessage }
  
}