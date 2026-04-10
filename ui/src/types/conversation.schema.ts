import z from "zod";
import { MessageSchema } from "./message.schema";

export const ConversationSchema = z.object({
  conversationId: z.uuid(),
  createdAt:z.iso.datetime(),
  updatedAt:z.iso.datetime().nullable(),
  messages: z.array(MessageSchema),
  title: z.string(),
})

export type ConversationType = z.infer<typeof ConversationSchema>