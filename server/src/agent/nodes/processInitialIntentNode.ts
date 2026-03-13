import { SPEC_GENERATOR_PROMPT } from "../constants/constants.js";
import type { State, Update } from "../state.js";
import askPlanner from "../util/askSpecGenerator.js";

export async function processInitialIntentNode(state:State): Promise<Update> {

	const prompt = SPEC_GENERATOR_PROMPT(state.initialIntent)

	try {
		const response = await askPlanner(prompt)
		const parsedResponse = JSON.parse(response)
		if(parsedResponse.clarifyingQuestions){
			return{
				clarifyingQuestions: parsedResponse.clarifyingQuestions,
				specification:undefined
			}
		}
		return {
			specification: parsedResponse,
			clarifyingQuestions: undefined
		}
	} catch (err) {
		console.log('Error caught in generating an INITIAL spec:')
		console.log(err)
		return {
			error: ["Failed to generate or parse in processInitialIntentNode"],
		}
	} 
}