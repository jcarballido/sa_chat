import type { LLMcall } from "../infrastructure/buildLlmCall.js"

const logOut = (logs: string[]) => {
  console.log("---")
  for (const log of logs){
    console.log(log)
  }
  console.log("---")
}

export function buildServices(llm: LLMcall, executionService: ReturnType<typeof import("../infrastructure/buildDomainExecutionService.js").buildDomainExecutionServices>){

  async function processMessage() {
    const result = await executionService.getSimilarModels("model",{
      "fire_rating":{
        "time":60,
        "temp":1400
      },
      "gun_count":30
    })
    console.log("RESULT:")
    console.log(result)
  }

  // async function processMessage(prompt: string){
  //   const classification = await llm.classification(prompt)
  //   const parsedClassification: {"intent": "malicious"|"out_of_scope"|"adjacent"|"focused"} = JSON.parse(classification)
  //   const { intent } = parsedClassification

  //   switch(intent){
  //     case "malicious":
  //       logOut(["MALICIOUS"])
  //       return {message: "I cannot execute this task. Is there anything about our safes I can help you determine?"}
  //     case "out_of_scope":
  //       logOut(["OUT_OF_SCOPE"])
  //       return {message: "This is outside the scope of my abilities. Is there anything about our safes I can help you determine?"}
  //     case "adjacent":
  //       logOut(["ADJACENT"])
  //     const response = await llm.generalChat(prompt)
  //       return {message: response}
  //     case "focused":
  //       logOut(["FOCUSED"])
  //       const objectives = await llm.extractObjectives(prompt)
  //       const model = await llm.extractModel(prompt)        
  //   }
    
  // }

  return{
    processMessage
  }
}