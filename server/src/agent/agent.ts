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

export const agent = new StateGraph(agentState)
  .addNode("initializeSystemPrompt",initializeSystemPrompt)
  .addNode("classifyInitialMessageNode", classifyInitialMessageNode)
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
    
