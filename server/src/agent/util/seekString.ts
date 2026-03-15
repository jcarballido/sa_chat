export default function stringExists(llmResponse: string, regex: RegExp): {result: true, match:string} | {result: false}{

  const match = llmResponse.match(regex)

  if(match) return {result: true, match: match[0]}

  return {result: false}
}