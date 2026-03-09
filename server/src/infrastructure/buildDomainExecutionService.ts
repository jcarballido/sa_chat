import type { MessageStore } from "./buildMessageStore.js";
import type { Filter, InventoryStore, Operators, SpecCriteria, SpecificationStore } from "../types/types.js";

export function buildDomainExecutionServices(inventoryStore: InventoryStore, specificationStore: SpecificationStore, messageStore: MessageStore){
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
    // const allData = specificationStore.rows
    // Get original model specs
    // const referenceModel = await getModelSpecs(model)
    // const rating_time = referenceModel.specs
    // Check if there are specific specs that must be focused on
    console.log("Criteria Recieved:")
    console.log(criteria)
    const {fire_rating, waterpoof, gun_count, external_dimensions} = criteria ?? {}
    // Build search criteria.
    const requirements:{[k:string]:any[]|{[k:string]:any[]}} = {}
    if(fire_rating){
      const {time,temp} = fire_rating
      if(time) {
        const fire_rating_time = specificationStore.getColumnValues("fire_rating_time")
        requirements["time"] = fire_rating_time
      }
      if(temp) {
        const fire_rating_temp = specificationStore.getColumnValues("fire_rating_temp")
        requirements["temp"] = fire_rating_temp
        
      }
    }
    if(gun_count){
      const gun_count_values = specificationStore.getColumnValues("gun_count")
      requirements["gun"] = gun_count_values 
    }
    if(external_dimensions){
      const {height,width,depth} = external_dimensions
      if(height) { 
        const heights = specificationStore.getColumnValues("height")
        requirements["dim"] = {...requirements["dim"],"height":heights}
      }
      if(width){ 
        const widths = specificationStore.getColumnValues("width")
        requirements["dim"] = {...requirements["dim"],"width":widths}      
      }
      if(depth){
         const depths = specificationStore.getColumnValues("depth")
        requirements["dim"] = {...requirements["dim"],"depth":depths}
      }
    }

    return requirements
    
  }

  return{
    getModelSpecs,
    getSimilarModels,
  }
}