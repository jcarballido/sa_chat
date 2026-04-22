import { colorMap } from "../../constants/colorTheme.constants"
import EmailSVG from "../../assets/email.svg"
import LeftArrowSVG from "../../assets/leftArrow.svg"
import { useState, type MouseEventHandler, type SubmitEventHandler } from "react"
import SentSVG from "../../assets/sent.svg"
import FailedSendSVG from "../../assets/errorSending.svg"
import { useAuthStore } from "../../stores/auth.store"
import usePreviewMode from "../../hooks/usePreviewMode.hooks"
import useEmailInput from "../../hooks/useEmailInput.hooks"
import useMagicLinkLoadingState from "../../hooks/useMagicLinkLoadingState.hooks"
import useMagicLinkRequest from "../../hooks/useMagicLinkRequest.hooks"

const LoginModal = () => {

  const [ inputActive, setInputActive ] = useState(false)
  const [ emailInput, setEmailInput ] = useState("")
  const preview = usePreviewMode()
  const { state, sendRequest, resetForm } = useMagicLinkRequest()
  const validEmail = (email:string):boolean  => {
    return (/^.+@.+.com$/.test(email.trim())) 
  }

  const resetModal: MouseEventHandler = (e) => {
    e.preventDefault()
    setEmailInput("")
    resetForm()
  }

  const submitMagicLinkRequest: SubmitEventHandler = async (e) => {
    e.preventDefault()
    if(!validEmail(emailInput)) return 
    sendRequest(emailInput)
  }

  if(!preview) return null

  if(state === 'success'){
    return(
      <div className="absolute border-4 flex w-full h-full justify-center items-center backdrop-blur-xs backdrop-grayscale-50 z-10">
      <div className="border border-black/30 bg-white aspect-square shadow-2xl rounded-xl p-8 flex flex-col justify-center items-center gap-y-6">
        <div className="flex flex-col items-center justify-center gap-10">
          <img src={SentSVG} className="h-12 rounded-full bg-green-500/50 p-1"/>
          <div className="flex flex-col items-center">
            <div className="font-bold">Check your inbox</div>
            <div className="text-gray-500">If registered, a magic link was sent to</div>
            <div className="font-bold p-2">
            {emailInput}
          </div>
          </div>
          <button className="border min-h-11 px-2 rounded-xl transition duration-150 ease-out bg-gray-300 hover:bg-gray-200 font-semibold w-full" onClick={resetModal}>
            Use a different email
          </button>
        </div>
      </div>
    </div>
    )
  }

  if(state === "error"){
    return(
      <div className="absolute border-4 flex w-full h-full justify-center items-center backdrop-blur-xs backdrop-grayscale-50 z-10">
      <div className="border bg-white border-black/30 aspect-square shadow-2xl rounded-xl p-8 flex flex-col justify-center items-center gap-y-6">
        <div className="flex flex-col items-center justify-center gap-10">
          <img src={FailedSendSVG} className="h-12 rounded-full bg-red-500/50 p-1"/>
          <div className="flex flex-col items-center">
            <div className="font-bold">Error attempting to submit your request for a magic link</div>
            <div className="font-bold p-2">
            {emailInput}
          </div>
          </div>
          <button className="border min-h-11 px-2 rounded-xl hover:bg-gray-300 font-semibold w-full" onClick={resetModal}>
            Use a different email
          </button>
        </div>
      </div>
    </div>
    )
  }
  
  return(
    <div className="absolute border-4 flex w-full h-full justify-center items-center  backdrop-blur-xs backdrop-grayscale-50 z-10">
    <div className="border border-black/30 aspect-square shadow-2xl rounded-xl p-16 flex bg-white flex-col justify-center items-center gap-y-6 z-20">
      <div className={`aspect-square h-16 ${colorMap.accent} shrink-0`} />
      <div>Welcome to sacp_chat </div>
      <div className="italic text-gray-500">
        <div className="flex justify-center items-center">Enter your email to receive a secure login link.</div>
        <div className="flex justify-center items-center">No password required.</div>
      </div>
      <form onSubmit={submitMagicLinkRequest} className=" flex flex-col gap-2 w-full">
        <div className={`flex w-full border p-2 gap-2 rounded-xl ${inputActive ? "ring ring-red-500 outline-2 outline-red-500 bg-gray-300/20 border-red-500":"bg-gray-300 ring ring-transparent outline-2 outline-transparent"}`}>
          <img src={EmailSVG} className="w-6"/>
          <input 
            className="rounded-lg w-full min-h-11 min-w-fit p-2 outline-none"
            value={emailInput}
            type="email"
            onChange={(e)=>setEmailInput(e.target.value)}
            placeholder="your@email.com"
            onFocus={()=>setInputActive(true)}
            onBlur={()=>setInputActive(false)}
          />
        </div>
        <button 
          type="submit" 
          className={`w-full transition duration-150 ease-in bg-black hover:bg-black/70 disabled:bg-gray-400  flex justify-center items-center p-2 rounded-xl`}
          disabled={!validEmail(emailInput.trim()) || state === "sending"}
        >
        {
          state === "sending" 
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

export default LoginModal