export default function stringExists(llmResponse: string, regex: RegExp): {result: true, match:string} | {result: false}{

  const match = llmResponse.match(regex)
  console.log("LLM Response Passed into stringExists: ")
  console.log(llmResponse)
  console.log("stringExists MATCH RESULT:")
  console.log(match)

  if(match) {
    const result = match[1]
    if(result) return {result: true, "match": JSON.parse(result)}
  }
  return {result: false}
}