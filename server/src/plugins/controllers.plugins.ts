import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { buildChatController, type ChatController } from "../controllers/chat.controllers.js";
import { buildLoginController, type LoginController } from "../controllers/login.controllers.js";

async function controllersPlugin(fastify:FastifyInstance) {
  const chatController = buildChatController(fastify.services.chatServices)
  const loginController = buildLoginController(fastify.services.loginServices)

  fastify.decorate("controllers",{
    chat: chatController,
    login: loginController
  })
}

export default fp(controllersPlugin)

declare module "fastify"{
  interface FastifyInstance{
    controllers:{
      chat: ChatController,
      login: LoginController
    }
  }
}