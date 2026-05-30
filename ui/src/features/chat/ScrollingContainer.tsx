// import { useMessageStore } from '../../stores/message.store';
import InputForm from './InputForm';
import { type AssistantMessageType, type UserMessageType } from '../../types/message.schema';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import { useConversationSentinel } from '../../hooks/useSentinel.hooks';
import useData from '../../hooks/useData.hooks';


const ScrollingContainer = () => {

  const { activeConversation } = useData()
  console.log("ACTIVE CONVERSATION:")
  console.log(activeConversation)

  return (
    <div className={`flex flex-col h-full w-[70%] gap-2 p-2 bg-transparent border-4 border-green-900`}>
      {
        activeConversation.messages.length === 0 
        ? <div className="grow  overflow-y-auto overflow-x-hidden 
       [&::-webkit-scrollbar]:w-1
       [&::-webkit-scrollbar-track]:bg-transparent
       [&::-webkit-scrollbar-thumb]:rounded-full
       hover:[&::-webkit-scrollbar-thumb]:bg-black/40       
        ">
          </div>
        : activeConversation.messages.map(msg => {
        return (
          <div className="grow overflow-y-auto overflow-x-hidden 
       [&::-webkit-scrollbar]:w-1
       [&::-webkit-scrollbar-track]:bg-transparent
       [&::-webkit-scrollbar-thumb]:rounded-full
       hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
            {typeof(msg.content) === "string" ? "TEST" :  "sdfkjdslfj"}
          </div>
        )
      })

      }
       <div className='w-full flex flex-col justify-center items-center '>
         <InputForm />    
       </div>
    </div>
  )
}

// const ScrollingContainer = () => {

//   const {conversations, activeConversationId} = useData()
//   const sentinel = useConversationSentinel(conversations)

//   // console.log("CONVERSATIONS:")
//   // console.log(conversations)
//   // console.log("activeConversationId",activeConversationId)

//   return (
//     <div className={`flex flex-col h-full w-[70%] gap-2 p-2 bg-transparent`}>
//       <div className="grow overflow-y-auto overflow-x-hidden resize-none   
//       [&::-webkit-scrollbar]:w-1
//       [&::-webkit-scrollbar-track]:bg-transparent
//       [&::-webkit-scrollbar-thumb]:rounded-full
//       hover:[&::-webkit-scrollbar-thumb]:bg-black/40">
//         {
//           conversations.map(conv => {
//             if(conv.conversationId === activeConversationId){
//               return(
//                 <div className='flex flex-col w-full'>
//                   {
//                     conv.messages.map((mes: UserMessageType | AssistantMessageType) => {
//                       return mes.role === "user" 
//                         ? <UserMessage userMessage={mes}/> 
//                         : <AssistantMessage assistantMessage={mes} />
//                     })
//                   }
//                 </div>
//               )
//             }
//             return null
//           })
//         }
//         <div ref={sentinel}/>
//       </div>
//       <div className='w-full flex flex-col justify-center items-center '>
//         <InputForm />    
//       </div>
//     </div>
//   )
// };

export default ScrollingContainer;