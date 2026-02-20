export type ChatMessage = {
  message: string
}
export type ChatModels = {
  models: {name: string}[]
}
export type Message = {
  role:"SYSTEM"|"USER"|"ASSISTANT",
  prompt:string
}
