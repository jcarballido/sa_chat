// import type { AgentStateType } from "../state.js"
import type { State, Update } from "../state.js"
import { ask } from "../util/ask.js"

export async function reviewSpecNode(state: State):Promise<Update> {
  console.log("→ REVEIW_SPEC")

  if(!state.specification) throw new Error("ReviewSpecNode: Specification is undefined. ")

  console.log('---Component Spec from LLM---')
  console.log('START')
  console.log(state.specification)
  console.log('END')
  console.log('------')

  const answer = await ask(
    "Approve spec? (y = approve / r = regenerate): "
  )

  if (answer.toLowerCase() !== "y") {
    const feedback = await ask("Is there any feedback?\n")
    if(feedback){
      return {
        specificationRegenerationAttempts: state.specificationRegenerationAttempts + 1,
        specificationFeedback:feedback,
        specificationHistory: state.specification
      }
    }
    return {
      specificationRegenerationAttempts: state.specificationRegenerationAttempts + 1,
      specificationFeedback: undefined
    }
  }

  return {
    specificationApproval: true,
    specificationRegenerationAttempts: 0,
    specificationFeedback: undefined
  }
  // checkpoint("SPEC_APPROVED", nextState)
}