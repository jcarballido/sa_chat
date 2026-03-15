import type { State, Update } from "../state.js";

export async function outOfScopeIntentNode(state:State): Promise<Update> {
  return{
    outOfScopeIntent: true
  }
}