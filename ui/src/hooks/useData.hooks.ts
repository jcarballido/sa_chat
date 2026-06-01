import placeholderData from "../constants/placeholderData.constants"
import { useConversationStore } from "../stores/conversation.store"
import type { ConversationType, DefinedConversationMetadataType } from "../types/conversation.schema"
import usePreviewMode from "./usePreviewMode.hooks"

const useData = (): {activeConversation: ConversationType, storedConversations: DefinedConversationMetadataType} => {
    const preview = usePreviewMode()
    const { activeConversation,storedConversationMetadata } = useConversationStore()

    // console.log("FAKE ID:",placeholderData.activeId)

    const length = placeholderData.conversations.length
    const randInt = Math.floor((Math.random() * length) + 1)
    if(preview) return {activeConversation: placeholderData.conversations[randInt], storedConversations: placeholderData.conversationMetadata}

    return { activeConversation, storedConversations: storedConversationMetadata }
}


export default useData