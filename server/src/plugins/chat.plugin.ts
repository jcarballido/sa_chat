import type { FastifyInstance } from "fastify";

export async function chatPlugin(fastify: FastifyInstance) {
  fastify.post("/", async (req, reply) => {
    const { message } = req.body as { message: string }

    // use the decorator
    const response = await fastify.runLLM(message)

    return { message: response }
  })
}