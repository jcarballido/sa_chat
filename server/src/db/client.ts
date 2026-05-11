import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from '../config.js'

const connectionURL = config.dbConnectionString

const client = postgres(connectionURL)
export const db = drizzle({ client })

