import { useMessageStore } from "../../stores/message.store"

const StoredConversations = () => {
  const messageStore = useMessageStore()  
  const { conversations, setActiveConversation } = messageStore

  return(
    <div>
      {
        conversations.map(conv => (
            <div key={conv.conversationId} onClick={() => setActiveConversation(conv.conversationId) }>{conv.conversationId}</div>
          )
        )
      }
    </div>
  )
}

export default StoredConversations