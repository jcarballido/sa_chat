import { colorMap } from '../../constants/colorTheme.constants';
import { useMessageStore } from '../../stores/message.store';
import TextInputContainer from './TextInputContainer';

const ScrollingContainer = () => {

  const messageStore = useMessageStore()
  const { conversations,activeConversationId } = messageStore

  return (
    <div className={`flex flex-col h-full w-[50%]  p-4`}>
      <div className="grow overflow-y-auto ">
        {
          conversations.map(conv => {
            if(conv.conversationId === activeConversationId){
              return(
                <div className='border-2 border-purple-700'>
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
      <div className='w-full flex justify-center items-center bg-transparent'>
        <TextInputContainer />    
      </div>
    </div>
  )
};

export default ScrollingContainer;