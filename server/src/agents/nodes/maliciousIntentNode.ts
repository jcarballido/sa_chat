import type { State, Update } from "../intentAgentState.js";

export async function maliciousIntentNode(state:State): Promise<Update> {
  return{
    maliciousIntent: true,
    outOfScopeIntent: false,
    relatedIntent: false,
  }
}