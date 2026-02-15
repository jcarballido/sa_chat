import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"
import ollama from "ollama"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.get('/api/get', async(request,reply) => {
  return {message: "Hello World"}
})

type Message = {
  role:"SYSTEM"|"USER"|"ASSISTANT",
  content:string
}

const createMessageStorage = () => {
  let messages:Message[] = [
    {
      role:"SYSTEM",
      content:"You are a customer service representative assistant who can traverse documents and return the most accurate response to a rep's question."
    }
  ]

  return {
    getMessages: () => messages,
    addMessage: (newMessage: Message) => messages.push(newMessage),
    
  }
}

const askOllama = async (message: string) => {
  console.log("Attempting to connect with ollama")
  const res = await ollama.chat({
    model: "llama3.1",
    stream: false,
    messages:[{role:"user",content:message}]
  })
  return res.message.content
}

type ChatMessage = {
  message: string
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

type ChatModels = {
  models: {name: string}[]
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