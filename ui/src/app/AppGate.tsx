import { useEffect, useRef, useState } from "react"
// import { useAppStateStore } from "../stores/appState.store"
import { useAuthStore } from "../stores/auth.store"
import App from "./App"
// import { useConversationStore } from "../stores/conversation.store"


const AppGate = () => {
  const { authStatus } = useAuthStore()
  const [ loaded, setLoaded ] = useState<boolean>(false) 

  console.log("Auth Status: ", authStatus.status)
  console.log("SESSION:", authStatus.session )
  console.log("PERFORMANCE RUNNING")
  const start = useRef(performance.now())
  console.log(start)
  // const { getStoredConversationMetadata } = useConversationStore()
  // const [ pinged, setPinged ] = useState<boolean>(false)

  useEffect(() => {
    if(authStatus.status !== "loading"){
      console.log("SESSION SET")
      const elapsed = performance.now()
      console.log("ELAPSED TIME: ", elapsed)
      if(elapsed - start.current < 3000){
        setTimeout(()=>{
          setLoaded(true)
        }, (3000-(elapsed-start.current)))
      }else{
        setLoaded(true)
      }
    }
  },[authStatus.status])
  
  if(!loaded){
    return (
      <div className="bg-amber-600 w-screen h-screen flex justify-center items-center text-9xl">
        LOADING
      </div>
    )
  }

  return (
    <App />
  )


}

export default AppGate