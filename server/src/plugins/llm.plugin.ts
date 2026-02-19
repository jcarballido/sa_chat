import { type FastifyInstance} from "fastify";
import type { Message } from "../types/types.js";
import { llm } from "../services/llm.services.js";
import fp from "fastify-plugin"

async function llmPlugin(fastify:FastifyInstance) {
  fastify.decorate("runLLM", async(prompt: string) => {
    const response = await llm(prompt)
    return `LLM RESPONE:${response}` 
  })
}

export default fp(llmPlugin)

declare module 'fastify' {
  interface FastifyInstance {
    runLLM(prompt:string): Promise<string>
  }
}