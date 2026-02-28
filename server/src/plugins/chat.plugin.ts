import type { FastifyInstance } from "fastify";
import { buildLlmCall, type LLMcall } from "../infrastructure/buildLlmCall.js";
import fp from "fastify-plugin"

async function llmPlugin(fastify: FastifyInstance) {
  
  const llm = await buildLlmCall()

  fastify.decorate("llm",llm)
}

export default fp(llmPlugin)

declare module "fastify"{
  interface FastifyInstance{
    llm: LLMcall
  }
}
  


