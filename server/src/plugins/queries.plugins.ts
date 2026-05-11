import type { FastifyInstance } from "fastify";
import { buildQueries, type QueriesType } from "../db/queries.js";
import fp from "fastify-plugin";

async function queriesPlugin(fastify: FastifyInstance) {
  const queries = buildQueries()

  fastify.decorate("queries", queries)
}

export default fp(queriesPlugin)

declare module "fastify"{
  interface FastifyInstance{
    queries: QueriesType
  }
}