import { CODE_GENERATOR_PROMPT, CODE_REGENERATION_PROMPT } from '../constants/constants.js'
import type { State, Update } from '../state.js'
// import type { AgentStateType } from '../state.js'
import askCodeGenerator from '../util/askCodeGenerator.js'
import normalizeCode from '../util/normalizeCode.js'

export async function generateCodeNode(state: State): Promise<Update> {

  console.log('→ GENERATE_CODE')

  if(!state.specificationApproval){
    throw new Error("Spec has not been approved")
  } 

  if (!state.specification) {
    throw new Error("Cannot generate code without an approved spec")
  }

  const spec = state.specification

  const isRevision = state.generatedCode !== undefined && state.generatedCodeFeedback !== undefined
  let code: string
  if(isRevision){
    const prompt = CODE_REGENERATION_PROMPT(JSON.stringify(state.specification),state.generatedCode,state.generatedCodeFeedback)

    try {
      code = await askCodeGenerator(prompt)
      const normalizedCode = normalizeCode(code)
      code = normalizedCode
    } catch {
      return {
        error: ["Code generation failed"],
      }
    }    
  }else{
    const prompt = CODE_GENERATOR_PROMPT(JSON.stringify(spec))
    
    try {
      code = await askCodeGenerator(prompt)
      const normalizedCode = normalizeCode(code)
      code = normalizedCode
    } catch {
      return {
        error: ["Code generation failed"],
      }

    }
  }  
  return{
    generatedCode:code
  }
}