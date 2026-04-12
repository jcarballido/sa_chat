import type { Override } from "@tanstack/react-query";
import z from "zod";

export const MessageSchema = z.object({
  id:z.string(),
  conversationId:z.string().nullable(),
  role:z.enum(["user", "assistant"]),
  content:z.string(),
  createdAt:z.iso.datetime(),
  status: z.enum(["delivered","error","sending"])
})

export const AssistantMessageSchema = z.object({
  id:z.string(),
  conversationId:z.string().nullable(),
  role:z.literal("assistant"),
  content:z.string(),
  createdAt:z.iso.datetime(),
  status: z.enum(["delivered","error","sending"])
})


export type MessageType = z.infer<typeof MessageSchema>

type AssignRoleType<T,U extends Partial<T>> = Override<T,keyof T> & U

export type UserMessageType = AssignRoleType<MessageType,{role: "user"}>
export type AssistantMessageType = AssignRoleType<MessageType,{role: "assistant"}>