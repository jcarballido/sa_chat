import parse from "csv-parser"
import type { FastifyInstance } from "fastify"
import fs from "fs"
import fp from "fastify-plugin"

export async function modelParsePlugin(fastify: FastifyInstance){
  fastify.decorate("modelParse", async(path: string) => {
    fs.createReadStream(path)
      .pipe(parse())
      .on("data",(data) => {
        console.log(data)
      })
      .on("end",() => {
        console.log("File parsing complete.")
      })
  })
} 

export default fp(modelParsePlugin)

declare module "fastify"{
  interface FastifyInstance {
    modelParse(path: string): Promise<void>
  }
}

