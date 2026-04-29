import { ReducedValue, StateSchema } from "@langchain/langgraph";
import * as z from 'zod'
import { MessageSchema, SpecValueSchema } from "../schemas/schemas.js";

type MessageType = z.infer<typeof MessageSchema>

export const agentState = new StateSchema({ 
  messages: new ReducedValue(
      z.array(z.custom<MessageType>()).default([]),
    {
      inputSchema: MessageSchema,
      reducer: (arr: MessageType[], newVal: MessageType) => [...arr, newVal]
    }
  ),
  latestLLMResponse: z.string().nullable().default(null),
  inventoryStore: z.array(z.string()),
  initialMessage: z.string(),
  title:z.string().nullable(),
  initialMessageClassification: z.enum(["malicious","out_of_scope","adjacent","focused"]).nullable().default(null),
  retries: z.number().default(0),
  maliciousIntent: z.boolean().default(false),
  outOfScopeIntent: z.boolean().default(false),
  relatedIntent: z.boolean().default(false),
  focusedIntent: z.boolean().default(false),
  focusedIntentClassification: z.enum(["similar_products","product_comparison","product_lookup_by_model","product_lookup_by_specs","other"]),
  relatedIntentLLMResponse: z.string(),
  // focusedIntentModelsExtracted: z.array(z.string()),
  focusedIntentSpecsExtracted: z.array(z.string()),
  focusedIntentSpecValuesExtracted: SpecValueSchema,
  candidates: z.array(z.string()),
  filteredMatches: z.array(z.string())
})

export type State = typeof agentState.State
export type Update = typeof agentState.Update


