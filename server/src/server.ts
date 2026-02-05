import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.get('/', async(request,reply) => {
  return {message: "Hello World"}
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