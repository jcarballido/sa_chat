import placeholderData from "../constants/placeholderData.constants"
import { useConversationStore } from "../stores/conversation.store"
import usePreviewMode from "./usePreviewMode.hooks"

const useData = () => {
    const preview = usePreviewMode()
    const { activeConversation } = useConversationStore()

    // console.log("FAKE ID:",placeholderData.activeId)

    const length = placeholderData.conversations.length
    const randInt = Math.floor((Math.random() * length) + 1)
    if(preview) return {activeConversation: placeholderData.conversations[randInt]}

    return { activeConversation }
}


export default useData