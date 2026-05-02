import z from "zod";

const ConfigSchema = z.object({
  "inventoryFilePath":z.string(),
  "specFilePath":z.string(),
  "port":z.number()

})

export type ConfigType = z.infer<typeof ConfigSchema>