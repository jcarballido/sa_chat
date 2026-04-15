import { useEffect, useRef } from 'react';
import { colorMap } from '../../constants/colorTheme.constants';
import { useMessageStore } from '../../stores/message.store';
import TextInputContainer from './TextInputContainer';

const ScrollingContainer = () => {

  const sentinalRef = useRef<HTMLDivElement | null>(null)
  const messageStore = useMessageStore()
  const { conversations,activeConversationId } = messageStore

  useEffect(() => {
    const sentinal = sentinalRef.current
    if(!sentinal) return
    sentinal.scrollIntoView({behavior: 'smooth'})
  },[conversations])

  return (
    <div className={`flex flex-col h-full w-[70%] gap-2 p-2`}>
      <div className="grow overflow-y-auto resize-none   [&::-webkit-scrollbar]:w-[4px]
[&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
        {
          conversations.map(conv => {
            if(conv.conversationId === activeConversationId){
              return(
                <div className='flex flex-col gap-4 w-full '>
                  {
                    conv.messages.map(mes => (
                      <div className={` ${mes.role === "user" 
                      ? `$bg-transparent flex justify-end text-white`
                      : ""} text-black`}>
                        <div className={`${mes.role === "user" 
                          ? `${colorMap.accent} max-w-[60%]`
                          :"border-2 border-stone-700 bg-stone-300 w-full"} p-2 rounded-xl`}>
                            {mes.content}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            }
            return null
          })
        }
        <div ref={sentinalRef} className=''/>
      </div>
      <div className='w-full flex justify-center items-center bg-transparent'>
        <TextInputContainer />    
      </div>
    </div>
  )
};

export default ScrollingContainer;