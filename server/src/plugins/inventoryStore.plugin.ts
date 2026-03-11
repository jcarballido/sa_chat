import type { FastifyInstance } from "fastify";
import { buildStoreGeneric } from "../infrastructure/buildStore.js";
import path from "node:path";
import fp from "fastify-plugin"
import type { InventoryStore } from "../types/types.js";

export const inventorySchema = {
  "model": (t: string) => t,

}

async function inventoryStorePlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(),"data/model_number.csv")
  const inventoryStore = await buildStoreGeneric(filePath,inventorySchema)
  fastify.decorate("inventoryStore", inventoryStore)
}

export default fp(inventoryStorePlugin)

declare module "fastify" {
  interface FastifyInstance{
    inventoryStore: InventoryStore
  }
}

