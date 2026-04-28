// import * as React, { useState } from 'react';
import TextInputComponent from './TextInputComponent';
import { useChat } from '../../hooks/useChat.hooks';
import useInteraction from '../../hooks/useInteraction.hooks';

const TextInputContainer = () => {

  const { sendUserMessage, isLoading } = useChat()
  const { disabled } = useInteraction()
  
  const handleSubmit = async (input: string) => await sendUserMessage(input) 

  return (
    <div className="flex flex-col justify-center items-center w-full ">
      <TextInputComponent value='start' submit={handleSubmit} isLoading={isLoading} disabled={disabled}/>
      <div className='p-4'>
        sa_chat can make mistakes. Confirm all critical information.
      </div>
    </div>
  );
};

export default TextInputContainer;