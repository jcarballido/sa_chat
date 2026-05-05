import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { intentAgent }  from "../agents/intentAgent.js";
import { buildAgentInvoker, type AgentInvoker } from "../agents/agentInvoker.agents.js";

async function agentInvokerPlugin(fastify: FastifyInstance) {
  const agent = intentAgent
  const agentInvoker = buildAgentInvoker(agent)
  
  fastify.decorate("agent", agentInvoker)
}

export default fp(agentInvokerPlugin)

declare module "fastify"{
  interface FastifyInstance{
    agentInvoker: AgentInvoker
  }
}