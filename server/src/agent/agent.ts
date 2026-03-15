import { StateGraph } from "@langchain/langgraph"
import { agentState } from "./state.js"
import { classifyInitialMessageNode } from "./nodes/classifyInitialMessageNode.js"
import { initializeSystemPrompt } from "./nodes/initializeSystemPrompt.js"
import { verifyClassificationNode } from "./nodes/verifyClassificationNode.js"
import { outOfScopeIntentNode } from "./nodes/outOfScopeIntentNode.js"
import { adjacentIntentNode } from "./nodes/adjacentIntentNode.js"
import { focusedIntentNode } from "./nodes/focusedIntentNode.js"
import { maliciousIntentNode } from "./nodes/maliciousIntentNode.js"
import { verifyAdjacentIntentNode } from "./nodes/verifyAdjacentResponseNode.js"
import { verifyFocusedIntentNode } from "./nodes/verifyFocusedIntentNode.js"

export const agent = new StateGraph(agentState)
  // .addNode("initializeSystemPrompt",initializeSystemPrompt)
  .addNode("classifyInitialMessageNode", classifyInitialMessageNode)
  .addNode("verifyClassificationNode", verifyClassificationNode)
  .addNode("maliciousIntentNode", maliciousIntentNode)
  .addNode("outOfScopeIntentNode", outOfScopeIntentNode)
  .addNode("adjacentIntentNode", adjacentIntentNode)
  .addNode("focusedIntentNode", focusedIntentNode)
  .addNode("verifyAdjacentResponseNode", verifyAdjacentIntentNode)
  .addNode("verifyFocusedIntentNode", verifyFocusedIntentNode)
  .addEdge("__start__","classifyInitialMessageNode")
  .addEdge("classifyInitialMessageNode","verifyClassificationNode")
  .addConditionalEdges("verifyClassificationNode", (agentState) => {
    const classification = agentState.classification
    if(classification == "malicious") return "MALICIOUS_INTENT"
    if(classification == "out_of_scope") return "OUT_OF_SCOPE_INTENT"
    if(classification == "adjacent") return "ADJACENT_INTENT"
    if(classification =="focused") return "FOCUSED"    
    if(!classification && agentState.retries < 5) return "RETRY"
    return "TOO_MANY_RETRIES"
  },{
    "RETRY":"classifyInitialMessageNode",
    "TOO_MANY_RETRIES": "__end__",
    "MALICIOUS_INTENT":"maliciousIntentNode",
    "OUT_OF_SCOPE_INTENT":"outOfScopeIntentNode",
    "ADJACENT_INTENT": "adjacentIntentNode",
    "FOCUSED":"focusedIntentNode",
  })
  .addEdge("maliciousIntentNode","__end__")
  .addEdge("outOfScopeIntentNode","__end__")
  .addEdge("adjacentIntentNode","verifyAdjacentResponseNode")
  .addConditionalEdges("verifyAdjacentResponseNode",(agentState)=>{
    if(agentState.finalResponse) return "FINAL_RESPONSE"
    if(!agentState.finalResponse && agentState.retries <= 5) return "RETRY"
    return "TOO_MANY_RETRIES"
  },{
    "FINAL_RESPONSE": "__end__",
    "RETRY" : "adjacentIntentNode",
    "TOO_MANY_RETRIES":"__end__"
  })
  .addEdge("focusedIntentNode","verifyFocusedIntentNode")
  .addConditionalEdges("verifyFocusedIntentNode",(agentState)=> {
    return "END"
  },{
    "END": "__end__"
  })
  .compile()
    
