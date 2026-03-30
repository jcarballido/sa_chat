import { StateGraph } from "@langchain/langgraph"
import { agentState, type GeneralLLMState, type Update } from "./generalAgentState.js"
import { askLLM } from "./util/askLLM.js"

const node = async(agentState: GeneralLLMState): Promise<Update> =>{
    const res = await askLLM("",{systemPrompt:agentState.systemPrompt})
    return {
        res: res.message.content
    }
}

export const generalLLMAgent = new StateGraph(agentState)
    .addNode('node', node)
    .addEdge("__start__",'node')
    .addEdge('node', "__end__")
    .compile()