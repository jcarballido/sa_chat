export async funciton preHandlerAuthHook (request, reply) => {
  const token = request.headers.authorization?.replace("Bearer ","")
  if(!token) {return console.log("TOKEN MISSING")}
  try {
    const payload = await verifyAuthJWT(token)
    if(!payload) return reply.code(401).send({
        error: "Unathorized"
      })

    console.log("PAYLOAD:")
    console.log(payload)
    
    request.user = {sub: payload?.sub!, email: payload?.email!}
    
  } catch (error) {
      console.log("ERROR VERIFYING PAYLOAD")
      console.log(error)
      return reply.code(401).send({
        error: "Unathorized"
      })
  }
}