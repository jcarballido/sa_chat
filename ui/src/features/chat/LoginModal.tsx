import { colorMap } from "../../constants/colorTheme.constants"
import EmailSVG from "../../assets/email.svg"
import LeftArrowSVG from "../../assets/leftArrow.svg"
import { useState, type SubmitEventHandler } from "react"

const LoginModal = () => {

  const [ inputActive, setInputActive ] = useState(false)
  const [ emailInput, setEmailInput ] = useState("")
  const [isSending, setIsSending] = useState(false)

  const validEmail = (email:string):boolean  => {
    return (/^.+@.+.com$/.test(email.trim())) 
  }

  const submitMagicLinkRequest: SubmitEventHandler = async (e) => {
    e.preventDefault()
    if(validEmail(emailInput)){
      try {
        setIsSending(true)
        const response = await fetch('api/login/requestAccess',{
          method:"POST",
          headers:{"Content-Type": "application/json"},
          body:JSON.stringify({email: emailInput.trim()})
        })
        console.log("Request received:")
        const raw = await response.json()
        console.log(raw.status)
        return
      } catch (error) {
        console.log("ERROR in response:", error)
        console.log("ERROR SUBMITTING EMAIl")
      } finally{
        setIsSending(false)
      }
    }
    console.log("Email is not valid")
    return 
  }

  return (
    <div className="absolute border-4 flex w-full h-full justify-center items-center backdrop-blur-xs backdrop-grayscale-50">
      <div className="border border-black/20 aspect-square shadow-2xl rounded-xl p-16 flex flex-col justify-center items-center gap-y-6">
        <div className={`aspect-square h-16 ${colorMap.accent} shrink-0`} />
        <div>Welcome to sacp_chat </div>
        <div className="italic text-gray-500">
          <div className="flex justify-center items-center">Enter your email to receive a secure login link.</div>
          <div className="flex justify-center items-center">No password required.</div>
        </div>
        <form onSubmit={submitMagicLinkRequest} className=" flex flex-col gap-2 w-full">
          <div className={`flex w-full border p-2 gap-2 rounded-xl ${inputActive ? "outline-2 outline-red-500 bg-gray-300/20":"bg-gray-300"}`}>
            <img src={EmailSVG} className="w-6"/>
            <input 
              className="rounded-lg w-full min-h-11 min-w-fit p-2 outline-none"
              value={emailInput}
              type="email"
              onChange={(e)=>setEmailInput(e.target.value)}
              placeholder="yourEmail@email.com"
              onFocus={()=>setInputActive(true)}
              onBlur={()=>setInputActive(false)}
            />
          </div>
          <button 
            type="submit" 
            className={`w-full bg-black hover:bg-black/70 disabled:bg-gray-400  flex justify-center items-center p-2 rounded-xl`}
            disabled={!validEmail(emailInput) || isSending === true}
          >
            <div className="flex text-white">
              Send Magic Link
              <img className="w-6" src={LeftArrowSVG} />
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal