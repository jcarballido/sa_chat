import { useState } from "react"

const useEmailInput = () => {

    const initialEmailValue = ""
    const initialInputActive = false

  const [ inputActive, setInputActive ] = useState(initialInputActive)
  const [ emailInput, setEmailInput ] = useState(initialEmailValue)

    const validEmail = (email:string):boolean  => {
    return (/^.+@.+.com$/.test(email.trim())) 
  }

  return {
    inputActive,
    setInputActive,
    emailInput,
    setEmailInput,
    validEmail
  }

}

export default useEmailInput