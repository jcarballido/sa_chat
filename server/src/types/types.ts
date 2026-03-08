export type ChatMessage = {
  message: string
}
export type ChatModels = {
  models: {name: string}[]
}
export type SpecCriteria = {
  fire_rating?:{
    time:number,
    temp:number
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

