import Fastify, { type FastifyInstance } from "fastify"
import llmPlugin from "./plugins/llm.plugin.js"
import { chatPlugin } from "./plugins/chat.plugin.js"
import { checkModelAvailble, checkOllamaReachable } from "./services/llm.services.js"
import chatRoutes from "./routes/chat.routes.js"
import { modelParsePlugin } from "./services/model-spec.services.js"
import path from "node:path"
import fs from "fs"
import parse from "csv-parser"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(llmPlugin)
fastify.register(chatRoutes, { prefix: "/chat"})
fastify.register(modelParsePlugin)
const dataPath = path.join(process.cwd(),"data/modelSpec.csv")
await fastify.modelParse(dataPath)
// console.log("Data path passed into parser: ", dataPath)
// modelParse(dataPath)
// fastify.decorate("modelParse", async(path: string) => {
//   fs.createReadStream(path)
//     .pipe(parse())
//     .on("data",(data) => {
//       console.log(data)
//     })
//     .on("end",() => {
//       console.log("File parsing complete.")
//     })
// })

// fastify.modelParse(dataPath)

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