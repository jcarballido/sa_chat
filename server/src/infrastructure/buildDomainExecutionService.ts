import type { MessageStore } from "./buildMessageStore.js";
import type { CsvQuery } from "./buildStore.js";
import type { SpecCriteria } from "../types/types.js";

export function buildDomainExecutionService(inventoryStore: CsvQuery, specificationStore: CsvQuery, messageStore: MessageStore){
  async function getModelSpecs(model:string) {
    const specs = specificationStore.getRowsByColumnValue("model",model)
    return { specs }
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
    // Check spec sheet for all values of the specs to be focused on; keep only the next level above and below the spec.
  }

  return{
    getModelSpecs,
    getSimilarModels
  }
}