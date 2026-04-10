// import * as React, { useState } from 'react';
import TextInputComponent from './TextInputComponent';
import { ApiResponseSchema } from '../../types/api.schema';
import { MessageSchema, type MessageType } from '../../types/message.schema';
import { useMessageStore } from '../../stores/message.store';
import { useState } from 'react';

// interface TextInputContainerProps {
//   children?: React.ReactNode;
//   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const TextInputContainer: React.FC<TextInputContainerProps> = () => {
const TextInputContainer = () => {
  
  const [ isLoading, setIsLoading ] = useState(false)
  const messageStore = useMessageStore()

  const { conversations,activeConversationId, addMessage, setActiveConversation } = messageStore

  const handleSubmit = async (message: string) => {
    const createNewMessage: (newMessage:string) => MessageType = (newMessage:string) => ({
      id:`${Math.random()}`,
      conversationId: activeConversationId,
      role:"user",
      content:newMessage,
      createdAt:new Date().toISOString(),
      status:"sending",
    })
    const newMessage = createNewMessage(message)
    try {
      // console.log("NEW MESSAGE:")
      // console.log(newMessage)
      const res = await fetch('api/chat/test', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage) 
      })
      const raw = await res.json()
      const result = ApiResponseSchema(MessageSchema).safeParse(raw)
      if(!result.success){
        console.error("API Contract Violated:", result.error.issues)
        throw new Error("Unexpected result error.")
      }
      const {status, data, error} = result.data
      console.log("DATA RESULT: ", result.data)
      if(status === "error"){
        console.error("SERVER RETURNED AN ERROR: ", error.message)
        throw new Error(error.code)
      }
      if(!activeConversationId) setActiveConversation(data.conversationId!)
      addMessage(data)
      console.log("RESPONSE DATA: ",data)
      console.log("CURRENT STORE STATE: ")
      console.log(conversations)
    } catch (error) {
      console.error(error)
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col grow max-h-full">
      <TextInputComponent value='start' submit={handleSubmit} isLoading={isLoading}/>
    </div>
  );
};

export default TextInputContainer;