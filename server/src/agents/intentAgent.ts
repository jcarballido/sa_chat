import { StateGraph } from "@langchain/langgraph"
import { agentState } from "./intentAgentState.js"
import { classifyInitialMessageNode } from "./nodes/classifyInitialMessageNode.js"
import { verifyClassificationNode } from "./nodes/verifyClassificationNode.js"
// import { outOfScopeIntentNode } from "./nodes/outOfScopeIntentNode.js"
import { adjacentIntentNode } from "./nodes/adjacentIntentNode.js"
import { focusedIntentNode } from "./nodes/focusedIntentNode.js"
// import { maliciousIntentNode } from "./nodes/maliciousIntentNode.js"
import { verifyAdjacentIntentNode } from "./nodes/verifyAdjacentResponseNode.js"
import { verifyFocusedIntentNode } from "./nodes/verifyFocusedIntentNode.js"
// import { modelExtractionNode } from "./nodes/modelExtractionNode.js"
// import { verifyModelExtractionNode } from "./nodes/verifyModelExtractionNode.js"
import { specExtractionNode } from "./nodes/specExtractionNode.js"
import { verifySpecExtractionNode } from "./nodes/verifySpecExtractionNode.js"
import { modelTokenExtractorNode } from "./nodes/modelTokenExtractorNode.js"
import { modelMatchingNode } from "./nodes/modelMatchingNode.js"
import { verifyModelTokenExtractorNode } from "./nodes/verifyModelTokenExtractorNode.js"

export const intentAgent = new StateGraph(agentState)
  .addNode("classifyInitialMessageNode", classifyInitialMessageNode)
  .addNode("verifyClassificationNode", verifyClassificationNode)
  .addNode("adjacentIntentNode", adjacentIntentNode)
  .addNode("verifyAdjacentResponseNode", verifyAdjacentIntentNode)
  .addNode("focusedIntentNode", focusedIntentNode)
  .addNode("verifyFocusedIntentNode", verifyFocusedIntentNode)
  .addNode("modelTokenExtractorNode", modelTokenExtractorNode)
  .addNode("verifyTokenNode", verifyModelTokenExtractorNode)
  .addNode("modelMatchingNode", modelMatchingNode)
  .addNode("specExtractionNode", specExtractionNode)
  .addNode("verifySpecExtractionNode",verifySpecExtractionNode)

  .addEdge("__start__", "classifyInitialMessageNode")
  .addEdge("classifyInitialMessageNode", "verifyClassificationNode")
  .addConditionalEdges("verifyClassificationNode", (agentState) => {
    const classification = agentState.initialMessageClassification
    if (classification == "malicious") return "MALICIOUS_INTENT"
    if (classification == "out_of_scope") return "OUT_OF_SCOPE_INTENT"
    if (classification == "adjacent") return "ADJACENT_INTENT"
    if (classification == "focused") return "FOCUSED"
    if (!classification && agentState.retries < 5) return "RETRY"
    return "TOO_MANY_RETRIES"
  }, {
    "RETRY": "classifyInitialMessageNode",
    "TOO_MANY_RETRIES": "__end__",
    "MALICIOUS_INTENT": "__end__",
    "OUT_OF_SCOPE_INTENT": "__end__",
    "ADJACENT_INTENT": "adjacentIntentNode",
    "FOCUSED": "focusedIntentNode",
  })
  .addEdge("adjacentIntentNode","verifyAdjacentResponseNode")
  .addConditionalEdges("verifyAdjacentResponseNode",(agentState)=>{
    if(agentState.relatedIntentLLMResponse) return "FINAL_RESPONSE"
    if(!agentState.relatedIntentLLMResponse && agentState.retries <= 5) return "RETRY"
    return "TOO_MANY_RETRIES"
  },{
    "FINAL_RESPONSE": "__end__",
    "RETRY" : "adjacentIntentNode",
    "TOO_MANY_RETRIES":"__end__"
  })
  .addEdge("focusedIntentNode","verifyFocusedIntentNode")
  .addConditionalEdges("verifyFocusedIntentNode",(agentState)=> {
    if(!agentState.focusedIntentClassification && agentState.retries <= 5) {
      console.log("RETRY ATTEMPTING...")
      return "RETRY"
    }
    if(agentState.focusedIntentClassification == "other" && agentState.retries < 5) return "RETRY"
    if(agentState.focusedIntent) return "FOCUSED_INTENT"
    return "TOO_MANY_RETRIES"
  },{
    "FOCUSED_INTENT": "modelTokenExtractorNode",
    "RETRY" : "focusedIntentNode",
    "TOO_MANY_RETRIES":"__end__"
  })
  .addEdge("modelTokenExtractorNode", "verifyTokenNode")
  .addConditionalEdges("verifyTokenNode", (agentState) => {
    if (!agentState.candidates && agentState.retries < 5) return "RETRY"
    return "CONTINUE"
  }, {
    "RETRY": "modelTokenExtractorNode",
    "CONTINUE": "modelMatchingNode"
  })
  .addEdge("modelMatchingNode", "specExtractionNode")
  .addEdge("specExtractionNode","verifySpecExtractionNode")
  .addConditionalEdges("verifySpecExtractionNode", (agentState) => {
    if(agentState.focusedIntentSpecsExtracted) return "SPECS_EXTRACTED"
    if(!agentState.focusedIntentSpecsExtracted && agentState.retries <5) return "RETRY"
    return "TOO_MANY_RETRIES" 
  },{
    "SPECS_EXTRACTED": "__end__",
    "RETRY": "specExtractionNode",
    "TOO_MANY_RETRIES":"__end__"
  })
  .compile()

