import { distance } from "fastest-levenshtein"
export function findBestMatch(candidate: string, allowedModels: string[]) {
  let bestMatch: string | null = null
  let bestScore: number = Infinity
  
  for (const allowedModel of allowedModels){
    const d = distance(candidate,allowedModel)
    if(d < bestScore){
      bestMatch = allowedModel
      bestScore = d
    }
  }

  return bestMatch
}