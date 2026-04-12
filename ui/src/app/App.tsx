import BottomFixedUserComponent from "../features/chat/BottomFixedUserComponent";
import ScrollingContainer from "../features/chat/ScrollingContainer";
import StoredConversations from "../features/chat/StoredConversations";
import { useMessageStore } from "../stores/message.store";

export interface FullPageContainerProps {
  children?: React.ReactNode;
}
const App: React.FC<FullPageContainerProps> = () => {

  const messageStore = useMessageStore()
  const { setActiveConversation } = messageStore

  const newChat = () => {
    console.log("NEW CHAT STARTED")
    setActiveConversation(null)
  }

  return (
    <div className="flex h-screen w-screen">
      <aside className="w-1/4 max-w-sm bg-gray-200 p-4 flex flex-col gap-4">
        <div className="bg-fuchsia-700">
          LOGO
        </div>
        <div className="border-2 flex-col ">
          <div onClick={newChat}>new chat</div>
          <div>search chats</div>
        </div>
        <div className="grow border-4 border-black">
          <h1 className="border-2 border-red-600">STORED CONVERSATION</h1>
          <StoredConversations />
        </div>
        <BottomFixedUserComponent />
      </aside>
      <main className="flex-1 max-h-full bg-white p-4">
        <ScrollingContainer/>
      </main>
    </div>
  );
}

export default App
