export type ChatMessage = {
  message: string
}
export type ChatModels = {
  models: {name: string}[]
}
export type SpecCriteria = {
  fire_rating:{
    time:number,
    temp:number
  },
  waterpoof:boolean,
  gun_count:number,
  external_dimensions:{
    height: number,
    width: number,
    depth: number
  }
}

