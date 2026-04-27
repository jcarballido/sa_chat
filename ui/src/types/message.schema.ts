import z from "zod";

export const SpecifcationRowSchema = z.object({ model: z.string(), waterproof: z.boolean(), height: z.number(), width: z.number(), depth: z.number(), gun_count: z.number(), fire_rating_time: z.number(), fire_rating_temp: z.number() })
export const RemoveModel = SpecifcationRowSchema.omit({
  model:true
})
const ComparisonResultSchema = z.record(z.string(), z.array(SpecifcationRowSchema)).refine(obj => Object.keys(obj).length === 1, {
  message: "Each object can only have one key."
})

export const AssistantMessageContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.enum(["product_lookup_by_model", "product_lookup_by_specs","product_comparison"]),
    text: z.string().nullable(),
    data: z.array(SpecifcationRowSchema)
  }),
  z.object({
    type: z.enum(["similar_products"]),
    text: z.string().nullable(),
    data: z.array(ComparisonResultSchema)
  }),
  // z.object({
  //   type: z.literal("product_comparison"),
  //   text: z.string().nullable(),
  //   data: z.record(z.string(),RemoveModel)
  // })
])

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string().nullable(),
  createdAt: z.iso.datetime(),
  content: z.string(),
  status: z.enum(["delivered", "error", "sending"])
})

export const AssistantMessageSchema = MessageSchema.extend({
  role: z.literal("assistant"),
})

export const UserMessageSchema = MessageSchema.extend({
  role: z.literal("user"),
})

export type MessageType = z.infer<typeof MessageSchema>

export type AssistantMessageType = z.infer<typeof AssistantMessageSchema>
export type UserMessageType = z.infer<typeof UserMessageSchema>