import type { State, Update } from '../state.js'

function isValid(generatedCode:string): boolean{
  if(!generatedCode.includes('export')) return false
  if(generatedCode.includes('---')) return false
  return true
}

export async function validateCodeNode(state: State): Promise<Update>{
    console.log('→ VALIDATE_CODE')

    const code = state.generatedCode
  
    if(!code) throw new Error('Missing generated code.')

    if(isValid(code)){
      console.log("Code is determined to be valid.")
      return{
        codeValidated: true
      }
    }else{
      console.log("Code has errors.")
      const errors = []

      if(!code.includes('export')) errors.push('Missing export statement')
      if(code.includes('---')) errors.push('Code was fenced in by \`\`\`')

      return{
        error: errors,
        codeRegenerationAttempts: state.codeRegenerationAttempts + 1
      } 
    }    
} 