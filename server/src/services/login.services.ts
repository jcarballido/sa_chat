import type z from "zod"
import { AccessRequest, ApiResponseSchema, loginRequestResponseSchema } from "../schemas/schemas.js"

export function buildLoginServices(){

  const allowedEmails: string[] = process.env.ALLOWED_EMAIL_LIST
    ? process.env.ALLOWED_EMAIL_LIST.split(",").map(allowedEmail => allowedEmail.trim())
    : [] 

  function processMagicLinkRequest(linkRequest: unknown): z.infer<typeof loginRequestResponseSchema>{
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

export type LoginServices = ReturnType<typeof buildLoginServices>

