import type { FastifyInstance } from "fastify";
import { buildStoreGeneric } from "../infrastructure/buildStore.js";
import path from "node:path"
import fp from "fastify-plugin"
import type { SpecificationStore } from "../types/types.js";

export const specificationSchema = {
  "model":(t:string) => t,
  "fire_rating_time": (t: string) => Number(t),
  "fire_rating_temp": (t: string) => Number(t),
  "height": (t: string) => Number(t),
  "gun_count": (t: string) => Number(t),
  "width": (t: string) => Number(t),
  "depth": (t: string) => Number(t),
  "waterproof": (t: string) => t.toLowerCase() === "true" 
  
} as const

async function specificationStorePlugin(fastify:FastifyInstance) {
  const filePath = path.join(process.cwd(), process.env.SPEC_SHEET)
  const REQUIRED_HEADERS = Object.keys(specificationSchema) as (keyof typeof specificationSchema)[]
  const specificationStore = await buildStoreGeneric(filePath, specificationSchema, REQUIRED_HEADERS)
  // const thing = specificationStore.getColumnValues("depth")
  fastify.decorate("specificationStore", specificationStore)
}
export default fp(specificationStorePlugin) 
declare module 'fastify'{
  interface FastifyInstance{
      specificationStore: SpecificationStore 
  }
}

