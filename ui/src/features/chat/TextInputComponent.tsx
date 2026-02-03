import React, { useState } from 'react';

interface TextInputComponentProps {
  value: string;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({ value }) => {

  const [ input, setInput ] = useState(value)

  return(
    <textarea
      className="flex flex-col min-h-12.5 max-h-64 px-4 py-2 border border-gray-300 rounded resize-none"
      rows={1}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onInput={(event) => {
        const target = event.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }}
    />
  )
};

export default TextInputComponent;