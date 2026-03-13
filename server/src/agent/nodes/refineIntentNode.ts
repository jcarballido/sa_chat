import { SPEC_REFINING_PROMPT, SPEC_REVISION_GENERATOR_PROMPT } from "../constants/constants.js";
import type { State, Update } from "../state.js";
import { answer } from "../util/answer.js";
import askPlanner from "../util/askSpecGenerator.js";

export async function refineIntentNode(state:State): Promise<Update> {
    
    if(!state.clarifyingQuestions) throw new Error("MISSING clarifying questions in refineIntentNode.")

    const questionAndAnswers = await answer(state.clarifyingQuestions)

    const prompt = SPEC_REFINING_PROMPT(state.initialIntent, questionAndAnswers)
        
    try {
        const response = await askPlanner(prompt)
        const parsedResponse = JSON.parse(response)
        return{
            specification: parsedResponse,
            clarifyingQuestions:undefined
        }
    } catch (error) {
        return{
            error:[`${error}`]
        }
    }
    
}