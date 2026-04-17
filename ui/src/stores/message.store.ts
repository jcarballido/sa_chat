import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AssistantMessageType, UserMessageType } from "../types/message.schema"
import type { ConversationType } from "../types/conversation.schema"

type State = {
  conversations: ConversationType[]
  activeConversationId: string|null,
}

type Action = {
  addMessage:(message: UserMessageType | AssistantMessageType,options?:{conversationId?: string}) => void,
  setActiveConversation:(conversationId: string | null)=> void
}

const createConversation = (initialMessage: UserMessageType) => {
  const conversation = {
    conversationId:initialMessage.conversationId!,
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
      addMessage: (message: UserMessageType | AssistantMessageType) => {
        const { activeConversationId } = get()
        if(activeConversationId === null && message.role === "user"){
          const newConversation = createConversation(message)

          return set((state) => ({
            activeConversationId: message.conversationId!,
            conversations: [...state.conversations,newConversation]
          }))
        }
        if(activeConversationId === message.conversationId)
        return set((state) => ({
          conversations: state.conversations.map( conv => {
            return conv.conversationId === message.conversationId
            ? {...conv,messages: [...conv.messages,message]}
            : conv
          })
        }))
      },
      setActiveConversation:(activeConversationId: string | null) => set({activeConversationId})
    }),{name:'message-store'}
  )
)