import { useMessageStore } from '../../stores/message.store';
import TextInputContainer from './TextInputContainer';

const ScrollingContainer = () => {

  const messageStore = useMessageStore()
  const { conversations,activeConversationId } = messageStore

  return (
    <div className="flex flex-col h-full border-2 border-black bg-gray-500">
      <div className="flex-1 overflow-y-auto border-2 border-emerald-400">
        {
          conversations.map(conv => {
            if(conv.conversationId === activeConversationId){
              return(
                <div className='border-2 border-fuchsia-950'>
                  {
                    conv.messages.map(mes => (
                      <div className={`${mes.role === "user" ? "bg-white": "bg-amber-500"}`}>{mes.content}</div>
                    ))
                  }
                </div>
              )
            }
            return null
          })
        }
      </div>
      
      <div className="sticky bottom-0 shadow max-h-full">
        <TextInputContainer />
      </div>
    </div>
  )
};

export default ScrollingContainer;