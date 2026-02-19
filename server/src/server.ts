import Fastify, { type FastifyInstance } from "fastify"
import { request } from "node:http"
import ollama from "ollama"
import type  { Message, ChatMessage, ChatModels } from "./types/types.js"
import { createMessageStorage } from "./services/message-store.js"
import llmPlugin from "./plugins/llm.plugin.js"
import { chatPlugin } from "./plugins/chat.plugin.js"
import { checkModelAvailble, checkOllamaReachable } from "./services/llm.services.js"

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(llmPlugin)
declare module 'fastify' {
  interface FastifyInstance {
    testDecorator(): Promise<void>
  }
}
fastify.register(async(fastify)=>{
  fastify.decorate("testDecorator",async() => {
    console.log("Check for functioning test Decorator")
  })
})

fastify.register(chatPlugin)



const checkDependencies = async() => {
  try {
    await checkOllamaReachable()
    await checkModelAvailble() 
    console.log("Dependencies OK")
  } catch (error) {
    console.log("Error in dependency check:\n")
    console.log(error)
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