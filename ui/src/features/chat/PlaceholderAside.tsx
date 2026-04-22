import { colorMap } from "../../constants/colorTheme.constants"
import TitleCard from "./TitleCard"

const PlaceholderAside = () => {
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

export default PlaceholderAside