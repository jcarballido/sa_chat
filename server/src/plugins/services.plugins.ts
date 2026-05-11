import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { buildChatServices, type ChatServices } from "../services/chat.services.js";
import { buildLoginServices, type LoginServices } from "../services/login.services.js";

async function servicesPlugins(fastify:FastifyInstance) {
  console.log("LOADING SERVICES PLUGIN")
  const chatServices = buildChatServices(fastify.inventoryQuery, fastify.specQuery, fastify.agent,fastify.domainExecution, fastify.queries)
  const loginServices = buildLoginServices()

  fastify.decorate("services",{
    chatServices,
    loginServices
  })
}

export default fp(servicesPlugins)

declare module "fastify"{
  interface FastifyInstance {
    services:{
      chatServices: ChatServices,
      loginServices: LoginServices,
    }
  }
}