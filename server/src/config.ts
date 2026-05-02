import requireEnv from "./requireEnv.js";

export const config = {
  inventoryFilePath: requireEnv(process.env.INVENTORY_SHEET),
  specFilePath:requireEnv(process.env.SPEC_SHEET),

  port: Number(process.env.PORT) ?? 3000
}