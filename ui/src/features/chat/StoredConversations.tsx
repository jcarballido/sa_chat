import useData from "../../hooks/useData.hooks"
import useInteraction from "../../hooks/useInteraction.hooks"
import SecondaryActionButton from "../../shared/SecondaryActionButton"
import { useMessageStore } from "../../stores/message.store"

const StoredConversations = () => {
  const setActiveConversation = useMessageStore(s=>s.setActiveConversation)  
  const {conversations } = useData()
  const { disabled } = useInteraction()

  return(
    <div className="">
      {
        conversations.map(conv => (
            <div className="w-full">
              <SecondaryActionButton action={conv.title} clickHandler={()=> setActiveConversation(conv.conversationId)} disabled={disabled} />
            </div>
          )
        )
      }
    </div>
  )
}

export default StoredConversations