import type { FastifyInstance } from "fastify";
import { buildStore, type CsvQuery } from "../store/buildStore.js";
import path from "node:path"
import fp from "fastify-plugin"

async function specificationStorePlugin(fastify:FastifyInstance) {
    const filePath = path.join(process.cwd(), "data/specifications.csv")
    const specificationStore = await buildStore(filePath)

    fastify.decorate("specificationStore", specificationStore)
}

export default fp(specificationStorePlugin) 

declare module 'fastify'{
    interface FastifyInstance{
        specificationStore: CsvQuery 
    }
}

