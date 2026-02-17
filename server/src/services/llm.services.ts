import ollama from "ollama"

export async function llm(prompt:string) {
  console.log("Sending prompt to ollama")
  const res = await ollama.chat({
    model: "llama3.1",
    stream: false,
    messages:[{role:"user",content:prompt}]
  })
  return res.message.content
}