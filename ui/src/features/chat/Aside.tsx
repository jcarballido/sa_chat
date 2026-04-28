import { colorMap } from "../../constants/colorTheme.constants"
import SecondaryActionButton from "../../shared/SecondaryActionButton"
import BottomFixedUserComponent from "./BottomFixedUserComponent"
import StoredConversations from "./StoredConversations"
import TitleCard from "./TitleCard"
import PencilSVG from "../../assets/pencil.svg"
import SearchSVG from "../../assets/search.svg"
import { useMessageStore } from "../../stores/message.store"
import useInteraction from "../../hooks/useInteraction.hooks"

const Aside = () => {

  const setActiveConversation  = useMessageStore(s => s.setActiveConversation)
  const { disabled } = useInteraction()

  const newChat = () => {
    console.log("NEW CHAT STARTED")
    setActiveConversation(null)
  }
  
  return(
    <aside className={`h-full ${colorMap.bgMain} flex flex-col gap-4 text-white p-2`}>
      <TitleCard />
      <div className="flex flex-col justify-start shrink-0">
        <SecondaryActionButton
          action={'New Request'}
          clickHandler={newChat} 
          disabled={disabled}
          icon={<img src={PencilSVG}/>}
        />
        <SecondaryActionButton
          action={'Search Requests'}
          clickHandler={()=>{console.log("SEARCH CLICKED")}}
          disabled={disabled}
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
  )
}

export default Aside