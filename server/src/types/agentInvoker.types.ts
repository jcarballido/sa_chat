import type { State } from "../agents/intentAgentState.js"

export type AgentInvokerType = {
  invoke: (s:string, t: string, i: string[]) => Promise<State>
}