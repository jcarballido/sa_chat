import { StateGraph } from "@langchain/langgraph"
import { agentState } from "./state.js"
import { classifyInitialMessageNode } from "./nodes/classifyInitialMessageNode.js"
import { verifyClassificationNode } from "./nodes/verifyClassificationNode.js"
import { outOfScopeIntentNode } from "./nodes/outOfScopeIntentNode.js"
import { adjacentIntentNode } from "./nodes/adjacentIntentNode.js"
import { focusedIntentNode } from "./nodes/focusedIntentNode.js"
import { maliciousIntentNode } from "./nodes/maliciousIntentNode.js"
import { verifyAdjacentIntentNode } from "./nodes/verifyAdjacentResponseNode.js"
import { verifyFocusedIntentNode } from "./nodes/verifyFocusedIntentNode.js"
import { modelExtractionNode } from "./nodes/modelExtractionNode.js"
import { verifyModelExtractionNode } from "./nodes/verifyModelExtractionNode.js"
import { specExtractionNode } from "./nodes/specExtractionNode.js"
import { verifySpecExtractionNode } from "./nodes/verifySpecExtractionNode.js"

export const agent = new StateGraph(agentState)
  .addNode("classifyInitialMessageNode", classifyInitialMessageNode)
  .addNode("verifyClassificationNode", verifyClassificationNode)
  .addNode("maliciousIntentNode", maliciousIntentNode)
  .addNode("outOfScopeIntentNode", outOfScopeIntentNode)
  .addNode("adjacentIntentNode", adjacentIntentNode)
  .addNode("focusedIntentNode", focusedIntentNode)
  .addNode("verifyAdjacentResponseNode", verifyAdjacentIntentNode)
  .addNode("verifyFocusedIntentNode", verifyFocusedIntentNode)
  .addNode("modelExtractionNode", modelExtractionNode)
  .addNode("verifyModelExtractionNode",verifyModelExtractionNode)
  .addNode("specExtractionNode", specExtractionNode)
  .addNode("verifySpecExtractionNode",verifySpecExtractionNode)
  .addEdge("__start__","classifyInitialMessageNode")
  .addEdge("classifyInitialMessageNode","verifyClassificationNode")
  .addConditionalEdges("verifyClassificationNode", (agentState) => {
    const classification = agentState.initialMessageClassification
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
    if(agentState.focusedIntent) return "FOCUSED_INTENT"
    if(!agentState.focusedIntent && agentState.retries <= 5) {
      console.log("RETRY ATTEMPTING...")
      return "RETRY"
    }
    return "TOO_MANY_RETRIES"
  },{
    "FOCUSED_INTENT": "modelExtractionNode",
    "RETRY" : "focusedIntentNode",
    "TOO_MANY_RETRIES":"__end__"
  })
  .addEdge("modelExtractionNode","verifyModelExtractionNode")
  .addConditionalEdges("verifyModelExtractionNode",(agentState) => {
    if(agentState.modelsExtracted) return "MODELS_EXTRACTED"
    if(!agentState.modelsExtracted && agentState.retries <= 5) return "RETRY"
    return "TOO_MANY_RETRIES"
  },{
    "MODELS_EXTRACTED":"specExtractionNode",
    "RETRY":"modelExtractionNode",
    "TOO_MANY_RETRIES":"__end__"
  })
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
    
