import type { FastifyInstance } from "fastify";
import { buildParser } from "../parsers/buildParser.js";

async function parsersPlugin(fastify:FastifyInstance) {
  const inventory = await buildParser(fastify.config.inventoryFilePath,requiredHeaders)
}