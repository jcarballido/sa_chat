import { useEffect, useRef } from "react";
import type { ConversationType } from "../types/conversation.schema";

export const useConversationSentinel = (dependency: ConversationType[]) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = ref.current
    if(!sentinel) return
    sentinel.scrollIntoView({behavior: "smooth"})
  },[dependency])

  return ref
}