import ollama from "ollama"
import type { State, Update } from "../state.js"
import { MODEL } from "../../constants/constants.js"

export async function classifyInitialMessageNode(state: State): Promise<Update>{

  const response = await ollama.chat({
    model:MODEL,
    stream: false,
    messages:[
      ...state.messages,
      {role: "user", content: state.initialMessage}
    ]
  })
  
  return{
    
  }
}