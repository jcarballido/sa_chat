import z from "zod";

const MessageSchema = z.object({
  role: z.enum(["user","assistant","system"]),
  content: z.string()
})
const UserMessageSchema = MessageSchema.extend({
  role:z.literal("user")
})
const AssistantMessageSchema = MessageSchema.extend({
  role: z.literal("assistant")
})
const SystemMessageSchema = AssistantMessageSchema.extend({
  role: z.literal("system")
})

export type SystemMessageType = z.infer<typeof SystemMessageSchema>

export type MessageType = z.infer<typeof MessageSchema>
export type UserMessageType = z.infer<typeof UserMessageSchema>
export type AssistantMessageType = z.infer<typeof AssistantMessageSchema>