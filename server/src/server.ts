import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"
import ollama from "ollama"

const fastify: FastifyInstance = Fastify({
  logger: true
})

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


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()