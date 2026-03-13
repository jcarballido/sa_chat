// import type { AgentStateType } from "../state.js";
import type { State, Update } from "../state.js"
import { ask } from "../util/ask.js";

export async function collectIntentNode(state: State): Promise<Update>{
  
  const initialPrompt = await ask('What do you want built?\nType "exit" to end session.\n')

  if(initialPrompt === "exit"){
    return{
      "exited": {
        "status": true,
        "node":"collectIntentNode"
      }
    }
  }

  return{
    initialIntent: initialPrompt
  }
}