import placeholderData from "../constants/placeholderData.constants"
import { useMessageStore } from "../stores/message.store"
import usePreviewMode from "./usePreviewMode.hooks"

const useData = () => {
    const preview = usePreviewMode()
    const { conversations, activeConversationId } = useMessageStore()

    console.log("FAKE ID:",placeholderData.activeId)

    if(preview) return {conversations: placeholderData.conversations, activeConversationId:placeholderData.activeId}

    return { conversations, activeConversationId }
}


export default useData