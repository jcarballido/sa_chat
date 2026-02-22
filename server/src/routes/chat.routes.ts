import type { FastifyPluginAsync } from "fastify";
import { extractModelNumber } from "../controllers/chat.controllers.js";
import fastifyPlugin from "fastify-plugin";

const chatRoutes: FastifyPluginAsync = async function (fastify) {
  fastify.post("/", extractModelNumber)
}

export default fastifyPlugin(chatRoutes)

