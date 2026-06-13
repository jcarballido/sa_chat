import useData from "../../hooks/useData.hooks"
import SecondaryActionButton from "../../shared/SecondaryActionButton"
import { useConversationStore } from "../../stores/conversation.store"

const StoredConversations = () => {
  const { storedConversations } = useData()
  const { setActiveConversation, activeConversation } = useConversationStore()

  // const handleClick = (conversationId: number) => {
  //   if(activeConversation.conversationId.storage === conversationId) return 
  //   setActiveConversation(conversationId)
  // }

  return(
    <div className="flex flex-col gap-0.5">
      {
        storedConversations.map(conv => (
          <div className={`w-full rounded-xl ${conv.conversationId.storage === activeConversation.conversationId.storage ? "bg-gray-700":""}`}>
            <SecondaryActionButton 
              action={conv.title}
              clickHandler={()=>setActiveConversation(conv.conversationId.storage)}
              disabled={activeConversation.conversationId.storage === conv.conversationId.storage}
            />
          </div>
        ))
      }
    </div>
  )
}

export default StoredConversations