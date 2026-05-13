import { createRemoteJWKSet, jwtVerify } from "jose"
import { config } from "../config.js"

export type AuthUser = {
    sub:string,
    email:string
}

export async function verifyAuthJWT(token: string): Promise<AuthUser | null>{
    const JWKS = createRemoteJWKSet(
        new URL(`${config.supabaseProjectURL}`+'/auth/v1'+'/.well-known/jwks.json')
    )
    try {
        const { payload } = await jwtVerify(token, JWKS)
        return {
            sub: payload.sub as string,
            email: payload.email as string
        }
    } catch (error) {
        console.log("Error verifying auth jwt:")
        console.log(error)
        return null
    }
}