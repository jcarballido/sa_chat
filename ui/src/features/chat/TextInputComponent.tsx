import React, { useState } from 'react';

interface TextInputComponentProps {
  value: string;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({ value }) => {

  const [ input, setInput ] = useState(value)

  return(
    <textarea
      className="flex flex-col min-h-[50px] px-4 py-2 border border-gray-300 rounded resize-none"
      rows={1}
      value={input}
      onChange={setInput}
      onInput={(event) => {
        const target = event.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }}
    />
  )
};

export default TextInputComponent;