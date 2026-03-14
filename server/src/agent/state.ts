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

  initialMessage: z.string(),
  intent: z.string().nullable().default(null),
  retries: z.number().default(0)

})

export type State = typeof agentState.State
export type Update = typeof agentState.Update


