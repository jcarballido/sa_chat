import type { State, Update } from "../intentAgentState.js";

export async function outOfScopeIntentNode(state:State): Promise<Update> {
  return{
    outOfScopeIntent: true
  }
}