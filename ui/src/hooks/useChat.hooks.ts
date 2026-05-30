import { useConversationStore } from "../stores/conversation.store"
import { messageService } from "../services/message.services"
import { type NewUserMessageType } from "../types/message.schema"

export const useChat = () => {
  const conversationStore = useConversationStore()
  const { activeConversation, setActiveConversation, addUserMessage, updateUserMessageID, addToStoredConversation } = conversationStore

  const sendUserMessage = async(input: string) => {
    const createNewUserMessage = ( newUserMessage:string ): NewUserMessageType => ({
      title: activeConversation.title,
      conversationId: activeConversation.conversationId.storage ? activeConversation.conversationId.storage : `temp_${Math.floor(Math.random()*1000000) + 1}`,
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
    
    addUserMessage(userMessage.newMessage)

    try {
      const response = await messageService.send(userMessage)
      console.log("RESPONSE RECEIVED:")
      console.log(response)
      const { data } = response 
      const { conversationId, responseMessage } = data
      console.log("CONV ID")
      console.log(conversationId)
      console.log("RESPONSE MESSAGE")
      console.log(responseMessage)
      const [assistantMessage] = responseMessage.filter(rsp => rsp.role === "assistant")
      console.log("ASST MSG")
      console.log(assistantMessage)
      //updateStoredConversation
      addToStoredConversation({conversationId:{
        temp:userMessage.conversationId as string,
        storage: conversationId
        }, 
        title:assistantMessage.content.title
      },)
      // const { messages } = responseMessage
      const [originalUserMessage] = responseMessage.filter(mes => mes.role === "user")
      const storedId = originalUserMessage.id.storage!
      updateUserMessageID(originalUserMessage.id.temp, storedId)
    } catch (error) {
      console.error(error)
    }
  }
  
  return { sendUserMessage }
  
}