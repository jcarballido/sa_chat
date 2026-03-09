import type { MessageStore } from "./buildMessageStore.js";
import type { CsvQuery, Filter, Operators, SpecCriteria } from "../types/types.js";

export function buildDomainExecutionServices(inventoryStore: CsvQuery, specificationStore: CsvQuery, messageStore: MessageStore){
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
        const req = requirement as Operators<T[keyof T]>
        if(req?.eq !== undefined && value !== req.eq) return false
        if(req?.neq !==undefined && value == req.neq) return false
        if(req?.gt !== undefined && req?.gt !== null && value <= req.gt) return false
        if(req?.gte !== undefined && req?.gte !== null && value < req.gte) return false 
        if(req?.lt !== undefined && req?.lt !== null && value >= req.lt) return false
        if(req?.lte !== undefined && req?.lte !== null && value > req.lte) return false 
        return true
      }) 
    })

    return results
  }

  async function getSimilarModels(model:string, criteria:SpecCriteria) {
    // Get all specs:
    const allData = specificationStore.rows
    // Get original model specs
    const referenceModel = await getModelSpecs(model)
    const rating_time = referenceModel.specs
    // Check if there are specific specs that must be focused on
    const {fire_rating, waterpoof, gun_count, external_dimensions} = criteria ?? {}
    // Build search criteria.
    const requirements = {}
    if(fire_rating){
      const {time,temp} = fire_rating
      if(time) {
        const fire_rating_time = specificationStore.getColumnValues("fire_rating_time")
      }
      if(temp) {
        const fire_rating_temp = specificationStore.getColumnValues("fire_rating_temp")
      }
    }
    if(gun_count){
      const gun_count_values = specificationStore.getColumnValues("gun_count") 
    }
    if(external_dimensions){
      const {height,width,depth} = external_dimensions
      if(height) { const heights = specificationStore.getColumnValues("height") }
      if(width){ const widths = specificationStore.getColumnValues("width") }
      if(depth){ const depth = specificationStore.getColumnValues("depths") }
    }

    // Search
    // const similarModels = filterBy(allSpecs,)
    
    // return {
    //   similarModels
    // }
  }

  const getAllData = () => {
    return specificationStore.rows
  }

  return{
    getModelSpecs,
    getSimilarModels,
    getAllData
  }
}