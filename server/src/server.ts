import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify"
import { checkModelAvailble, checkOllamaReachable } from "./services/llm.services.js"
import chatRoutes from "./routes/chat.routes.js"
import inventoryStorePlugin from "./plugins/inventoryStore.plugin.js"
import specificationStorePlugin from "./plugins/specificationStore.plugin.js"
import llmPlugin from "./plugins/chat.plugin.js"
import messageStorePlugin from "./plugins/messageStore.plugin.js"
import "dotenv/config"
import { request } from "node:http"
import z from "zod"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(inventoryStorePlugin)
fastify.register(specificationStorePlugin)
fastify.register(llmPlugin)
fastify.register(messageStorePlugin)
fastify.register(chatRoutes, { prefix: "/chat"})

fastify.post("/login/requestAccess",async(request:FastifyRequest)=>{
  console.log(request.body)
  const AccessRequest = z.object({
    req: z.string()
  })
  const body = AccessRequest.safeParse(request.body)
  if(body.error){
    console.log("BODY PARSE ERROR:")
    console.log(body.error)
    return "Error parsing request body."
  }
  console.log("Body succesfully parsed")
  const {req} = body.data
  return {d: `RECEIVED email: ${req}`}
})

const checkDependencies = async() => {
  try {
    await checkOllamaReachable()
    await checkModelAvailble() 
    console.log("Dependencies OK")
  } catch (error) {
    fastify.log.error(`Error in dependency check:\n + ${error}`)
    process.exit(1)
  }
}

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

checkDependencies()
start()