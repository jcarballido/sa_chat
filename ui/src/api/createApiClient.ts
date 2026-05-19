import { ZodType } from 'zod'
import type { ClientConfig, HttpError, RequestOptions, ValidationError } from './apiClient.types'

export function createApiClient(config: ClientConfig){

  async function request<T, B = unknown>(
    endpoint: string,
    schema: ZodType<T>, 
    options: RequestOptions<B>
  ){
    const {method,headers, body} = options

    const URL = config.baseURL + endpoint

    const accessToken = config.getAccessToken()

    const response = await fetch(URL, {
      method,
      headers:{
        "Authorization": `Bearer ${accessToken}`,
        ...headers 
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if(!response.ok){
      const error: HttpError = {
        type:"http",
        status: response.status,
        body: response.json().catch(() => undefined)
      }
      throw error
    }

    console.log("RAW RESPONSE:")
    console.log(response)

    const json = await response.json()
    console.log("JSON RESPONSE:")
    console.log(json)

    const result = schema.safeParse(json)

    if(result.error){
      console.log("ERROR PARSING RESPONSE:")
      console.log(result.error)
      const error: ValidationError = {
        type:"validation",
        issue: result.error.issues
      }
      throw error
    }

    return result.data
  }

  return {
    get: <T>(
      endpoint: string, 
      schema: ZodType<T>
    ) => request<T>(
      endpoint,
      schema,
      {method: "GET", headers:{}, body: undefined}
    ),
    post: <T, B>(
      endpoint: string, 
      schema: ZodType<T>, 
      body: B
    ) => request<T>(
      endpoint, 
      schema, 
      {method:"POST",headers:{"Content-Type":"application/json"}, body}
    )
  }
}

