import { StateGraph } from "@langchain/langgraph"
import { agentState, type GeneralLLMState, type Update } from "./generalAgentState.js"

const node = async(agentState: GeneralLLMState): Promise<Update> =>{return {res: "dfa"}}

export const generalLLMAgent = new StateGraph(agentState)
    .addNode('node', node)
    .addEdge("__start__",'node')
    .addEdge('node', "__end__")
    .compile()