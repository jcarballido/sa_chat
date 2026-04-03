export default function stringExists(llmResponse: string, regex: RegExp): {result: true, match:string} | {result: false}{

  const match = llmResponse.match(regex)
  console.log("LLM Response Passed into stringExists: ")
  console.log(llmResponse)
  console.log("stringExists MATCH RESULT:")
  console.log(match)

  if(match) {
    const result = match[1]
    console.log("Result from MATCH, index 1")
    console.log(result)
    try {
      if(result) return {result: true, "match": JSON.parse(result)}      
    } catch (error) {
      console.log("ERROR IN stringExists")
      console.log(error)
    }
  }
  return {result: false}
}