import ollama from "ollama"
export async function askLLM(message:string,option?:{systemPrompt: string}) {

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