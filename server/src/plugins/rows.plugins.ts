import type { FastifyInstance } from "fastify";
import { excelReader } from "../excelReader.js";
import { InventoryRowSchema, SpecRowSchema, type InventoryRowType, type SpecRowType } from "../types/stores.types.js";
import fp from "fastify-plugin";

async function storesPlugin(fastify:FastifyInstance) {
  const inventoryRows = await excelReader(fastify.config.inventoryFilePath, InventoryRowSchema)
  const specRows = await excelReader(fastify.config.specFilePath,SpecRowSchema)
  
  fastify.decorate("inventoryRows", inventoryRows)
  fastify.decorate("specRows", specRows)
}

export default fp(storesPlugin)

declare module "fastify"{
  interface FastifyInstance{
    inventoryRows: {rows: InventoryRowType[],normalizedColumnMap: <K extends keyof InventoryRowType>(columnName: K) => Map<any,any>},
    specRows: {rows:SpecRowType[], normalizedColumnMap: <K extends keyof SpecRowType>(columnName: K) => Map<any,any>}
  }
}