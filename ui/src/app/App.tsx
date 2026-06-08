import { useEffect, useState } from "react";
import Aside from "../features/chat/Aside";
import LoginModal from "../features/chat/LoginModal";
import MainContainer from "../features/chat/MainContainer";
import { useAuthStore } from "../stores/auth.store";
import { useConversationStore } from "../stores/conversation.store";
// import { useMessageStore } from "../stores/message.store";
// import { useAuth } from "../hooks/useAuth.hooks";
// import { useAuthStore } from "../stores/auth.store";

const App = () => {

  // useAuth()
  const { loading,session, setLoading} = useAuthStore()
  const { getStoredConversationMetadata } = useConversationStore()
  const [pinged, setPinged] = useState<boolean>(false)
  // console.log("SESSION: ")
  // console.log(session)
  // const getConversationsMetadata = useMessageStore(s => s.getConversationsMetadata)
  const start = performance.now()
  console.log("START TIME:")
  console.log(start)

  useEffect(() => {
    const remaining = performance.now() - start
    console.log("REMAINING TIME:")
    console.log(remaining)

    if(remaining < 1000){
      const c = async() =>  new Promise((resolve) => {
      setTimeout(resolve,remaining)
     })
     c()
    }

    if(session && !pinged){
      setLoading(!!session)
      if(!pinged){
        setPinged(true)
        getStoredConversationMetadata()
      }
    }
  },[session])

  if(loading){
    return (
      <div className="bg-amber-600 w-screen h-screen">
        LOADING
      </div>
    )
  }

  

  return (
    <div className="flex h-screen w-screen relative">
      {/* <div className="absolute border-4 border-purple-700">LINK ERROR</div> */}
      <LoginModal />
      <Aside />
      <MainContainer />
    </div>
  );
}

export default App
