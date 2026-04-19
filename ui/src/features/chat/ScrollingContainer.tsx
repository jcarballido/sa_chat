import { act, useEffect, useRef } from 'react';
import { useMessageStore } from '../../stores/message.store';
import TextInputContainer from './TextInputContainer';
import { type AssistantMessageType, type UserMessageType } from '../../types/message.schema';
import UserMessage from './UserMessage';
import AssistantMessage from '../AssistantMessage';

const ScrollingContainer = () => {

  const sentinalRef = useRef<HTMLDivElement | null>(null)
  const messageStore = useMessageStore()
  const { conversations, activeConversationId } = messageStore

  useEffect(() => {
    const sentinal = sentinalRef.current
    if(!sentinal) return
    sentinal.scrollIntoView({behavior: 'smooth'})
  },[conversations])

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
                <div className='flex flex-col w-full '>
                  {
                    conv.messages.map((mes: UserMessageType | AssistantMessageType) => {
                      if(mes.role === "user"){
                        return <UserMessage userMessage={mes}/>                        
                      }
                      <AssistantMessage assistantMessage={mes} />
                    })
                  }
                </div>
              )
            }
            return null
          })
        }
        <div ref={sentinalRef} className=''/>
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