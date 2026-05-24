import dotenv from "dotenv"
import {defineConfig} from "drizzle-kit"

dotenv.config()

console.log("drizzle config test: ",process.env.DATABASE_URL)

export default defineConfig({
  out:"./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials:{
    url: process.env.DATABASE_URL!
  }
})