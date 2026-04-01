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
  "model":z.string(),
  "height":z.number(),
  "depth":z.number(),
  "width":z.number(),
  "fire_rating_time":z.number(),
  "fire_rating_temp":z.number(),
  "gun_count": z.number(),
  "waterproof":z.boolean()
} as const


export const SpecValueSchema = z.object({
  "specValues": z.array(z.object({category: z.enum(Object.keys(SpecificationMap) as [keyof typeof SpecificationMap ]),value: z.array(z.string()).nullable()}))
})