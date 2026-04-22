import placeholderData from "../constants/placeholderData.constants"
import { useMessageStore } from "../stores/message.store"
import usePreviewMode from "./usePreviewMode.hooks"

const useAsideData = () => {
    const preview = usePreviewMode()
    const { conversations } = useMessageStore()

    if(preview) return placeholderData.conversations

    return conversations
}


export default useAsideData