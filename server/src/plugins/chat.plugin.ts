import type { FastifyInstance } from "fastify";
import { buildLlmCall, type LLMcall } from "../infrastructure/buildLlmServices.js";
import fp from "fastify-plugin"

async function llmPlugin(fastify: FastifyInstance) {
  try {
    const inventoryModels = fastify.inventoryStore.getColumnValues("model")
    const filteredModels = inventoryModels.filter((x)=>x !== undefined)
    const llm = await buildLlmCall(filteredModels)
    fastify.decorate("llm",llm)    
  } catch (error) {
    throw error
  }

}

export default fp(llmPlugin)

declare module "fastify"{
  interface FastifyInstance{
    llm: LLMcall
  }
}
  


