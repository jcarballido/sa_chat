import type { FastifyRequest } from "fastify";
import { AccessRequest } from "../schemas/schemas.js";

export function buildLoginController(services: Awaited<ReturnType<typeof import("../infrastructure/buildLoginServices.js").buildLoginServices>>){

  async function requestMagicLink(request: FastifyRequest) {
    console.log("Request: requestMagicLink")
    console.log(request.body)
    const response = await services.processMagicLinkRequest(request.body)
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