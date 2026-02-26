import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { buildChatService } from "../services/chat.services.js";
import { buildChatController } from "../controllers/chat.controllers.js";

const chatRoutes: FastifyPluginAsync = async function (fastify: FastifyInstance) {
  
  const service = buildChatService(fastify.inventoryStore, fastify.specificationStore)
  const controller = buildChatController(service)

  fastify.post("/", controller.chat)
}

export default fp(chatRoutes)

