import z from "zod";

export const InventoryRowSchema = z.object({
  "model":z.string(),
})

export const SpecRowSchema = z.object({
  "model":z.string(),
  "height":z.string().transform(val => Number(val)),
  "depth":z.string().transform(val => Number(val)),
  "width":z.string().transform(val => Number(val)),
  "fire_rating_time":z.string().transform(val => Number(val)),
  "fire_rating_temp":z.string().transform(val => Number(val)),
  "gun_count": z.string().transform(val => Number(val)),
  "waterproof":z.string().transform(val => val.toLowerCase() === "true" )
})

export const NormalizedSpecRowSchema = SpecRowSchema.transform( (row) =>({
  ...row,
  normalized_model: row.model.replace("-","")
}))

export const categoryEnum = SpecRowSchema.keyof()
export type SpecRowType = z.infer<typeof SpecRowSchema>
type NormalizedSpecRowType = z.infer<typeof NormalizedSpecRowSchema>
type NormalizedModel = NormalizedSpecRowType["normalized_model"]

// export type SpecCategoryValueRangeType = { [ K in keyof SpecRowType  ] :{ category: K, value: SpecRowType[K] } }[keyof SpecRowType][]
export type InventoryRowType = z.infer<typeof InventoryRowSchema>
export type InventoryHeadersType = keyof InventoryRowType
