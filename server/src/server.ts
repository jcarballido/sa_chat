import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"

const fastify: FastifyInstance = Fastify({
  logger: true
})

try {
  console.log("Attempting to connect with ollama")
  const res = await fetch("http://localhost:11434/api",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body:JSON.stringify({
      model: "llama3.1:latest",
      stream: false,
      messages:[{role:"user",content:"Where is Patagonia."}]
    })
  })
  console.log("Connection made, parsing response")
  
  const data = (await res.json()) as { reply: string }
  console.log("Ollama call:\n")
  console.log(data)
  
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