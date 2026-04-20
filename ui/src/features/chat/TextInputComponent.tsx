import { useEffect, useRef, useState } from "react";
import SendSVG from "../../assets/send.svg"
import { colorMap } from "../../constants/colorTheme.constants";

interface TextInputComponentProps {
  value: string;
  isLoading: boolean;
  submit: (message:string) => void
}

const TextInputComponent = ({ value, isLoading, submit }: TextInputComponentProps) => {

  const [ input, setInput ] = useState(value)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  useEffect(() => {
    autoResize()
  }, [input])

  const autoResize = () => {
    const textAreaCurrent = textAreaRef.current
    if(!textAreaCurrent) {
      console.log("Text Area not registered to current.")
      return
    }
    textAreaCurrent.style.height = 'auto'
    textAreaCurrent.style.height = `${textAreaCurrent.scrollHeight}px`
  }

  const handleSubmit: React.SubmitEventHandler = (e) => {
    e.preventDefault()
    if(!input.trim()) return
    console.log("STRING SUBMITTED:")
    console.log(input)
    submit(input)
    setInput("")
  }

  return(
    <form onSubmit={handleSubmit} className="flex justify-center items-end p-2 gap-4 rounded-xl border-2 border-stone-400 focus-within:border-2 focus-within:border-[rgb(251,44,54)] transition duration-300  bg-stone-300">  
      <textarea
        className="flex flex-col p-2 min-h-11 max-h-64 grow outline-none resize-none   
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-thumb]:bg-white/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-white/40"
        ref={textAreaRef}
        rows={1}
        value={input}
        onChange={(e) =>{
          setInput(e.target.value)
        }}
      />
      <div className="flex flex-col justify-end">
        <button className={`text-white rounded-xl aspect-square transition duration-500 ${input === ''? 'bg-gray-600': colorMap.accent} flex justify-center items-center min-w-11`}  type="submit" disabled={input === ''}>
          <img className='min-w-8' src={SendSVG} />
        </button>
      </div>
    </form>
  )
};

export default TextInputComponent;