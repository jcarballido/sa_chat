import React, { useState } from 'react';

interface TextInputComponentProps {
  value: string;
  isLoading: boolean;
  submit: (message:string) => void
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({ value, isLoading, submit }) => {

  const [ input, setInput ] = useState(value)
  const handleSubmit: React.SubmitEventHandler = (e) => {
    e.preventDefault()
    if(!input.trim()) return
    submit(input)
    setInput("")
  }

  return(
    <form onSubmit={handleSubmit}>  
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
      <button className={`ml-auto p-2  text-white rounded ${isLoading? 'bg-gray-600':'bg-blue-500'}`} type="submit" disabled={isLoading}>Submit</button>
    </form>
  )
};

export default TextInputComponent;