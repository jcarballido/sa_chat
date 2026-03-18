import type { LLMcall } from "../infrastructure/buildLlmCall.js"

const logOut = (logs: string[]) => {
  console.log("---")
  for (const log of logs){
    console.log(log)
  }
  console.log("---")
}

export function buildServices(llm: LLMcall, executionService: ReturnType<typeof import("../infrastructure/buildDomainExecutionService.js").buildDomainExecutionServices>){

  async function processMessage(message:string) {
    const confirmedInventoryModelNumbers = executionService.getInventoriedModelNumbers()
    return await llm.generalChat(message,confirmedInventoryModelNumbers)
    
  }


  return{
    processMessage
  }
}