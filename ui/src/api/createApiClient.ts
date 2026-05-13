export function createApiClient(){

  return {
    get: () => {},
    post: (endpoint: string, body: string) => fetch(endpoint, {
      method: "POST",
      headers:{
        "Authorization":"",
        "Content-Type":"application/json"
      },
      body: body
    })
  }
}