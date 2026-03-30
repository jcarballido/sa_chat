import { StateSchema } from "@langchain/langgraph";
import z from "zod";

export const agentState = new StateSchema({
    message: z.string(),
    res: z.string(),
    systemPrompt: z.string(),
    modelsToCompare: z.array(z.string())
})

export type GeneralLLMState = typeof agentState.State
export type Update = typeof agentState.Update