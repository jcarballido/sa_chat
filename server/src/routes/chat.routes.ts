import type { FastifyInstance } from "fastify";
import { buildChatController } from "../controllers/chat.controllers.js";
import { buildServices } from "../services/chat.services.js";
import { buildDomainExecutionServices } from "../infrastructure/buildDomainExecutionService.js";

async function chatRoutes (fastify: FastifyInstance) {

  const domainExecutionServices = buildDomainExecutionServices(fastify.inventoryStore, fastify.specificationStore, fastify.messageStore )
  const services = buildServices(fastify.llm, domainExecutionServices)
  const controller = buildChatController(services)

  fastify.post("/index", controller.processMessage)
  fastify.post("/test",controller.test)
}

export default chatRoutes

