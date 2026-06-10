import { useEffect, useRef, useState } from "react"
// import { useAppStateStore } from "../stores/appState.store"
import { useAuthStore } from "../stores/auth.store"
import App from "./App"
import SplashScreen from "./SplashScreen"
// import { useConversationStore } from "../stores/conversation.store"


const AppGate = () => {
  const { authStatus } = useAuthStore()
  const [ showSplash, setShowSplash ] = useState<boolean>(true) 
  const [ isLeaving, setIsLeaving ] = useState(false)

  console.log("Auth Status: ", authStatus.status)
  console.log("SESSION:", authStatus.session )
  console.log("PERFORMANCE RUNNING")
  const start = useRef(performance.now())
  console.log(start)
  // const { getStoredConversationMetadata } = useConversationStore()
  // const [ pinged, setPinged ] = useState<boolean>(false)

  // useEffect(() => {
  //   if(authStatus.status !== "loading"){
  //     console.log("SESSION SET")
  //     const elapsed = performance.now()
  //     console.log("ELAPSED TIME: ", elapsed)
  //     if(elapsed - start.current < 3000){
  //       setTimeout(()=>{
  //         setIsLeaving(true)
  //         setTimeout(()=>setShowSplash(false),500)
  //       }, (3000-(elapsed-start.current)))
  //     }else{
  //       setIsLeaving(true)
  //       setTimeout(()=>setShowSplash(false),500)
  //     }
  //   }
  // },[authStatus.status])
  
    return (
      <>
      <SplashScreen isLeaving={isLeaving} />
        {/* <App /> */}
        {/* { showSplash && <SplashScreen isLeaving={isLeaving} />} */}
      </>
    )



}

export default AppGate