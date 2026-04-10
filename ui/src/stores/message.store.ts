import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { MessageType } from "../types/message.schema"
import type { ConversationType } from "../types/conversation.schema"

type State = {
  conversations: ConversationType[]
  activeConversationId: string|null,
}

type Action = {
  addMessage:(message: MessageType,options?:{conversationId?: string}) => void,
  setActiveConversation:(conversationId: string)=> void
}

const createConversation = (initialMessage: MessageType) => {
  const conversation = {
    conversationId:`${Math.random()}`,
    createdAt:new Date().toISOString(),
    updatedAt:null,
    messages:[initialMessage],
    title:"Test Title"
  }
  return conversation
}

export const useMessageStore = create<State & Action>()(
  persist(
    (set,get) => ({
      conversations: [],
      activeConversationId: null,
      addMessage:(message:MessageType) => {
        // Able to add a message anytime, a conversation gets created if non existent
        const { activeConversationId } = get()
        if(activeConversationId){
          set((state) => ({
            conversations: state.conversations.map( conv => {
              return conv.conversationId === message.conversationId
              ? {...conv,messages: [...conv.messages,message]}
              : conv
            })
          }))
        }
        const newConversation = createConversation(message)
        set((state) => ({
          conversations: [...state.conversations,newConversation]
        }))
      },
      setActiveConversation:(activeConversationId: string) => set({activeConversationId})
    }),{name:'message-store'}
  )
)