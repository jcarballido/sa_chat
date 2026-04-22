import { useState } from "react"

const useMagicLinkLoadingState = () => {

    const initialLoadingState = false

      const [isSending, setIsSending] = useState(initialLoadingState)
      const [ sent, setSent ] = useState(initialLoadingState)
      const [ requestFailed, setRequestFailed ] = useState(initialLoadingState)

      return{
        isSending,
        setIsSending,
        sent,
        setSent,
        requestFailed, setRequestFailed
      }
}

export default useMagicLinkLoadingState