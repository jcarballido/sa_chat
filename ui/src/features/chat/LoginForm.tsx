import { colorMap } from "../../constants/colorTheme.constants"
import type { RequestState } from "../../types/RequestState.types"
import EmailSVG from "../../assets/email.svg"
import React, { type SubmitEventHandler } from "react"
import LeftArrowSVG from "../../assets/leftArrow.svg"
import InvalidLinkMessage from "./InvalidLinkMessage"

type LoginFormProps = {
    email:string,
    updateValue: React.Dispatch<React.SetStateAction<string>>,
    isActive:boolean,
    setActive:React.Dispatch<React.SetStateAction<boolean>>,
    loadState:RequestState,
    isValid:boolean,
    sendRequest: (email:string) => void
}

const LoginForm = ({email,updateValue, isActive, setActive, loadState, isValid, sendRequest}:LoginFormProps) => {

    const submitMagicLinkRequest: SubmitEventHandler = async (e) => {
    e.preventDefault()
    if(!isValid) return 
    sendRequest(email)
    }

return(
    <div className="absolute border-4 flex w-full h-full justify-center items-center  backdrop-blur-xs backdrop-grayscale-50 z-10">
      
    <div className="border border-black/30 aspect-square shadow-2xl rounded-xl p-16 flex bg-white flex-col justify-center items-center gap-y-6 z-20 relative">
      <InvalidLinkMessage />
      <div className={`aspect-square h-16 ${colorMap.accent} shrink-0`} />
      <div className="font-bold">Welcome to sacp_chat </div>
      <div className="italic text-gray-500">
        <div className="flex justify-center items-center">Enter your email to receive a secure login link.</div>
        <div className="flex justify-center items-center">No password required.</div>
      </div>
      <form onSubmit={submitMagicLinkRequest} className=" flex flex-col gap-2 w-full">
        <div className={`flex w-full items-end border p-2 gap-2 rounded-xl ${isActive ? "ring ring-red-500 outline-2 outline-red-500 bg-gray-300/20 border-red-500":"bg-gray-300 ring ring-transparent outline-2 outline-transparent"}`}>
          <img src={EmailSVG} className="w-8 flex items-end h-full"/>
          <input 
            className="rounded-lg w-full min-h-11 min-w-fit p-2 outline-none items-center leading-[1]"
            value={email}
            type="email"
            onChange={(e)=>updateValue(e.target.value)}
            placeholder="your@email.com"
            onFocus={()=>setActive(true)}
            onBlur={()=>setActive(false)}
          />
        </div>
        <button 
          type="submit" 
          className={`w-full transition duration-150 ease-in bg-black hover:bg-black/70 disabled:bg-gray-400  flex justify-center items-center p-2 rounded-xl`}
          disabled={!isValid || loadState === "sending"}
        >
        {
          loadState === "sending" 
          ? <div className="flex text-white">
              Sending ...
            </div>
          : <div className="flex text-white font-bold">
            Send Magic Link
            <img className="w-6" src={LeftArrowSVG} />
          </div>

        }
        </button>
      </form>
    </div>
  </div>
  )
}

export default LoginForm