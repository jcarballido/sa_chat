import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { buildInventoryQuery } from "../queries/inventoryQuery.queries.js";
import { buildSpecQuery } from "../queries/specQuery.queries.js";

async function lookupPlugin(fastify:FastifyInstance) {
  const inventoryQuery = buildInventoryQuery(fastify.inventoryRows)  
  const specQuery = buildSpecQuery(fastify.specRows)

  fastify.decorate("inventoryQuery",inventoryQuery)
  fastify.decorate("specQuery", specQuery)
}

export default fp(lookupPlugin)

declare module "fastify"{
  interface FastifyInstance{
    inventoryQuery:ReturnType<typeof buildInventoryQuery>,
    specQuery:ReturnType<typeof buildSpecQuery>
  }
}

