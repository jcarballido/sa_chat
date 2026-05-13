import { createRemoteJWKSet, jwtVerify } from "jose"
// import { config } from "../config.js"

export async function verifyAuthJWT(token: string){
    const JWKS = createRemoteJWKSet(
        new URL(`https://jowfbhgdlhfyfwmycmgx.supabase.co`+'/auth/v1'+'/.well-known/jwks.json')
    )
    try {
        const { payload } = await jwtVerify(token, JWKS)
        return payload        
    } catch (error) {
        console.log("Error verifying auth jwt:")
        console.log(error)
        return null
    }
}