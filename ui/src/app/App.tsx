import { useState, type MouseEventHandler, type ReactNode } from "react";
import BottomFixedUserComponent from "../features/chat/BottomFixedUserComponent";
import ScrollingContainer from "../features/chat/ScrollingContainer";
import StoredConversations from "../features/chat/StoredConversations";
import { useMessageStore } from "../stores/message.store";
import { colorMap } from "../constants/colorTheme.constants";
import PencilSVG from "../assets/pencil.svg"
import SearchSVG from "../assets/search.svg"
import SecondaryActionButton from "../shared/SecondaryActionButton";

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

  const TitleCard = () => {
    return (
      <div className="flex gap-4 px-2">
        <div className={`aspect-square h-full ${colorMap.accent}`} ></div>
        <div className="">
          <div className="text-lg">
            sa_chat
          </div>
          <div className="text-sm italic">
            A lookup assistant
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="flex h-screen w-screen">
      <aside className={`max-h-full ${colorMap.bgMain} flex flex-col gap-4 text-white p-2`}>
        {/* <TitleCard> */}
        <TitleCard />
        <div className="flex flex-col justify-start">
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
        <div className="overflow-hidden grow flex flex-col gap-2">
          <h1 className="whitespace-nowrap text-gray-300 px-2">
            Recent Requests
          </h1>
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
