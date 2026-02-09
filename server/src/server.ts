import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"
import ollama from "ollama"

const fastify: FastifyInstance = Fastify({
  logger: true
})

try {
  console.log("Attempting to connect with ollama")
  const res = await ollama.chat({
    model: "llama3.1",
    stream: false,
    messages:[{role:"user",content:"Where is Patagonia."}]
  })
  console.log("Connection made, parsing response")
  
  console.log("Ollama call:\n")
  console.log(res)
  
} catch (error) {
  console.log('Error\n',error)  
}

fastify.get('/api/get', async(request,reply) => {
  return {message: "Hello World"}
})

fastify.post('/api/submit', async(request,reply) => {
  const body = request.body
  return {message: `Message received. Body is: ${body}`}
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