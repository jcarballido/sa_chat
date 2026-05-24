import ollama from "ollama"
// import type { AssistantMessageType, UserMessageType } from "../../types/message.types.js"
import type { SystemMessage } from "@langchain/core/messages"

export async function prompt(initialMessage:string, systemPrompt: string) {

  const messages = [
    {role: "system", content:systemPrompt},
    {role: "user", content: initialMessage}
  ]
  try {
    const response = await ollama.chat({
      model:process.env.MODEL,
      stream: false,
      messages,
      format:"json"
    })

    return response

  } catch (error) {
    throw error
  }
}