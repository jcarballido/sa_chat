import { type FastifyInstance } from "fastify"
import { loadCsv, type CsvQuery } from "../services/model-spec.services.js"
import path from "node:path"
import fp from "fastify-plugin"

async function inventoryPlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(),"data/model_number.csv")
  const inventoryStore = await loadCsv(filePath)

  fastify.decorate("inventoryStore",inventoryStore)
} 

export default fp(inventoryPlugin)

declare module 'fastify'{
  interface FastifyInstance{
    inventoryStore: CsvQuery
  }
}