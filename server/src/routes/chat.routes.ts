import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { buildChatController } from "../controllers/chat.controllers.js";
import { buildChatService } from "../services/chat.services.js";

const chatRoutes: FastifyPluginAsync = async function (fastify: FastifyInstance) {

  const service = buildChatService(fastify.inventoryStore, fastify.specificationStore, fastify.llm, fastify.messageStore)
  const controller = buildChatController(service)

  fastify.post("/", controller.processMessage)
}

export default fp(chatRoutes)

