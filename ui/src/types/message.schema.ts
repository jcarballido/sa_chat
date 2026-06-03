import z from "zod";

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
    type: z.enum(["malicious","out_of_scope","related"]),
    text: z.string().nullable(),
    data: z.null()
  })
])


export const AssistantMessageSchema = z.object({
  id: z.number(),
  role: z.literal("assistant"),
  content: AssistantMessageContentSchema,
})

export const UserMessageSchema = z.object({
  role: z.literal("user"),
  id:z.object({
    temp:z.string(),
    storage: z.number().or(z.undefined())
  }),
  content: z.string()
})

// export const MessageSchema = z.discriminatedUnion("role",[
//   UserMessageSchema,
//   AssistantMessageSchema
// ])
export const StoredMessageSchema = z.object({
  id: z.number(),
  conversationId: z.number(),
  createdAt: z.ZodISODateTime,
  updatedAt: z.ZodISODateTime,
  role: z.literal("user").or(z.literal("assistant")),
  content: z.string()
})

export const MessageSchema = z.union([UserMessageSchema,AssistantMessageContentSchema, StoredMessageSchema])

export const EnhancedUserMessageSchema = UserMessageSchema.extend({
  id: z.string()
})
// export const IncomingMessageSchema = z.object({
//   title: z.string(),
//   conversationId: z.string().or(z.number()),
//   newMessage: UserMessageSchema
// }) 
// export const UserMessageSchema = z.object({
//   role: z.literal("user"),
//   id:z.object({
//     temp:z.string(),
//     storage: z.number().or(z.undefined())
//   }),
//   content: z.string() 
// })


export const NewUserMessageSchema = z.object({
  title: z.string().nullable(),
  conversationId: z.number().or(z.string()),
  newMessage: UserMessageSchema 
})
// export function success<T>(dataSchema: T) {
//   return{
//     status:"success",
//     data: dataSchema,
//     error:null
//   }
// }
  
// export function failure (code: string, message:string){
//   return {
//     status:"error",
//     data: null,
//     error:{
//       code,
//       message
//     }
//   }
// }

const SuccessResponseSchema = z.object({
  status:z.literal("success"),
  data: z.object({
    conversationId:z.number(),
    title: z.string(),
    responseMessage: z.array(z.discriminatedUnion("role",[
      UserMessageSchema,
      AssistantMessageSchema
    ]))
  }),
  error: z.null()
})
const ErrorResponseSchema = z.object({
  status:z.literal("error"),
  data: z.null(),
  error: z.object({
    code:z.string(),
    message:z.string()
  })
})

export const ResponseMessageSchema = z.discriminatedUnion("status",[
  SuccessResponseSchema,
  ErrorResponseSchema
])

// export const messages = table("messages",{
//   id: serial().primaryKey(),
//   conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
//   createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull(),
//   role: text({ enum:["user","assistant"] }).notNull(),
//   content: text().notNull()
// })

// export const StoredMessageSchema = z.object({
//   id: z.number(),
//   conversationId: z.number(),
//   createdAt: z.ZodISODateTime,
//   updatedAt: z.ZodISODateTime,
//   role: z.literal("user").or(z.literal("assistant")),
//   content: z.string()
// })
// export const StoredAssistantMessageSchema

// export const StoredMessageSchema = z.discriminatedUnion("role",[
//   StoredUserMessageSchema,
//   StoredAssistantMessageSchema
// ]) 

// type SelectMessage = {
//     id: number;
//     conversationId: number;
//     createdAt: Date;
//     updatedAt: Date;
//     role: "user" | "assistant";
//     content: string;
// }

// export const messages = table("messages",{
//   id: serial().primaryKey(),
//   conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
//   createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull(),
//   role: text({ enum:["user","assistant"] }).notNull(),
//   content: text().notNull()
// })



// export const LLMResponseSchema = z.object({
//   conversation: z.object({
//     title: z.string(),
//     conversationId: z.string(),
//     messages: z.tuple([AssistantMessageSchema, EnhancedUserMessageSchema])
//   }) 
// })

export type MessageType = z.infer<typeof MessageSchema>

export type AssistantMessageType = z.infer<typeof AssistantMessageSchema>
export type UserMessageType = z.infer<typeof UserMessageSchema>
// export type LLMResponseType = z.infer<typeof LLMResponseSchema>
export type NewUserMessageType = z.infer<typeof NewUserMessageSchema>