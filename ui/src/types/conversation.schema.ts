import z from "zod";
import { AssistantMessageSchema, MessageSchema, UserMessageSchema } from "./message.schema";

export const ConversationSchema = z.object({
  conversationId: z.object({
    temp: z.string(),
    storage: z.union([z.number(), z.null()]),
  }),
  // createdAt:z.iso.datetime().nullable(),
  // updatedAt:z.iso.datetime().nullable(),
  messages: z.array( UserMessageSchema.or(AssistantMessageSchema)),
  title: z.string(),
})

export const DefinedConversationMetadataSchema = ConversationSchema.extend({
  conversationId: ConversationSchema.shape.conversationId.extend({
    storage: z.number()
  })
}).pick({conversationId: true, title: true}).array()

export const ConversationMetadataSchema = ConversationSchema.pick({conversationId: true, title: true})
export const ConversationMetadataSchemaArray = ConversationMetadataSchema.array()
const ActiveConversationSchema = ConversationSchema.pick({conversationId: true, title: true, messages: true})

export const ConversationIDs = ConversationSchema.shape.conversationId.pick({storage: true})

function makeSuccessResponseSchema<T extends z.ZodType>(dataSchema: T){
  return z.object({
    status:z.literal("success"),
    data: dataSchema,
    error: z.null()
  })
}
const ErrorResponseSchema = z.object({
  status:z.literal("error"),
  data: z.null(),
  error: z.object({
    code:z.string(),
    message:z.string()
  })
})

// export const messages = table("messages",{
//   id: serial().primaryKey(),
//   conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
//   createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull(),
//   role: text({ enum:["user","assistant"] }).notNull(),
//   content: text().notNull()
// })

const StoredConversationSchema = z.object({
  conversation: z.object({
    id: z.number(),
    tempId: z.string().or(z.null()),
    title: z.string().or(z.null())
  }),
  messages: z.array(
    MessageSchema
  )
})

export const ConversationMetadataSuccessResponseSchema = makeSuccessResponseSchema(DefinedConversationMetadataSchema)
export const ConversationSuccessResponseSchema = makeSuccessResponseSchema(StoredConversationSchema)

export const ResponseConversationMetadataSchema = z.discriminatedUnion("status",[
  ConversationMetadataSuccessResponseSchema,
  ErrorResponseSchema
])

export const ResponseConversationSchema = z.discriminatedUnion("status",[
  ConversationSuccessResponseSchema,
  ErrorResponseSchema
])

export type ConversationType = z.infer<typeof ConversationSchema>
export type ConversationMetadataType = z.infer<typeof ConversationMetadataSchema>
export type ConversationMetadataArrayType = z.infer<typeof ConversationMetadataSchemaArray>
export type ConversationIDsType = z.infer<typeof ConversationIDs>
export type ActiveConversationType = z.infer<typeof ActiveConversationSchema>
export type DefinedConversationMetadataType = z.infer<typeof DefinedConversationMetadataSchema>
export type ResponseConversationType = z.infer<typeof ResponseConversationSchema>