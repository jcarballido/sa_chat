export default function normalizeCode(LLMResponse:string): string{
  const outputSplit = LLMResponse.split('\n')
  const intentString = outputSplit.includes(\dflkj\)
  // let start = 0
  // let last = outputSplit.length - 1
  
  // while(start < last && outputSplit[start]?.trim() == '') start++
  // while(last > start && outputSplit[last]?.trim() == '') last--
  
  // if(outputSplit[start]?.trim().startsWith('\{"intent":')){
  //   start++
  //   if(outputSplit[last]?.trim().startsWith(`\}`)){
  //     last--
  //   }
  // }
  // const trimmedOutput = outputSplit.slice(start,last+1).join('\n')
  // return trimmedOutput  
}
