import z from "zod";
import type { State, Update } from "../intentAgentState.js";
import stringExists from "../util/stringExists.js";

const TitleSchema = z.object({
  title: z.string()
})

export async function verifyGeneratedTitleNode(state:State): Promise<Update> {
    console.log("---VERIFY GENERATE TITLE RUNNING---")
    if(!state.latestLLMResponse) throw new Error ("MISSING LATEST LLM RESPONSE")
    const titleRegex = /(\{\s*"title"\s*\:\s*.*\s*\})/
    const stringsCheck = stringExists(state.latestLLMResponse, titleRegex)  
    if(!stringsCheck.result){
      console.log("---TITLE OUTPUT NOT FOUND IN LLM RESPONSE---")
      return {
        retries: state.retries + 1
      }  
    }
    console.log("TITLE STRING FOUND:")
    console.log(stringsCheck.result)
    const match = stringsCheck.match
    const parsed = TitleSchema.safeParse(match)
    if(parsed.error){
      console.log("MATCH DID NOT MATCH TITLESCHEMA")
      return {
        retries: state.retries + 1
      }  
    }
    const title = parsed.data.title
    return {
      title
    }
    console.log("---VERIFY GENERATE TITLE COMPLETE---")  

}