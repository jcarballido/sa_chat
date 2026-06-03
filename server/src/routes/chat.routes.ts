import type { FastifyInstance } from "fastify";
import { verifyAuthJWT } from "../supabase/verifyAuthJWT.supabase.js";
// import { buildChatController } from "../controllers/chat.controllers.js";
// import { buildServices } from "../services/chat.services.js";
// import { buildDomainExecutionServices } from "../infrastructure/buildDomainExecutionService.js";

async function chatRoutes (fastify: FastifyInstance) {

  // const domainExecutionServices = buildDomainExecutionServices(fastify.inventoryStore, fastify.specificationStore, fastify.messageStore )
  // const services = buildServices(fastify.llm, domainExecutionServices)
  // const controller = buildChatController(services)
  fastify.addHook("preHandler", async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ","")
    if(!token) return reply.code(401).send({ error: "Missing auth headers" })
    const payload = await verifyAuthJWT(token)
    if(!payload) return reply.code(401).send({ error: "Unathorized" })
    request.user = {sub: payload.sub}
  })

  console.log("LOADING CHATROUTES")
  fastify.post("/process", fastify.controllers.chat.processMessage)
  fastify.get("/getStoredConversations", fastify.controllers.chat.getStoredConversationMetadata)
  fastify.get("/conversations/:id", fastify.controllers.chat.getStoredConversation)
}

export default chatRoutes

