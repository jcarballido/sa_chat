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

export const SpecificationMap = {
  // "model":z.string(),
  "height":z.number(),
  "depth":z.number(),
  "width":z.number(),
  "fire_rating_time":z.number(),
  "fire_rating_temp":z.number(),
  "gun_count": z.number(),
  "waterproof":z.boolean()
} as const

export const ReturnedSpecValue = z.array(z.object({category: z.enum(Object.keys(SpecificationMap) as [keyof typeof SpecificationMap ]),value: z.array(z.string()).nullable()})) 

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

export const ApiRequestBodySchema = <T extends z.ZodType>(dataSchema: T) => 
  z.object({
    id:z.string(),
    conversationId:z.string().nullable(),
    role:z.enum(["user", "assistant"]),
    content:z.string(),
    createdAt:z.iso.datetime(),
    status: z.enum(["delivered","error","sending"])
  })

export const RequestMessageSchema = () => 
  z.object({
    id:z.string(),
    conversationId:z.string().nullable(),
    role:z.enum(["user", "assistant"]),
    content:z.string(),
    createdAt:z.iso.datetime(),
    status: z.enum(["delivered","error","sending"])
  })

export const ResponseMessageSchema = 
  z.object({
    id:z.string(),
    conversationId:z.string(),
    role:z.enum(["user", "assistant"]),
    content:z.string(),
    createdAt:z.iso.datetime(),
    status: z.enum(["delivered","error","sending"])
  })

export const AccessRequest = z.object({
    email: z.string()
  })
