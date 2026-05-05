import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { buildDomainExecution, type DomainExecutionType } from "../services/domainExecution.services.js";

async function domainExecutionPlugin(fastify: FastifyInstance) {
  const domainExecution = buildDomainExecution(fastify.inventoryQuery, fastify.specQuery)

  fastify.decorate("domainExecution",domainExecution)
}

export default fp(domainExecutionPlugin)

declare module "fastify"{
  interface FastifyInstance{
    domainExecution: DomainExecutionType
  }
}