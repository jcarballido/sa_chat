import type { FastifyPluginAsync } from "fastify";
import { createChat } from "../controllers/chat.controllers.js";
import fastifyPlugin from "fastify-plugin";

const chatRoutes: FastifyPluginAsync = async function (fastify) {
  fastify.post("/", createChat)
}

export default fastifyPlugin(chatRoutes)

declare module 'fastify' {
  interface FastifyInstance {
    runLLM(prompt:string): Promise<string>
  }
}
