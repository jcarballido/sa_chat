import { MATCH_CANDIDATES, NONENGLISH_MODEL_NUMBERS } from "../../constants/system_prompts.js";
import type { State, Update } from "../intentAgentState.js";
import { askLLM } from "../util/askLLM.js";
import { distance } from "fastest-levenshtein";
import { findBestMatch } from "../util/findBestMatch.js";

export async function modelMatchingNode(state:State): Promise<Update> {
  
  console.log("MODEL MATCHING NODE running.")

  const candidates = state.candidates
  // const matchPrompt = MATCH_CANDIDATES(candidates, state.inventoryStore)
  // console.log("INVENTORY PASSED IN:")
  // console.log(state.inventoryStore)

  if(candidates){
    const inventorySet = new Set(state.inventoryStore)
    const matches = candidates.map(candidate => {
      if(inventorySet.has(candidate)) return candidate
      const match = findBestMatch(candidate,state.inventoryStore)
      return match
    })
    console.log("MATCHES BY LEVIATHIAN:")
    console.log(matches)

    const filteredMatches = matches.filter((match) => match !== null)
    console.log("FILTERED MATCHES:")
    console.log(filteredMatches)
    return {
      latestLLMResponse: JSON.stringify(filteredMatches)
    }
  }
  console.log("NO MATCHES IN CANDIDATES")
  return{}

  // try {
    // const response = await askLLM(state.initialMessage,{systemPrompt: matchPrompt})
    // console.log("MODEL matching response:")
    // console.log(response.message.content)
    // return {
      // latestLLMResponse: response.message.content,
    // }
  // } catch (error) {
    // console.log("Error thrown in MODEL EXTRACTION NODE")
    // throw error
  // }  
}