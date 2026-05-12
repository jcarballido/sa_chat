import type { State } from "../agents/intentAgentState.js"

export type AgentInvokerType = {
  invoke:(message:string, modelNumbers: string[], options?: {title: string | null,conversationId: string | null, newMessage: boolean}) => Promise<State>
}