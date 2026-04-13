import { useState } from "react";
import BottomFixedUserComponent from "../features/chat/BottomFixedUserComponent";
import ScrollingContainer from "../features/chat/ScrollingContainer";
import StoredConversations from "../features/chat/StoredConversations";
import { useMessageStore } from "../stores/message.store";

export interface FullPageContainerProps {
  children?: React.ReactNode;
}
const App: React.FC<FullPageContainerProps> = ({children}) => {

  const [isOpen, setIsOpen] = useState(false);
  const messageStore = useMessageStore()
  const { setActiveConversation } = messageStore

  const newChat = () => {
    console.log("NEW CHAT STARTED")
    setActiveConversation(null)
  }

  return (
    <div className="flex h-screen w-screen">
      {/* <aside className="w-1/4 max-w-sm bg-gray-200 p-4 flex flex-col gap-4"> */}
      <aside className="w-10 bg-gray-600">
        dfjl
      </aside>
      <aside className={`grid transition-all duration-1000 ease-in-out bg-gray-600 whitespace-nowrap ${isOpen ? "grid-cols-[1fr]" : "grid-cols-[0fr]"}`}>
        <div className="overflow-hidden h-full flex flex-col">
          <div className="">
            LOGO
          </div>
          <div className="flex-col">
            <div onClick={newChat} className="whitespace-nowrap">new chat</div>
            <div className="whitespace-nowrap">search chats</div>
          </div>
          <div className="overflow-hidden grow">
            <h1 className="whitespace-nowrap">STORED CONVERSATION</h1>
            <StoredConversations />
          </div>
          <BottomFixedUserComponent />
        </div>
      </aside>
      <main className="flex-1 max-h-full bg-white p-4">
        <div className="w-max" onClick={() => setIsOpen(!isOpen)}>
          DRAWER
        </div>
        <ScrollingContainer/>
      </main>
    </div>
  );
}

export default App
