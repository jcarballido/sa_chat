import type z from "zod"
import { AccessRequest, type loginRequestResponseSchema } from "../schemas/schemas.js"
import { supabaseBase } from "../supabase/supabaseBase.js"

export async function buildLoginServices() {

  const allowedEmails: string[] = process.env.ALLOWED_EMAIL_LIST
    ? process.env.ALLOWED_EMAIL_LIST.split(",").map(allowedEmail => allowedEmail.trim())
    : [] 

  async function processMagicLinkRequest(linkRequest: unknown): Promise<z.infer<typeof loginRequestResponseSchema>>{
    const body = AccessRequest.safeParse(linkRequest)
    if(body.error){
      return {
        status:"error",
        data:null,
        error:{
          code:"LINK REQUEST VIOLATED CONTRACT",
          message:"The request was not formatted correctly."
        }
      }
    }
    const { email } = body.data
    if(!allowedEmails.includes(email)){
      return {
        status:"error",
        data:null,
        error:{
          code:"EMAIL IS NOT WHITE LISTED",
          message:"Email provided is not allowed a magic link."
        }
      }
    }
    try {
      console.log("Attempting to send to supabase")
      await supabaseBase.auth.signInWithOtp({
        email,
        options:{
          emailRedirectTo: 'https://ideal-succotash-rwr6jrr9pqjhpxpp-5173.app.github.dev/'
        }
      })
      console.log("Supabase email request sent.")      
    } catch (error) {
      console.log("Error sending to supabase")
      console.log(error)
    }

    return {
      status:"success",
      data:{requestApproved:true},
      error:null
    }
  }

  return{
    processMagicLinkRequest
  }
}