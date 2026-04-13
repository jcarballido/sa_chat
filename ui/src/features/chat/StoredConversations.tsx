import SecondaryActionButton from "../../shared/SecondaryActionButton"
import { useMessageStore } from "../../stores/message.store"

const StoredConversations = () => {
  const messageStore = useMessageStore()  
  const { conversations, setActiveConversation } = messageStore

  return(
    <div className="">
      {
        conversations.map(conv => (
            <div className="w-full">
              <SecondaryActionButton action={conv.title} clickHandler={()=> setActiveConversation(conv.conversationId)}/>
            </div>
          )
        )
      }
    </div>
  )
}

export default StoredConversations