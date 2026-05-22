import type { State } from "../agents/intentAgentState.js"

export type AgentInvokerType = {
  invoke:(
    message:string,
    modelNumbers: string[],
    title?: string 
  ) => Promise<State>
}