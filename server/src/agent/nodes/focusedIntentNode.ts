import type { State } from "../state.js";

export async function focusedIntentNode(state:State) {
  return {
    focusedIntent: true,
    adjacentIntent: false,
    outOfScopeIntent: false,
    maliciousIntent: false
  }
}