import z from "zod"
export const MessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Model cannot be empty")
    .max(200, "Maximum message length exceeded")
}).strict()