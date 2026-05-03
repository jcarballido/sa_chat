import type { FastifyInstance, FastifyRequest } from "fastify";
import { AccessRequest } from "../schemas/schemas.js";

export function buildLoginController(loginServices: FastifyInstance["services"]["loginServices"] ){

  async function requestMagicLink(request: FastifyRequest) {
    console.log("Request: requestMagicLink")
    console.log(request.body)
    const response = await loginServices.processMagicLinkRequest(request.body)
    console.log("RESULT FROM MAGIC LINK REQUEST:")
    console.log(JSON.stringify(response))

    return {
      status:"Request for magic link processed.",
    }
  }

  return {
    requestMagicLink
  }
}

export type LoginController = ReturnType<typeof buildLoginController>