type RequestOptions<B> = {
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

type ClientConfig = {
  baseURL:'api',
  getAccessToken: () => (string | null)
}

export function createApiClient(config: ClientConfig){

  async function request<T, B = unknown>(endpoint: string, options: RequestOptions<B>){

    const {method,headers, body} = options

    const URL = config.baseURL + endpoint

    const accessToken = config.getAccessToken()

    const res = await fetch(URL, {
      method,
      headers:{
        "Authorization": `Bearer ${accessToken}`,
        ...headers 
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if(!res.ok) throw new Error(`${res.status}: ${res.text}`)

    return res.json() as T
  }

  return {
    get: <T>(endpoint: string) => request<T>(endpoint,{method: "GET", headers:{}, body: undefined}),
    post: <T, B>(endpoint: string, body: B) => request<T>(endpoint, {method:"POST",headers:{"Content-Type":"application/json"}, body})
  }
}

