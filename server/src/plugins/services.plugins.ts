import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { buildChatServices, type ChatServices } from "../services/chat.services.js";
import { buildLoginServices, type LoginServices } from "../services/login.services.js";

async function servicesPlugins(fastify:FastifyInstance) {
  const chatServices = await buildChatServices(fastify.inventoryQuery, fastify.specQuery)
  const loginServices = buildLoginServices()

  fastify.decorate("chatServices",chatServices)
  fastify.decorate("loginServices", loginServices)
}

export default fp(servicesPlugins)

declare module "fastify"{
  interface FastifyInstance {
    services:{
      chatServices: ChatServices,
      loginServices: LoginServices
    }
  }
}