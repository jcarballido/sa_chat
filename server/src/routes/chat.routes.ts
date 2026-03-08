import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { buildChatController } from "../controllers/chat.controllers.js";
import { buildServices } from "../services/chat.services.js";
import { buildDomainExecutionServices } from "../infrastructure/buildDomainExecutionService.js";

const chatRoutes: FastifyPluginAsync = async function (fastify: FastifyInstance) {

  const domainExecutionServices = buildDomainExecutionServices(fastify.inventoryStore, fastify.specificationStore, fastify.messageStore )
  const services = buildServices(fastify.llm, domainExecutionServices)
  const controller = buildChatController(services)

  fastify.post("/", controller.processMessage)
}

export default fp(chatRoutes)

