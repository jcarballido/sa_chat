import type { State, Update } from "../state.js";

export async function maliciousIntentNode(state:State): Promise<Update> {
  return{
    maliciousIntent: true,
    outOfScopeIntent: false,
    adjacentIntent: false,
  }
}