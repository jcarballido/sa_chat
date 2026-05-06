import { ConsoleCallbackHandler } from "@langchain/core/tracers/console"
import fastify, { type FastifyInstance } from "fastify"
// import { buildLoginServices } from "../infrastructure/buildLoginServices.js"
// import { buildLoginController } from "../controllers/login.controllers.js"

async function loginRoutes(fastify: FastifyInstance){

  // const services = await buildLoginServices()
  // const controller = buildLoginController(services)

  fastify.post("/requestAccess",fastify.controllers.login.requestMagicLink)

}

export default loginRoutes
