import { colorMap } from "../../constants/colorTheme.constants"
import type { UserMessageType } from "../../types/message.schema"

const UserMessage = ({userMessage}:{userMessage: UserMessageType}) => {
  return (
    <div className={`my-2 bg-transparent flex justify-end text-white`}>
      <div className={`${colorMap.accent} max-w-[60%]`}>
          {userMessage.content}
      </div>
    </div>
  )
}

export default UserMessage