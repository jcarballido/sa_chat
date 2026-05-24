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
    // title: z.string(),
    type: z.enum(["product_lookup_by_model", "product_lookup_by_specs","product_comparison"]),
    text: z.string().nullable(),
    data: z.array(SpecifcationRowSchema)
  }),
  z.object({
    // title: z.string(),
    type: z.enum(["similar_products"]),
    text: z.string().nullable(),
    data: z.array(ComparisonResultSchema)
  }),
  z.object({
    // title: z.string(),
    type: z.enum(["malicious","out_of_scope"]),
    text: z.string().nullable(),
    data: z.null()
  })
])


export const AssistantMessageSchema = z.object({
  id: z.string(),
  role: z.literal("assistant"),
  content: AssistantMessageContentSchema,
  conversationId: z.string(),
})

export const UserMessageSchema = z.object({
  role: z.literal("user"),
  id:z.object({
    temp:z.string(),
    storage: z.number().or(z.undefined())
  }),
  content: z.string()
})

export const MessageSchema = z.discriminatedUnion("role",[
  UserMessageSchema,
  AssistantMessageSchema
])
export const EnhancedUserMessageSchema = UserMessageSchema.extend({
  id: z.string()
})
// export const IncomingMessageSchema = z.object({
//   title: z.string(),
//   conversationId: z.string().or(z.number()),
//   newMessage: UserMessageSchema
// }) 
// export const UserMessageSchema = z.object({
//   role: z.literal("user"),
//   id:z.object({
//     temp:z.string(),
//     storage: z.number().or(z.undefined())
//   }),
//   content: z.string() 
// })


export const NewUserMessageSchema = z.object({
  title: z.string().nullable(),
  conversationId: z.number().or(z.string()),
  newMessage: UserMessageSchema 
})

export const ResponseMessageSchema = z.object({
  title: z.string(),
  conversationId: z.number(),
  responseMessage: z.array(MessageSchema)
})


// export const LLMResponseSchema = z.object({
//   conversation: z.object({
//     title: z.string(),
//     conversationId: z.string(),
//     messages: z.tuple([AssistantMessageSchema, EnhancedUserMessageSchema])
//   }) 
// })

export type MessageType = z.infer<typeof MessageSchema>

export type AssistantMessageType = z.infer<typeof AssistantMessageSchema>
export type UserMessageType = z.infer<typeof UserMessageSchema>
// export type LLMResponseType = z.infer<typeof LLMResponseSchema>
export type NewUserMessageType = z.infer<typeof NewUserMessageSchema>