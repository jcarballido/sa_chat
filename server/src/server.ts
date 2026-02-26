import Fastify, { type FastifyInstance } from "fastify"
import { checkModelAvailble, checkOllamaReachable } from "./services/llm.services.js"
import chatRoutes from "./routes/chat.routes.js"
import inventoryStorePlugin from "./plugins/inventoryStore.plugin.js"
import specificationStorePlugin from "./plugins/specificationStore.plugin.js"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(inventoryStorePlugin)
fastify.register(specificationStorePlugin)
fastify.register(chatRoutes, { prefix: "/chat"})

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