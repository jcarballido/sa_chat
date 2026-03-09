import type { FastifyInstance } from "fastify";
import { buildStoreGeneric } from "../infrastructure/buildStore.js";
import path from "node:path";
import fp from "fastify-plugin"
import type { CsvQuery } from "../types/types.js";

async function inventoryStorePlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(),"data/inventory.csv")
  const schema = {
    "model": (t: string) => t,
    "origin": (t: string) => t,
    "height": (t: string) => Number(t),
  }
  const inventoryStore = await buildStoreGeneric(filePath,schema)
  fastify.decorate("inventoryStore", inventoryStore)
}

export default fp(inventoryStorePlugin)

declare module "fastify" {
  interface FastifyInstance{
    inventoryStore: CsvQuery
  }
}

