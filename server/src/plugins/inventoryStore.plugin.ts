import type { FastifyInstance } from "fastify";
import { buildStore, type CsvQuery } from "../infrastructure/buildStore.js";
import path from "node:path";
import fp from "fastify-plugin"

async function inventoryStorePlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(),"data/inventory.csv")
  const inventoryStore = await buildStore(filePath)
  fastify.decorate("inventoryStore", inventoryStore)
}

export default fp(inventoryStorePlugin)

declare module "fastify" {
  interface FastifyInstance{
    inventoryStore: CsvQuery
  }
}

