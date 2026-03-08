import type { MessageStore } from "./buildMessageStore.js";
import type { CsvQuery } from "./buildStore.js";
import type { Filter, Operators, SpecCriteria } from "../types/types.js";
import type { object } from "zod";

export function buildDomainExecutionService(inventoryStore: CsvQuery, specificationStore: CsvQuery, messageStore: MessageStore){
  async function getModelSpecs(model:string) {
    const specs = specificationStore.getRowsByColumnValue("model",model)
    return { specs }
  }

  function filterBy<T extends object>(
    rows: T[],
    requirements: Filter<T>
  ): T[]{
    const results = rows.filter((row) => {      
      Object.entries(requirements).every(([key, requirement]) => {
        const value = row[key as keyof T]
        const req = requirements as Operators<T[keyof T]>
        if(req?.eq !== undefined && value !== req.eq) return false
        return true
      }) 
    })
  }

  async function search(requestedSpecs:SpecCriteria) {
    // Loop through each object and if the fields specified meet the requirements, return that object
    
    
  }

  async function getSimilarModels(model:string, criteria:SpecCriteria) {
    // Get original model specs
    const referenceModel = await getModelSpecs(model)
    // Check if there are specific specs that must be focused on
    const {fire_rating, waterpoof, gun_count, external_dimensions} = criteria ?? {}
    if(fire_rating){
      // Get all fire ratings
      const {time,temp} = fire_rating

    }
    if(waterpoof){
      if(waterpoof){} //get all waterproof safes
      else {} //get nonwaterproof 
    }
    if(gun_count){
      // Get all gun count values
    }
    if(external_dimensions){
      const {height,width,depth} = external_dimensions
    }
    // Build search criteria.
    const similarModels = search()
    
    return {
      similarModels
    }
  }

  return{
    getModelSpecs,
    getSimilarModels
  }
}