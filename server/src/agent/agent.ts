import { StateGraph } from "@langchain/langgraph"
// import { AgentState } from "./state.js"
import { generateSpecNode } from "./nodes/generateSpecNode.js"
import { reviewSpecNode } from "./nodes/reviewSpecNode.js"
import { generateCodeNode } from "./nodes/generateCodeNode.js"
import { validateCodeNode } from "./nodes/validateCodeNode.js"
import { reviewCodeNode } from "./nodes/reviewCodeNode.js"
import { writeFileNode } from "./nodes/writeFileNode.js"
import { agentState } from "./state.js"
import { collectIntentNode } from "./nodes/collectIntentNode.js"
import { processInitialIntentNode } from "./nodes/processInitialIntentNode.js"
import { refineIntentNode } from "./nodes/refineIntentNode.js"

export const agent = new StateGraph(agentState)
  .addNode("collectIntentNode", collectIntentNode)
  .addNode("processInitialIntentNode", processInitialIntentNode)
  .addNode("refineIntentNode", refineIntentNode)
  .addNode("generateSpecNode",generateSpecNode)
  .addNode("reviewSpecNode",reviewSpecNode)
  .addNode("generateCodeNode", generateCodeNode)
  .addNode("validateCodeNode", validateCodeNode)
  .addNode("reviewCodeNode", reviewCodeNode)
  .addNode("writeFileNode", writeFileNode)
  .addEdge("__start__","collectIntentNode")
  .addConditionalEdges("collectIntentNode", (agentState) =>{
    if(agentState.exited?.status === true) {
      console.log("Process ended at COLLECT INTENT NODE")
      return "EXITED"
    }
    return "CONTINUE"
  },{
    "EXITED": "__end__",
    "CONTINUE": "processInitialIntentNode"
  })
  .addConditionalEdges("processInitialIntentNode", (agentState) => {
    if(agentState.clarifyingQuestions) return "CLARIFY_INTENT"
    return "REVIEW_SPECIFICATION"
  },{
    "CLARIFY_INTENT":"refineIntentNode",
    "REVIEW_SPECIFICATION":"reviewSpecNode"
  })
  .addConditionalEdges("refineIntentNode", (agentState) => {
    if(agentState.specification) return "SPEC_REFINED"
    console.log("SPECIFICATION COULD NOT BE GENERATED. EXITING.")
    return "ERROR"
  },{
    "SPEC_REFINED":"reviewSpecNode",
    "ERROR":"__end__"
  })
  // .addEdge("generateSpecNode","reviewSpecNode")
  .addConditionalEdges("reviewSpecNode",(agentState) => {
    if(agentState.specificationRegenerationAttempts > 2){
      console.log("SPECIFICATION REGENERATION ATTEMPTS EXCEEDED.EXITING.")
      return "ATTEMPTS_EXCEEDED"
    }  
    if(agentState.specificationFeedback || !agentState.specificationApproval) return "REGENERATE"
    return "APPROVED"
  },{
    "ATTEMPTS_EXCEEDED":"__end__",
    "REGENERATE":"generateSpecNode",
    "APPROVED": "generateCodeNode"
  })
  .addEdge("generateCodeNode","validateCodeNode")
  .addConditionalEdges("validateCodeNode",(agentState) => {
    if(agentState.codeRegenerationAttempts > 2){
      console.log("CODE REGENERATION ATTEMPTS EXCEEDED.EXITING.")
      return "CODE_REGENERATION_ATTEMPTS_EXCEEDED"
    } 
    if(agentState.codeValidated){
      return "SUCCESSFULL"
    }
    console.log("Errors found in valiation:")
    console.log(agentState.error)
    console.log("Attempting to regenerate code...")
    return "FAILED"
  },{
    "CODE_REGENERATION_ATTEMPTS_EXCEEDED":"__end__",
    "SUCCESSFULL":"reviewCodeNode",
    "FAILED":"generateCodeNode"
  })
  .addConditionalEdges("reviewCodeNode",(agentState) => {
    if(agentState.codeApproved) return "CODE_APPROVED"
    return "REJECTED"
  },{
    "CODE_APPROVED":"writeFileNode",
    "REJECTED": "generateCodeNode"
  })
  .addEdge("writeFileNode","collectIntentNode")
  .compile()
    
