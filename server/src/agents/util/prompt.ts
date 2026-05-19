import ollama from "ollama"
import type { AssistantMessageType, UserMessageType } from "../../types/message.types.js"
import type { SystemMessage } from "@langchain/core/messages"

export async function prompt(conversation:(UserMessageType | AssistantMessageType | SystemMessage)[],option?:{initialMessage?:string,systemPrompt?: string}) {

  if(option?.initialMessage){

  }
  const messages = option?.systemPrompt && option?.initialMessage ? [
    {role: "system", content: option.systemPrompt},
    {role: "user", content: option.initialMessage}
  ] : [
    { role: "user", content:"dflkj"}
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