// import * as React, { useState } from 'react';
import TextInputComponent from './TextInputComponent';
import { useChat } from '../../hooks/useChat.hooks';

const TextInputContainer = () => {

  const { sendUserMessage, isLoading } = useChat()
  
  const handleSubmit = async (input: string) => await sendUserMessage(input) 

  return (
    <div className="flex flex-col grow max-h-full">
      <TextInputComponent value='start' submit={handleSubmit} isLoading={isLoading}/>
    </div>
  );
};

export default TextInputContainer;