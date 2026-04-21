import { colorMap } from "../../constants/colorTheme.constants"
import SecondaryActionButton from "../../shared/SecondaryActionButton"
import BottomFixedUserComponent from "./BottomFixedUserComponent"
import StoredConversations from "./StoredConversations"
import TitleCard from "./TitleCard"
import PencilSVG from "../../assets/pencil.svg"
import SearchSVG from "../../assets/search.svg"
import { useMessageStore } from "../../stores/message.store"
import { useAuthStore } from "../../stores/auth.store"

const Authenticated = () => {

  const messageStore = useMessageStore()
  const { setActiveConversation } = messageStore

  const newChat = () => {
    console.log("NEW CHAT STARTED")
    setActiveConversation(null)
  }


  return (
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

  )
}

const DummyAside = () => {
  return (
          <aside className={`h-full ${colorMap.bgMain} flex flex-col gap-4 text-white p-2`}>
        <TitleCard />
        <div className="flex flex-col justify-start shrink-0">
          <SecondaryActionButton
            action={'New Request'}
            clickHandler={()=>{}} 
            icon={<img src={PencilSVG}/>}
          />
          <SecondaryActionButton
            action={'Search Requests'}
            clickHandler={()=>{}}
            icon={<img src={SearchSVG}/>}
          />
        </div>
        <div className="overflow-hidden grow flex flex-col gap-2 shrink-0">
          <h1 className="whitespace-nowrap text-gray-300">
            Recent Requests
          </h1>
          FAKE CONVERSATION
          {/* <StoredConversations /> */}
        </div>
        FAKE USER DATA
        {/* <BottomFixedUserComponent /> */}
      </aside>

  )
}

const Aside = () => {
  
  const { session } = useAuthStore()
    return !!session === false
    ? <DummyAside/>:<Authenticated/> 
}

export default Aside