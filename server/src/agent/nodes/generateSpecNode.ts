import { SPEC_GENERATOR_PROMPT, SPEC_REVISION_GENERATOR_PROMPT } from "../constants/constants.js";
// import type { AgentStateType } from "../state.js";
import type { State, Update } from "../state.js" 
import askPlanner from "../util/askSpecGenerator.js";

export async function generateSpecNode(state:State):Promise<Update> {  
  console.log("→ GENERATE_SPEC")
  if (state.specificationApproval) {
  }

  const isRevision = state.specification !== undefined && state.specificationFeedback !== undefined

  if(isRevision){
    const prompt = SPEC_REVISION_GENERATOR_PROMPT(state.initialIntent,JSON.stringify(state.specificationHistory),JSON.stringify(state.specificationFeedback))
    let specification

    try {
      const response = await askPlanner(prompt)
      specification = JSON.parse(response)      
      return {
        specification,
        specificationFeedback:undefined
      }
    } catch (err) {
      console.log('Error caught in generating a REVISED spec:')
      console.log(err)
      return {
        error: ["Failed to generate or parse a REVISED component spec"],
      }      
    }
  }else {
    const prompt = SPEC_GENERATOR_PROMPT(state.initialIntent)
  
    let specification
      
    try {
      const response = await askPlanner(prompt)
      specification = JSON.parse(response)
  
    } catch (err) {
      console.log('Error caught in generating an INITIAL spec:')
      console.log(err)
      return {
        error: ["Failed to generate or parse an INITIAL component spec"],
      }
    }
    return {
      specification
    }  
  }
} 