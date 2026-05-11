import ollama from "ollama"
import type { AssistantMessageType, UserMessageType } from "../../types/message.types.js"
import type { SystemMessage } from "@langchain/core/messages"

export async function prompt(conversation:(UserMessageType | AssistantMessageType | SystemMessage)[],option?:{initialMessage?:boolean,systemPrompt?: string}) {

  if(option?.initialMessage){

  }
  const messages = option ? [
    {role: "system", content: option.systemPrompt},
    {role: "user", content: message}
  ] : [
    { role: "user", content:message}
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