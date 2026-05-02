import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import fp from "fastify-plugin";
import type { ConfigType } from "../types/config.types.js";

async function configPlugin(fastify: FastifyInstance){
  fastify.decorate("config", config)
}

export default fp(configPlugin)

declare module "fastify"{
  interface FastifyInstance{
    config: ConfigType
  }
}