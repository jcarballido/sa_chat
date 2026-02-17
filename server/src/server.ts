import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"
import ollama from "ollama"
import type  { Message, ChatMessage, ChatModels } from "./types/types.js"
import { createMessageStorage } from "./services/message-store.js"
import { llmPlugin } from "./plugins/llm.plugin.js"
import { chatPlugin } from "./plugins/chat.plugin.js"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(llmPlugin)
fastify.register(chatPlugin)


fastify.get('/api/get', async(request,reply) => {
  return {message: "Hello World"}
})

const askOllama = async (message: string) => {
  console.log("Attempting to connect with ollama")
  const res = await ollama.chat({
    model: "llama3.1",
    stream: false,
    messages:[{role:"user",content:message}]
  })
  return res.message.content
}


fastify.post('/api/submit', async(request,reply) => {
  const body = request.body as ChatMessage
  try {
    const res = await askOllama(body.message)
    return {res}   
  } catch (error) {
    console.log("error:", error)
    return {error: `${error}`}
  }
})

const checkOllamaReachable = async () => {
  try {
    const res = await fetch("http://localhost:11434")
    return res.ok     
  } catch (error) {
    throw error
  }
}


const checkModelAvailble = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags")
    if(!response) throw new Error("Zero models available.")
    const data = (await response.json()) as ChatModels
    if(data.models.some(model => model.name.includes("llama"))) return true
  } catch (error) {
    throw error    
  }
}

const checkDependencies = async() => {
  try {
    await checkOllamaReachable()
    await checkModelAvailble() 
    console.log("Dependencies OK")
  } catch (error) {
    console.log("Error in dependency check:\n")
    console.log(error)
  }
}


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

checkDependencies()
start()