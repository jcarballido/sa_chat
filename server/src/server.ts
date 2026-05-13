import Fastify, { type FastifyInstance } from "fastify"
import { checkModelAvailble, checkOllamaReachable } from "./services/ollama.services.js"
import chatRoutes from "./routes/chat.routes.js"
import "dotenv/config"
import loginRoutes from "./routes/login.routes.js"
import configPlugins from "./plugins/config.plugins.js"
import rowsPlugins from "./plugins/rows.plugins.js"
import lookupPlugins from "./plugins/lookup.plugin.js"
import agentPlugins from "./plugins/agent.plugins.js"
import servicesPlugins from "./plugins/services.plugins.js"
import domainExecutionPlugins from "./plugins/domainExecution.plugins.js"
import controllersPlugins from "./plugins/controllers.plugins.js"
import queriesPlugins from "./plugins/queries.plugins.js"
import { request } from "node:http"
import { verifyAuthJWT } from "./supabase/verifyAuthJWT.supabase.js"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.addHook("preHandler", async (request, reply) => {
  const token = request.headers.authorization?.replace("Bearer ","")
  if(!token) {return console.log("TOKEN MISSING")}
  const payload = await verifyAuthJWT(token)
  console.log("PAYLOAD:")
  console.log(payload)
})

fastify.register(configPlugins)
fastify.register(queriesPlugins)
fastify.register(rowsPlugins)
fastify.register(lookupPlugins)
fastify.register(domainExecutionPlugins)
fastify.register(agentPlugins)
fastify.register(servicesPlugins)
fastify.register(controllersPlugins)

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