import React from 'react';
import TextInputComponent from './TextInputComponent';

interface TextInputContainerProps {
  children?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputContainer: React.FC<TextInputContainerProps> = ({ children, onChange }) => {
  return (
    <div className="flex flex-col grow">
      <TextInputComponent value='start' onChange={}/>
      <button className="ml-auto p-2 bg-blue-500 text-white rounded" type="button">Submit</button>
    </div>
  );
};

export default TextInputContainer;