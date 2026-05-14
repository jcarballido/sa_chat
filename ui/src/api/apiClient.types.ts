export type RequestOptions<B> = {
  method:"GET",
  headers:{},
  body: undefined
} | {
  method: "POST",
  headers:{
    "Content-Type":"application/json"
  },
  body: B
} 

export type ClientConfig = {
  baseURL:'api',
  getAccessToken: () => (string | null)
}

export type HttpError = {
  type:"http",
  status: number,
  body?: unknown
}

export type ValidationError = {
  type:"validation",
  issue: unknown
}