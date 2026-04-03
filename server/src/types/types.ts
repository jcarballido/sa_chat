import type { GeneralLLMState } from "../agents/generalAgentState.js"
import type { State } from "../agents/intentAgentState.js"
import type { buildStoreGeneric } from "../infrastructure/buildStore.js"
import type { inventorySchema } from "../plugins/inventoryStore.plugin.js"
import type { specificationSchema } from "../plugins/specificationStore.plugin.js"
import * as prompts from "../constants/system_prompts.js"
import { readonly } from "zod"

export type ChatMessage = {
  message: string
}
export type ChatModels = {
  models: {name: string}[]
}
export type SpecCriteria = {
  fire_rating?:{
    time?:number,
    temp?:number
  },
  waterpoof?:boolean,
  gun_count?:number,
  external_dimensions?:{
    height?: number,
    width?: number,
    depth?: number
  }
} | undefined

export type Defined<T> = Exclude<T, undefined>

export type Operators<T> = {
  eq?:T,
  neq?:T,
  gt?:T,
  gte?:T,
  lt?:T,
  lte?:T,
}

export type Filter<T> = {
  [K in keyof T]?: Operators<T[K]>
}

export type ConversionSchema = {
  [k:string]: (t: string) => unknown  
}

export type SpecificationStore = Awaited<
  ReturnType<typeof buildStoreGeneric<typeof specificationSchema>>
>

export type SpecificationRow = SpecificationStore["rows"][number]


export type InventoryStore = Awaited<
  ReturnType<typeof buildStoreGeneric<typeof inventorySchema>>
>


export type InferRows<S extends Record<string,(t:any)=> any>> = {
  -readonly [K in keyof S]: ReturnType<S[K]>
} 

export type Prompts = keyof typeof prompts

export type LLMcall = {
  invokeIntentAgent: (message: string, inventoriedModelNumbers: string[]) => Promise<State>,
  invokeGeneralLLMAgent: (systemPrompt: string) => Promise<GeneralLLMState>,
}

export type MappedSpecRows<T> = {
  [K in keyof T]:{
    category: K,
    value: T[K] extends number ? T[K][] : T[K]
  }
}[keyof T] 

export type ToArraySchema<S extends Record<string,(t:string) => any>> = {
  -readonly [K in keyof S]: (t: string[]) => ReturnType<S[K]>[]
}


export  type MultiValue = "height" | "width" | "depth" | "gun_count" | "fire_rating_temp" | "fire_rating_time"

export  type ParsedValue<K extends keyof typeof specificationSchema> = 
    K extends MultiValue ? InferRows<typeof specificationSchema>[K][] : InferRows<typeof specificationSchema>[K] 


