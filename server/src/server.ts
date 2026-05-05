import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify"
import { checkModelAvailble, checkOllamaReachable } from "./services/ollama.services.js"
import chatRoutes from "./routes/chat.routes.js"
import inventoryStorePlugin from "./plugins/inventoryStore.plugin.js"
import specificationStorePlugin from "./plugins/specificationStore.plugin.js"
import llmPlugin from "./plugins/chat.plugin.js"
import messageStorePlugin from "./plugins/messageStore.plugin.js"
import "dotenv/config"
import loginRoutes from "./routes/login.routes.js"
import configPlugins from "./plugins/config.plugins.js"
import rowsPlugins from "./plugins/rows.plugins.js"
import lookupPlugins from "./plugins/lookup.plugin.js"
import agentPlugins from "./plugins/agent.plugins.js"
import servicesPlugins from "./plugins/services.plugins.js"
import domainExecutionPlugins from "./plugins/domainExecution.plugins.js"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(configPlugins)
fastify.register(rowsPlugins)
fastify.register(lookupPlugins)
fastify.register(domainExecutionPlugins)
fastify.register(agentPlugins)
fastify.register(servicesPlugins)

// fastify.register(inventoryStorePlugin)
// fastify.register(specificationStorePlugin)
// fastify.register(llmPlugin)
// fastify.register(messageStorePlugin)
fastify.register(chatRoutes, { prefix: "/chat"})
fastify.register(loginRoutes, {prefix:"/login"})

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