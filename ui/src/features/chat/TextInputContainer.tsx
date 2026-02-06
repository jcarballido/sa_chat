import React from 'react';
import TextInputComponent from './TextInputComponent';

interface TextInputContainerProps {
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputContainer: React.FC<TextInputContainerProps> = () => {
  
  const handleClick = () => {
    console.log("Button clicked")
  }

  return (
    <div className="flex flex-col grow max-h-full">
      <TextInputComponent value='start'/>
      <button className="ml-auto p-2 bg-blue-500 text-white rounded" type="button" onClick={handleClick}>Submit</button>
    </div>
  );
};

export default TextInputContainer;