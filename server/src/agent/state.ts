// import { Annotation } from "@langchain/langgraph";
import { ReducedValue, StateSchema } from "@langchain/langgraph";
import * as z from 'zod'

const SpecificationSchema = z.object({
  name: z.string(),
  props: z.array(z.object({name: z.string(),type: z.string()})).optional(),
  responsibilities: z.array(z.string()),
  stylingNotes: z.array(z.string())
})

type Specification = z.infer<typeof SpecificationSchema>

export const agentState = new StateSchema({
  initialIntent: z.string(),
  clarifyingQuestions:z.union([z.array(z.string()),z.undefined()]),
  projectRoot: z.string(),
  specification: SpecificationSchema.optional(),
  specificationHistory: new ReducedValue(
    z.array(SpecificationSchema).default([]),
    {
      inputSchema: SpecificationSchema,
      reducer: (arr: Specification[], newVal: Specification) => [...arr, newVal]
    }
  ),
  specificationFeedback: z.union([z.string(),z.undefined()]),
  specificationApproval: z.boolean(),
  specificationRegenerationAttempts: z.number().default(0),
  generatedCode: z.string(),
  generatedCodeHistory: z.array(z.string()),
  generatedCodeFeedback: z.string(),
  codeValidated: z.boolean(),
  codeApproved: z.boolean(),
  codeRegenerationAttempts: z.number().default(0),
  error: z.array(z.string()),
  done: z.boolean().default(false),
  exited: z.object({
    status: z.boolean(),
    node: z.string()
  })
})

export type State = typeof agentState.State
export type Update = typeof agentState.Update

// export const AgentState = Annotation.Root({
//   componentDescription: Annotation<string>(),
//   projectRoot: Annotation<string>(),
//   spec: Annotation<Spec>(),
//   specHistory: Annotation<Spec[]>(),
//   specFeedback:Annotation<string | undefined>(),
//   specApproved: Annotation<boolean>(),
//   specRegenerationAttempts: Annotation<number>(),
//   generatedCode: Annotation<string>(),
//   generatedCodeHistory: Annotation<string[]>(),
//   generateCodeFeedback: Annotation<string>(),
//   codeValidated: Annotation<boolean>(),
//   codeApproved: Annotation<boolean>(),
//   codeRegenerationAttempts: Annotation<number>(),
//   error:Annotation<string[]>(),
//   done: Annotation<boolean>(),
//   exited:Annotation<{
//     "status":boolean
//   }>()
// })

