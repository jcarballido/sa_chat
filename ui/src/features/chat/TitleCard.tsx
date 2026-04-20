import { colorMap } from "../../constants/colorTheme.constants"

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

export default TitleCard