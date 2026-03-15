import { StateGraph } from "@langchain/langgraph"
import { agentState } from "./state.js"
import { classifyInitialMessageNode } from "./nodes/classifyInitialMessageNode.js"
import { initializeSystemPrompt } from "./nodes/initializeSystemPrompt.js"
import { verifyClassificationNode } from "./nodes/verifyClassificationNode.js"
import { outOfScopeIntentNode } from "./nodes/outOfScopeIntentNode.js"
import { adjacentIntentNode } from "./nodes/adjacentIntentNode.js"
import { focusedIntentNode } from "./nodes/focusedIntentNode.js"
import { maliciousIntentNode } from "./nodes/maliciousIntentNode.js"

export const agent = new StateGraph(agentState)
  .addNode("initializeSystemPrompt",initializeSystemPrompt)
  .addNode("classifyInitialMessageNode", classifyInitialMessageNode)
  .addNode("verifyClassificationNode", verifyClassificationNode)
  .addNode("maliciousIntentNode", maliciousIntentNode)
  .addNode("outOfScopeIntentNode", outOfScopeIntentNode)
  .addNode("adjacentIntentNode", adjacentIntentNode)
  .addNode("focusedIntentNode", focusedIntentNode)
  .addEdge("__start__","initializeSystemPrompt")
  .addEdge("initializeSystemPrompt","classifyInitialMessageNode")
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
  .addEdge("adjacentIntentNode","__end__")
  .addEdge("focusedIntentNode","__end__")
  .compile()
    
