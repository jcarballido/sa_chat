import z from "zod"

export const MessageSchema = z.object({
  role: z.enum(["user","system","assistant"]),
  content: z.string() 
})

export const PromptSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Model cannot be empty")
    .max(200, "Maximum message length exceeded")
}).strict()

export const SpecificationMapSchema = {
  // "model":z.string(),
  "height":z.number(),
  "depth":z.number(),
  "width":z.number(),
  "fire_rating_time":z.number(),
  "fire_rating_temp":z.number(),
  "gun_count": z.number(),
  "waterproof":z.boolean()
} 

export const ReturnedSpecValue = z.array(z.object({category: z.enum(Object.keys(SpecificationMapSchema) as [keyof typeof SpecificationMapSchema ]),value: z.array(z.string()).nullable()})) 

export const SpecValueSchema = z.object({
  "specValues": ReturnedSpecValue
})

export const ApiErrorSchema = z.object({
    code:z.string(),
    message: z.string()
})

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.discriminatedUnion("status", [
    z.object({
      status: z.literal("success"),
      data: dataSchema,
      error: z.null(),
    }),
    z.object({
      status: z.literal("error"),
      data: z.null(),
      error: ApiErrorSchema,
    }),
  ])

const magicLinkRequestSchema = z.object({
  requestApproved: z.boolean()
})

export const loginRequestResponseSchema = ApiResponseSchema(magicLinkRequestSchema)
export const SpecifcationRowSchema = z.object({ model: z.string(), waterproof: z.boolean(), height: z.number(), width: z.number(), depth: z.number(), gun_count: z.number(), fire_rating_time: z.number(), fire_rating_temp: z.number() })
export const RemoveModel = SpecifcationRowSchema.omit({
  model:true
})
const ComparisonResultSchema = z.record(z.string(), z.array(SpecifcationRowSchema)).refine(obj => Object.keys(obj).length === 1, {
  message: "Each object can only have one key."
})

export const AssistantMessageContentSchema = z.discriminatedUnion("type", [
  z.object({
    title: z.string(),
    type: z.enum(["product_lookup_by_model", "product_lookup_by_specs","product_comparison"]),
    text: z.string().nullable(),
    data: z.array(SpecifcationRowSchema)
  }),
  z.object({
    title: z.string(),
    type: z.enum(["similar_products"]),
    text: z.string().nullable(),
    data: z.array(ComparisonResultSchema)
  }),
  z.object({
    title: z.string(),
    type: z.enum(["malicious","out_of_scope","related","other","empty"]),
    text: z.string().nullable(),
    data: null
  })
])

export const ApiRequestBodySchema = <T extends z.ZodType>(dataSchema: T) => 
  z.object({
    id:z.string(),
    conversationId:z.string().nullable(),
    role:z.enum(["user", "assistant"]),
    content:AssistantMessageContentSchema,
    createdAt:z.iso.datetime(),
    status: z.enum(["delivered","error","sending"])
  })

export const RequestMessageSchema =  
  z.object({
    id:z.string(),
    title: z.string().nullable(),
    conversationId:z.string().nullable(),
    role:z.enum(["user", "assistant"]),
    content:z.string(),
    createdAt:z.iso.datetime(),
    status: z.enum(["delivered","error","sending"])
  })

// export const ResponseMessageSchema = 
//   z.object({
//     id:z.string(),
//     conversationId:z.string(),
//     title: z.string().nullable(),
//     role:z.enum(["user", "assistant"]),
//     content:z.string(),
//     createdAt:z.iso.datetime(),
//     status: z.enum(["delivered","error","sending"])
//   })

export const AccessRequest = z.object({
    email: z.string()
  })
