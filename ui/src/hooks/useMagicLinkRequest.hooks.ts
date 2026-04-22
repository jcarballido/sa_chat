import { useState } from "react"
import type { RequestState } from "../types/RequestState.types"

const useMagicLinkRequest = () => {
    const [ state, setState ] = useState<RequestState>("idle")

    const sendRequest = async (validatedEmail:string) => {
        setState("sending")        
        try {
        const response = await fetch('api/login/requestAccess',{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({email: validatedEmail})
        })
        if(!response.ok) throw new Error("Error failed.")
        setState("success")
        } catch (error) {
            setState("error")
        } 
    }

    const resetForm = () => setState("idle")

    return {
        state,
        sendRequest,
        resetForm
    }

}

export default useMagicLinkRequest