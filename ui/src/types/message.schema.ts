import z from "zod";

export const MessageSchema = z.object({
  id:z.uuid(),
  conversationId:z.uuid(),
  role:z.enum(["user", "assistant"]),
  content:z.string(),
  createdAt:z.iso.datetime(),
  status: z.enum(["delivered","error","sending"])
})

export type MessageType = z.infer<typeof MessageSchema>