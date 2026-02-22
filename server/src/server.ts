import Fastify, { type FastifyInstance } from "fastify"
import llmPlugin from "./plugins/llm.plugin.js"
import { checkModelAvailble, checkOllamaReachable } from "./services/llm.services.js"
import chatRoutes from "./routes/chat.routes.js"
import path from "node:path"
import { modelParse } from "./services/model-spec.services.js"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(llmPlugin)
fastify.register(chatRoutes, { prefix: "/chat"})
const dataPath = path.join(process.cwd(),"data/modelSpec.csv")
const modelLookup = modelParse(dataPath)

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