import type { State } from "../state.js";

export async function adjacentIntentNode(state:State) {
  return {
    adjacentIntent: true,
    maliciousIntent:false,
    outOfScopeIntent: false,
    focusedIntent: false
  }
}