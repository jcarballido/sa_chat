import z from "zod";

export const InventoryRowSchema = z.object({
  "model":z.string().transform(val => val.replace("-","")),
})

export const SpecRowSchema = z.object({
  "model":z.string().transform(val => val.replace("-","")),
  "height":z.string().transform(val => Number(val)),
  "depth":z.string().transform(val => Number(val)),
  "width":z.string().transform(val => Number(val)),
  "fire_rating_time":z.string().transform(val => Number(val)),
  "fire_rating_temp":z.string().transform(val => Number(val)),
  "gun_count": z.string().transform(val => Number(val)),
  "waterproof":z.string().transform(val => val === "true")
})

export type InventoryRowType = z.infer<typeof InventoryRowSchema>
export type InventoryHeadersType = keyof InventoryRowType
export type SpecRowType = z.infer<typeof SpecRowSchema>