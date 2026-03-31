import { distance } from "fastest-levenshtein"
export function findBestMatch(candidate: string, allowedModels: string[]) {
  let bestMatch: string | null = null
  let bestScore: number = Infinity
  
  for (const allowedModel of allowedModels){
    const d = distance(candidate,allowedModel)
    const maxDifferenceCharPercent = 0.35
    const maxCharDistance = Math.floor(allowedModel.length / (1/maxDifferenceCharPercent))
    if(d > maxCharDistance) bestMatch = null
    if(d < bestScore){
      bestMatch = allowedModel
      bestScore = d
    }
    console.log("DISTANCE in findBestMatch: ",d)
    console.log("MODEL in findBestMatch: ", bestMatch)
  }

  return bestMatch
}