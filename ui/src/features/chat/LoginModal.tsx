import { colorMap } from "../../constants/colorTheme.constants"
import LeftArrowSVG from "../../assets/leftArrow.svg"
import { useState, type MouseEventHandler, type SubmitEventHandler } from "react"
import usePreviewMode from "../../hooks/usePreviewMode.hooks"
import useMagicLinkRequest from "../../hooks/useMagicLinkRequest.hooks"
import SuccessfulMagicLinkRequest from "./SuccessfulMagicLinkRequest"
import FailedMagicLinkRequests from "./FailedMagicLinkRequest"
import LoginForm from "./LoginForm"

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

  if(!preview) return null

  if(state === 'success'){
   return <SuccessfulMagicLinkRequest email={emailInput} resetModal={resetModal} />
  }

  if(state === "error"){
    return <FailedMagicLinkRequests email={emailInput} resetModal={resetModal} />
  }
  
  return <LoginForm email={emailInput} updateValue={setEmailInput} isActive={inputActive} setActive={setInputActive} loadState={state} isValid={validEmail(emailInput.trim())} sendRequest={sendRequest} />
}

export default LoginModal