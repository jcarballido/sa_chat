import React from 'react';
import TextInputComponent from './TextInputComponent';

interface TextInputContainerProps {
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputContainer: React.FC<TextInputContainerProps> = () => {
  
  const handleClick = async() => {
    console.log("Button clicked")
    const res = await fetch("/api")
    console.log(res)
    const data = res.json()
    console.log(data)
  }

  return (
    <div className="flex flex-col grow max-h-full">
      <TextInputComponent value='start'/>
      <button className="ml-auto p-2 bg-blue-500 text-white rounded" type="button" onClick={handleClick}>Submit</button>
    </div>
  );
};

export default TextInputContainer;