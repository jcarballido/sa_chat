import type { State } from "../agent/state.js"
import type { buildStoreGeneric } from "../infrastructure/buildStore.js"
import type { inventorySchema } from "../plugins/inventoryStore.plugin.js"
import type { specificationSchema } from "../plugins/specificationStore.plugin.js"

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


export type InferRows<S extends Record<string,(v:string)=> any>> = {
  -readonly [K in keyof S]: ReturnType<S[K]>
} 

export type LLMcall = {
  invokeAgent: (message: string, inventoriedModelNumbers: string[]) => Promise<State>,
}
