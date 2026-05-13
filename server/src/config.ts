import requireEnv from "./requireEnv.js";

export const config = {
  inventoryFilePath: requireEnv("INVENTORY_SHEET"),
  specFilePath:requireEnv("SPEC_SHEET"),
  dbConnectionString: requireEnv("DATABASE_URL"), 
  supabaseProjectURL: requireEnv("SUPABASE_URL"),

  port: Number(process.env.PORT) ?? 3000
}