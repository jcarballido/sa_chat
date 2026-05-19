import type { Domain } from "node:domain";
import { MALICIOUS_INTENT_RESPONSES, OUT_OF_SCOPE_RESPONSES } from "./constants/constants.js";
import type { ComparisonResultType, LLMResponseType } from "./types/api.types.js";
import type { DomainExecutionType } from "./services/domainExecution.services.js";
import type { SpecRowType } from "./types/stores.types.js";

const generateRandomNumber: (arr: string[]) => number = (arr) => {
  const n = Math.floor(Math.random() * ((arr.length - 1)))
  return n
}

export const llmResponses = {

  reject: function reject (type: "malicious"|"out_of_scope"|"related"|"other"|"empty",title?: string|null): Extract<LLMResponseType, {type:"malicious"|"out_of_scope"|"related"|"other"|"empty"}> {
    let automaticResponses: string[]
    let fallback: typeof automaticResponses[number]
    let n: number    

    if(type === "malicious"){
      automaticResponses = MALICIOUS_INTENT_RESPONSES
      fallback =  "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere."
      n = generateRandomNumber(automaticResponses)
    }else if(type === "out_of_scope"){
      automaticResponses = OUT_OF_SCOPE_RESPONSES
      fallback = "That\’s outside my lane, I\’m here for more specific tasks."
      n = generateRandomNumber(automaticResponses)
    }else {
      fallback = "Something went wrong."
      return {
        title: title ?? "",
        type,
        text:fallback,
        data:null
      }
    }

    return {
      title: title ?? "",
      type,
      text:automaticResponses[n] ?? fallback,
      data:null
    }
  },

  similarProducts: function similarProducts (res: ComparisonResultType[],title?: string | null): Extract<LLMResponseType, {type: "similar_products"}> {
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
  },

  productComparison: function productComparison (data: SpecRowType[], title?: string | null): Extract<LLMResponseType,{type:"product_lookup_by_model"| "product_lookup_by_specs"|"product_comparison"}>{
    return {
      title: title ?? "",
      type: "product_comparison",
      text:null,
      data: data
    }
  },
  productLookupByModel:  function productLookupByModel (data: SpecRowType[], title?: string | null): Extract<LLMResponseType,{type:"product_lookup_by_model"| "product_lookup_by_specs"|"product_comparison"}>{
    return {
      title: title ?? "",
      type: "product_lookup_by_model",
      text: null,
      data
    }
  },
  productLookupBySpecs:  function productLookupBySpecs (data: SpecRowType[], title?: string | null): Extract<LLMResponseType,{type:"product_lookup_by_model"| "product_lookup_by_specs"|"product_comparison"}>{
    return {
      title: title ?? "",
      type: "product_lookup_by_specs",
      text: null,
      data
    }
  },
}