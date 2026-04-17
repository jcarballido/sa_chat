import { useEffect, useRef } from 'react';
import { useMessageStore } from '../../stores/message.store';
import TextInputContainer from './TextInputContainer';
import SpecificationTable from './SpecificationTable';
import { colorMap } from '../../constants/colorTheme.constants';
import { AssistantDataSchema } from '../../types/message.schema';

const ScrollingContainer = () => {

  const sentinalRef = useRef<HTMLDivElement | null>(null)
  const messageStore = useMessageStore()
  const { conversations, activeConversationId } = messageStore

  useEffect(() => {
    const sentinal = sentinalRef.current
    if(!sentinal) return
    sentinal.scrollIntoView({behavior: 'smooth'})
  },[conversations])

  const t = [
    {model:"X-AB-3", gun_count:0, waterproof: true, height:55, width:60},
    {model:"AB-100", gun_count:10, waterproof: false,height:55, width:72},
    {model:"T35-XT", gun_count:100, waterproof: true,height:59, width:30},
    {model:"X-35", gun_count:32, waterproof: true,height:35, width:80}
  ]

  return (
    <div className={`flex flex-col h-full w-[70%] gap-2 p-2 bg-transparent`}>
      <div className="grow overflow-y-auto overflow-x-hidden resize-none   
      [&::-webkit-scrollbar]:w-[4px]
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:rounded-full
      hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
        {
          conversations.map(conv => {
            if(conv.conversationId === activeConversationId){
              return(
                <div className='flex flex-col w-full '>
                  {
                    conv.messages.map(mes => {
                      if(mes.role === "user"){
                        return (<div className={` ${mes.role === "user" 
                        ? `my-2 bg-transparent flex justify-end text-white`
                        : "my-8"} text-black`}>
                          <div className={`${mes.role === "user" 
                            ? `${colorMap.accent} max-w-[60%]`
                            :" w-full"} p-2 rounded-xl`}>
                              {mes.content}
                          </div>
                        </div>
                      )                        
                      }
                      try {
                        const result = JSON.parse(mes.content)
                        const validatedResult = AssistantDataSchema.safeParse(result)
                        if(validatedResult.success){
                          const data = validatedResult.data.domainData
                          console.log("DATA:", data)
                          return (
                            <div className={`my-8 text-black`}>
                              <div className={`w-full p-2 rounded-xl`}>
                                <SpecificationTable specs={data}/>
                              </div>
                            </div>
                          )
                        }
                        throw new Error("Zod validation failed")
                      } catch (error) {
                        return (<div className={` my-8 text-black`}>
                          <div className={`w-full p-2 rounded-xl`}>
                              {mes.content}
                          </div>
                        </div>)                        
                      }
                      // const jsonCheckRegex = /{.+}/
                      // const jsonCheck = (res:string) => jsonCheckRegex.test(res)
                      // if(!jsonCheck(mes.content)){
                      //   console.log("MESSAGE IS NOT JSON: ", mes.content)
                      //   return (<div className={` my-8 text-black`}>
                      //     <div className={`w-full p-2 rounded-xl`}>
                      //         {mes.content}
                      //     </div>
                      //   </div>)
                      // }

                      // const assistantResponse = JSON.parse(mes.content)                      
                      // console.log("PARSE RESULT:", assistantResponse.domainData)
                      // const domain = assistantResponse.domainData
                      // if(!domain){
                      //   console.log("DOMAIN DATA MISSING. Assistant Response:", assistantResponse)
                      //   return (<div className={` my-8 text-black`}>
                      //     <div className={`w-full p-2 rounded-xl`}>
                      //         {mes.content}
                      //     </div>
                      //   </div>)
                      // } 
                      // console.log("DOMAIN DATA PRESENT")
                      // const d = assistantResponse.domainData
                      // return (<div className={`my-8 text-black`}>
                      //     <div className={`w-full p-2 rounded-xl`}>
                      //         {d.map(entry => {
                                
                      //           if(entry) return (<SpecificationTable specs={entry}/>)}
                      //         )}
                      //     </div>
                      //   </div>
                      // )
                    })
                  }
                </div>
              )
            }
            return null
          })
        }
        {/* <SpecificationTable specs={t}/> */}
        <div ref={sentinalRef} className=''/>
      </div>
      <div className='w-full flex justify-center items-center '>
        <TextInputContainer />    
      </div>
    </div>
  )
};

export default ScrollingContainer;