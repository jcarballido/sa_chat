export default function normalizeCode(code:string): string{
  const outputSplit = code.split('\n')
  let start = 0
  let last = outputSplit.length - 1
  
  while(start < last && outputSplit[start]?.trim() == '') start++
  while(last > start && outputSplit[last]?.trim() == '') last--
  
  if(outputSplit[start]?.trim().startsWith(`\`\`\``)){
    start++
    if(outputSplit[last]?.trim().startsWith(`\`\`\``)){
      last--
    }
  }
  const trimmedOutput = outputSplit.slice(start,last+1).join('\n')
  return trimmedOutput  
}
