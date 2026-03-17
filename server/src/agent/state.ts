import { ReducedValue, StateSchema } from "@langchain/langgraph";
import * as z from 'zod'

const MessageSchema = z.object({
  role: z.enum(["user","system","assistant"]),
  content: z.string() 
})

type MessageType = z.infer<typeof MessageSchema>

export const agentState = new StateSchema({ 
  messages: new ReducedValue(
      z.array(z.custom<MessageType>()).default([]),
    {
      inputSchema: MessageSchema,
      reducer: (arr: MessageType[], newVal: MessageType) => [...arr, newVal]
    }
  ),
  lastLLMResponse: z.string().nullable().default(null),
  initialMessage: z.string(),
  classification: z.enum(["malicious","out_of_scope","adjacent","focused"]).nullable().default(null),
  retries: z.number().default(0),
  maliciousIntent: z.boolean().default(false),
  outOfScopeIntent: z.boolean().default(false),
  adjacentIntent: z.boolean().default(false),
  focusedIntent: z.boolean().default(false),
  focusedIntentResult: z.enum(["similar_products","product_comparison","product_lookup","other"]),
  finalResponse: z.string(),
  inventoryStore: z.array(z.string()),
  modelsExtracted: z.string().or(z.array(z.string()))
})

export type State = typeof agentState.State
export type Update = typeof agentState.Update


