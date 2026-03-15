import { StateGraph } from "@langchain/langgraph"
import { generateSpecNode } from "./nodes/generateSpecNode.js"
import { reviewSpecNode } from "./nodes/reviewSpecNode.js"
import { generateCodeNode } from "./nodes/generateCodeNode.js"
import { validateCodeNode } from "./nodes/validateCodeNode.js"
import { reviewCodeNode } from "./nodes/reviewCodeNode.js"
import { writeFileNode } from "./nodes/writeFileNode.js"
import { agentState } from "./state.js"
import { classifyInitialMessageNode } from "./nodes/classifyInitialMessageNode.js"
import { processInitialIntentNode } from "./nodes/processInitialIntentNode.js"
import { refineIntentNode } from "./nodes/refineIntentNode.js"
import { initializeSystemPrompt } from "./nodes/initializeSystemPrompt.js"
import { verifyClassificationNode } from "./nodes/verifyClassificationNode.js"

export const agent = new StateGraph(agentState)
  .addNode("initializeSystemPrompt",initializeSystemPrompt)
  .addNode("classifyInitialMessageNode", classifyInitialMessageNode)
  .addNode("verifyClassificationNode", verifyClassificationNode)
  .addNode("maliciousIntentNode", maliciousIntent)

  .addNode("processInitialIntentNode", processInitialIntentNode)
  .addNode("refineIntentNode", refineIntentNode)
  .addNode("generateSpecNode",generateSpecNode)
  .addNode("reviewSpecNode",reviewSpecNode)
  .addNode("generateCodeNode", generateCodeNode)
  .addNode("validateCodeNode", validateCodeNode)
  .addNode("reviewCodeNode", reviewCodeNode)
  .addNode("writeFileNode", writeFileNode)
  .addEdge("__start__","initializeSystemPrompt")
  .addEdge("initializeSystemPrompt","classifyInitialMessageNode")
  .addEdge("classifyInitialMessageNode","verifyClassificationNode")
  .addConditionalEdges("verifyClassificationNode", (agentState) => {
    if(agentState.retries >= 5 ) return "TOO_MANY_RETRIES"
    if(agentState.classification == "malicious") return "MALICIOUS_INTENT"
    if(agentState.classification == "out_of_scope") return "OUT_OF_SCOPE_INTENT"
    if(agentState.classification == "adjacent") return "ADJACENT_INTENT"
    if(agentState.classification == "focused") return "FOCUSED"
  },{
    "TOO_MANY_RETRIES": "__end__",
    "MALICIOUS_INTENT":"maliciousIntentNode",
    "OUT_OF_SCOPE_INTENT":,
    "FOCUSED":
  })
  .addConditionalEdges("classifyInitialMessageNode",(agentState) => {
    if(agentState.retries >= 5 ) return "TOO_MANY_RETRIES"
    },
    {
      "TOO_MANY_RETRIES": "__end__"
    }
  )
  .addConditionalEdges("collectIntentNode", (agentState) =>{
  })
  .addConditionalEdges("processInitialIntentNode", (agentState) => {
  })
  .addConditionalEdges("refineIntentNode", (agentState) => {
  })
  .addConditionalEdges("reviewSpecNode",(agentState) => {
  })
  .addEdge("generateCodeNode","validateCodeNode")
  .addConditionalEdges("validateCodeNode",(agentState) => {
  })
  .addConditionalEdges("reviewCodeNode",(agentState) => {
  })
  .addEdge("writeFileNode","collectIntentNode")
  .compile()
    
