import type { GeneralLLMState } from "../agents/generalAgentState.js"
import type { State } from "../agents/intentAgentState.js"
import type { buildStoreGeneric } from "../infrastructure/buildStore.js"
import type { inventorySchema } from "../plugins/inventoryStore.plugin.js"
import type { specificationSchema } from "../plugins/specificationStore.plugin.js"
import * as prompts from "../constants/system_prompts.js"
import type { ApiErrorSchema } from "../schemas/schemas.js"
import type z from "zod"

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

export  type SpecificationSchema = typeof specificationSchema

export type FilteredSpecSchema<T> = Omit<T,"model">

export  type FilteredSpecSchemaKeys = keyof FilteredSpecSchema<SpecificationSchema>

export  type RawLLMResult = {
  category: FilteredSpecSchemaKeys,
  value: string[] | null
}

export  type SingleReturnType<S extends FilteredSpecSchemaKeys> = ReturnType<FilteredSpecSchema<SpecificationSchema>[S]>

export  type SpecSchemaReturnTypes = {
  [K in FilteredSpecSchemaKeys] : SingleReturnType<K> extends boolean 
    ? boolean 
    : SingleReturnType<K>[] 
}

export type TransformedSpec<K extends FilteredSpecSchemaKeys=FilteredSpecSchemaKeys> = {
  [P in K]:{
    category: P,
    value: SpecSchemaReturnTypes[P]
  }
}[K]

export type FilteredSchema<T extends ConversionSchema> = {
  [K in keyof T]: ReturnType<T[K]> extends string ? never: ReturnType<T[K]>
} 

export type OmittedSpecRow = Omit<SpecificationRow,"model">

export type NumberedKeys = {
      [K in keyof OmittedSpecRow]: 
        OmittedSpecRow[K] extends number ? K : never
    }[keyof OmittedSpecRow]

export type BooleanKeys = {
      [K in keyof OmittedSpecRow]: 
        OmittedSpecRow[K] extends boolean ? K : never
    }[keyof OmittedSpecRow]

export type CategoryHandler = {
      [K in NumberedKeys]: (value: number[]) => Operators<number>
    } & {
      [K in BooleanKeys]: (value: boolean) => Operators<boolean>
    }

export type SchemaKey = keyof typeof specificationSchema

export type ApiError = z.infer<typeof ApiErrorSchema>

