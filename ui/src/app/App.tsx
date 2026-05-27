import { useEffect } from "react";
import Aside from "../features/chat/Aside";
import LoginModal from "../features/chat/LoginModal";
import MainContainer from "../features/chat/MainContainer";
import { useAuthStore } from "../stores/auth.store";
import { useMessageStore } from "../stores/message.store";
// import { useAuth } from "../hooks/useAuth.hooks";
// import { useAuthStore } from "../stores/auth.store";

const App = () => {

  // useAuth()
  const session = useAuthStore(s => s.session)
  console.log("SESSION: ")
  console.log(session)
  const getConversationsMetadata = useMessageStore(s => s.getConversationsMetadata)

  useEffect(() => {
    getConversationsMetadata()
  },[session])
  

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
