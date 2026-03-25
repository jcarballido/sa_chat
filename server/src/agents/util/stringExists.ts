export default function stringExists(llmResponse: string, regex: RegExp): {result: true, match:string} | {result: false}{

  const match = llmResponse.match(regex)

  if(match) {
    const models = match[1]
    if(models) return {result: true, "match": JSON.parse(models)}
  }
  return {result: false}
}