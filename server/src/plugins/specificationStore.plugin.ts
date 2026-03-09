import type { FastifyInstance } from "fastify";
import { buildStoreGeneric } from "../infrastructure/buildStore.js";
import path from "node:path"
import fp from "fastify-plugin"
import type { CsvQuery } from "../types/types.js";

async function specificationStorePlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(), "data/modelSpec.csv")
  const schema = {
    "fire_rating_time": (t: string) => Number(t),
    "fire_rating_temp": (t: string) => Number(t),
    "height": (t: string) => Number(t),
    "depth": (t: string) => Number(t),
    "width": (t: string) => Number(t),
    "gun_count": (t: string) => Number(t),
    "waterproof": (t: string) => t === "TRUE"
  } as const
  const specificationStore = await buildStoreGeneric(filePath, schema)
  fastify.decorate("specificationStore", specificationStore)
}
export default fp(specificationStorePlugin) 
declare module 'fastify'{
  interface FastifyInstance{
      specificationStore: CsvQuery 
  }
}

