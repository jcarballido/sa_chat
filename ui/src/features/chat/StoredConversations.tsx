import useData from "../../hooks/useData.hooks"
import SecondaryActionButton from "../../shared/SecondaryActionButton"
import { useConversationStore } from "../../stores/conversation.store"

const StoredConversations = () => {
  const { storedConversations } = useData()
  const { setActiveConversation } = useConversationStore()
  return(
    <div className="">
      {
        storedConversations.map(conv => (
            <div className="w-full">
              <SecondaryActionButton 
                action={conv.title}
                clickHandler={() => setActiveConversation(conv.conversationId.storage)}
                disabled={false}
                // clickHandler={()=> setActiveConversation(conv.conversationId)}
                // disabled={disabled}
              />
            </div>
          )
        )
      }
    </div>
  )
}

export default StoredConversations