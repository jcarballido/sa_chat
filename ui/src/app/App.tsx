import { useState, type MouseEventHandler, type ReactNode } from "react";
import BottomFixedUserComponent from "../features/chat/BottomFixedUserComponent";
import ScrollingContainer from "../features/chat/ScrollingContainer";
import StoredConversations from "../features/chat/StoredConversations";
import { useMessageStore } from "../stores/message.store";
import { colorMap } from "../constants/colorTheme.constants";
import PencilSVG from "../assets/pencil.svg"
import SearchSVG from "../assets/search.svg"
import SecondaryActionButton from "../shared/SecondaryActionButton";

const App = () => {

  // const [isOpen, setIsOpen] = useState(false);
  const messageStore = useMessageStore()
  const { setActiveConversation } = messageStore

  const newChat = () => {
    console.log("NEW CHAT STARTED")
    setActiveConversation(null)
  }

  const TitleCard = () => {
    return (
      <div className="flex gap-2 shrink-0 w-fit">
        <div className={`aspect-square h-full ${colorMap.accent} min-w-fit shrink-0`} />
        <div className="min-w-fit shrink-0">
          <div className="text-lg">
            sa_chat
          </div>
          <div className="text-sm italic whitespace-nowrap shrink-0 min-w-fit">
            A lookup assistant
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="flex h-screen w-screen">
      <aside className={`h-full ${colorMap.bgMain} flex flex-col gap-4 text-white p-2`}>
        <TitleCard />
        <div className="flex flex-col justify-start shrink-0">
          <SecondaryActionButton
            action={'New Request'}
            clickHandler={newChat} 
            icon={<img src={PencilSVG}/>}
          />
          <SecondaryActionButton
            action={'Search Requests'}
            clickHandler={()=>{console.log("SEARCH CLICKED")}}
            icon={<img src={SearchSVG}/>}
          />
        </div>
        <div className="overflow-hidden grow flex flex-col gap-2 shrink-0">
          <h1 className="whitespace-nowrap text-gray-300">
            Recent Requests
          </h1>
          <StoredConversations />
        </div>
        <BottomFixedUserComponent />
      </aside>
      <main className="flex-1 h-full min-w-0 flex justify-center ${colorMap.bgSecondary} bg-stone-100">
        <ScrollingContainer/>
      </main>
    </div>
  );
}

export default App
