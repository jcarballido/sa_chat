import React, { useState } from 'react';
import TextInputComponent from './TextInputComponent';

interface TextInputContainerProps {
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputContainer: React.FC<TextInputContainerProps> = () => {
  
  const [ isLoading, setIsLoading ] = useState(false)

  const handleSubmit = async (message: string) => {
    try {
      const res = await fetch('/api/submit', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({message}) 
        })
        const data = await res.json()
        console.log('Data:')
        console.log(data)
    } catch (error) {
      console.log("Error submitting message: ", error)
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