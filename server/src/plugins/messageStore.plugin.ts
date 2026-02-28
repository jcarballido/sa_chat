import type { FastifyInstance } from "fastify";
import { buildMessageStore, type MessageStore } from "../infrastructure/buildMessageStore.js";
import fp from "fastify-plugin"

async function messageStorePlugin(fastify:FastifyInstance) {
  const store = buildMessageStore()

  fastify.decorate("messageStore", store)
}

export default fp(messageStorePlugin)

declare module "fastify"{
  interface FastifyInstance{
    messageStore: MessageStore
  }
}