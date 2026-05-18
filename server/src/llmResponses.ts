import type { Domain } from "node:domain";
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "./constants/constants.js";
import type { ComparisonResultType, LLMResponseType } from "./types/api.types.js";
import type { DomainExecutionType } from "./services/domainExecution.services.js";

const generateRandomNumber: (arr: string[]) => number = (arr) => {
  const n = Math.floor(Math.random() * ((arr.length - 1)))
  return n
}

export const llmResponses = {

  reject: function reject (type: "malicious"|"out_of_scope"|"related"|"other"|"empty",title?: string|null): Extract<LLMResponseType, {type:"malicious"|"out_of_scope"|"related"|"other"|"empty"}> {
    let automaticResponses: string[]
    let n: number    
    if(type === "malicious"){
      automaticResponses = MALICIOUS_INTENT_RESPONSES
      n = generateRandomNumber(automaticResponses)
    }else{
      automaticResponses = OUT_OF_SCOPE_RESPONSES
      n = generateRandomNumber(automaticResponses)
    }

    return {
      title: title ?? "",
      type,
      text:automaticResponses[n] ?? "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere.",
      data:null
    }
  },
  similarProducts: function similarProducts (res: ComparisonResultType[],title?: string): Extract<LLMResponseType, {type: "similar_products"}> {
    return {
      title: title ?? "",
      type:"similar_products",
      text:null,
      data:res
    }
  },
  related: function related (text: string, title?: string | null): Extract<LLMResponseType,{type:"malicious"|"out_of_scope"|"related"|"other"|"empty"}>{
    return {
      title: title ?? "",
      type: "related",
      text,
      data:null
    }
  }
}