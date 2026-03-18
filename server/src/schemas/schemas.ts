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