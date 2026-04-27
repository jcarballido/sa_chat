import { useMessageStore } from '../../stores/message.store';
import TextInputContainer from './TextInputContainer';
import { type AssistantMessageType, type UserMessageType } from '../../types/message.schema';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import { useConversationSentinel } from '../../hooks/useSentinel.hooks';
import { useAuthStore } from '../../stores/auth.store';
import SendSVG from "../../assets/send.svg"

const ScrollingContainer = () => {

  const { session } = useAuthStore()
  const messageStore = useMessageStore()
  const { conversations, activeConversationId } = messageStore
  const sentinel = useConversationSentinel(conversations)

  if(!session){
    return(
      <div className={`flex flex-col h-full w-[70%] gap-2 p-2 bg-transparent `}>
        <div className="grow overflow-y-auto overflow-x-hidden resize-none   
        [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
          <div>USER MESSAGE</div>
          <div>ASSISTANT MESSAGE</div>
        </div>
        <div className='w-full flex flex-col justify-center items-center '>
          <div className='w-full'>
          <form onSubmit={() => {}} className="flex justify-center items-end p-2 gap-4 rounded-xl border-2 border-black focus-within:border-2 focus-within:border-[rgb(251,44,54)] transition duration-300  bg-stone-300">  
            <textarea
              className="flex flex-col p-2 min-h-11 max-h-64 grow outline-none resize-none   
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-white/20
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-white/40"
              rows={1}
              value="Send a Request"
              onChange={() =>{}}
            />
            <div className="flex flex-col justify-end">
              <button className={`text-white rounded-xl aspect-square transition duration-500 ${'bg-gray-600'} flex justify-center items-center min-w-11`}  type="submit" disabled={true}>
                <img className='min-w-8' src={SendSVG} />
              </button>
            </div>
          </form>
          </div>
          <div className='p-4'>
            sa_chat can make mistakes. Confirm all critical information.
          </div>  
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full w-[70%] gap-2 p-2 bg-transparent`}>
      <div className="grow overflow-y-auto overflow-x-hidden resize-none   
      [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:rounded-full
      hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
        {
          conversations.map(conv => {
            if(conv.conversationId === activeConversationId){
              return(
                <div className='flex flex-col w-full'>
                  {
                    conv.messages.map((mes: UserMessageType | AssistantMessageType) => {
                      return mes.role === "user" 
                        ? <UserMessage userMessage={mes}/> 
                        : <AssistantMessage assistantMessage={mes} />
                    })
                  }
                </div>
              )
            }
            return null
          })
        }
        <div ref={sentinel}/>
      </div>
      <div className='w-full flex flex-col justify-center items-center '>
        <TextInputContainer />  
        <div className='p-4'>
          sa_chat can make mistakes. Confirm all critical information.
        </div>  
      </div>
    </div>
  )
};

export default ScrollingContainer;