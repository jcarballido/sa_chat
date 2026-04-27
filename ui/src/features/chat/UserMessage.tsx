import { colorMap } from "../../constants/colorTheme.constants"
import type { UserMessageType } from "../../types/message.schema"

const UserMessage = ({userMessage}:{userMessage: UserMessageType}) => {
  return (
    <div className={`my-2 bg-transparent flex justify-end text-[#f5f5f5] font-semibold`}>
      <div className={`${colorMap.accent} bg-[e0242e] max-w-[60%] border border-gray-600 p-3 rounded-xl`}>
          {userMessage.content}
      </div>
    </div>
  )
}

export default UserMessage