import type { FastifyInstance } from "fastify";
import { buildStoreGeneric } from "../infrastructure/buildStore.js";
import path from "node:path";
import fp from "fastify-plugin"
import type { InventoryStore } from "../types/types.js";
import { keyof } from "zod";

export const inventorySchema = {
  "model": (t: string) => t,
  // "origin": (t: string) => t,
  // "height": (t: string) => Number(t),
} as const

async function inventoryStorePlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(),"data/model_number.csv")
  const REQUIRED_HEADERS = Object.keys(inventorySchema) as (keyof typeof inventorySchema)[]
  const inventoryStore = await buildStoreGeneric(filePath,inventorySchema, REQUIRED_HEADERS)
  fastify.decorate("inventoryStore", inventoryStore)
}

export default fp(inventoryStorePlugin)

declare module "fastify" {
  interface FastifyInstance{
    inventoryStore: InventoryStore
  }
}

