import type { MessageStore } from "./buildMessageStore.js";
import type { Filter, InventoryStore, Operators, SpecCriteria, SpecificationRow, SpecificationStore } from "../types/types.js";

export function buildDomainExecutionServices(inventoryStore: InventoryStore, specificationStore: SpecificationStore, messageStore: MessageStore){

  // Merge inventory store with specification store, left join
  function mergeStores(inventoryModels: SpecificationRow["model"][], allSpecs: SpecificationRow[]): {matches:SpecificationRow[],missing:{model:SpecificationRow["model"]}[]}{
    // inventoryModel:["model1", "model2", "model3"]
    // allSpecs: [{model:"model1", gun_count: 24,...},{model:"model2", gun_count: 32,...},{model:"model3", gun_count: 48,...}]
    
    //Create a map from allSpecs
    const specMap = new Map(allSpecs.map(modelSpec => [modelSpec.model, modelSpec]))
    const matches: SpecificationRow[] = []
    const missing: {"model":SpecificationRow["model"]}[] = []
    
    inventoryModels.map(inventoriedModel => {
      const result = specMap.get(inventoriedModel)
      result ? matches.push(result) : missing.push({"model":inventoriedModel})
    })

    return {
      matches,
      missing
    }
  } 

  const mergedInventoryAndSpecStore = mergeStores(inventoryStore.getColumnValues("model"), specificationStore.rows)

  async function getModelSpecs(model: SpecificationRow["model"]) {
    const specs = specificationStore.getRowsByColumnValue("model",model)
    return specs 
  }

  function filterBy(
    rows: SpecificationRow[],
    requirements: Filter<Omit<SpecificationRow, "waterproof">>
  ): SpecificationRow[]{
    const results = rows.filter((row) => {      
      return Object.entries(requirements).every(([key, requirement]) => {
        const value = row[key as keyof SpecificationRow]
        const req = requirement as Operators<SpecificationRow[keyof SpecificationRow]>
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

  function getOneBeforeAndAfter(values: number[], referenceValue: number):number[]{

    const sortedValues = [...new Set(values)].toSorted((a,b) => a-b) 
    const indexOfRefValue = sortedValues.indexOf(referenceValue)
    const oneValueBefore = indexOfRefValue == 0 ? undefined : sortedValues[indexOfRefValue - 1]
    const oneValueAfter = indexOfRefValue == sortedValues.length - 1 ? undefined : sortedValues[indexOfRefValue + 1] 
    return [oneValueBefore, referenceValue, oneValueAfter].filter(val => val !== undefined)
  }

  async function buildRequirements(model:SpecificationRow["model"], criteria: SpecCriteria){
    const match = await getModelSpecs(model)
    const referenceModel = match[0] // Reference model
    const {fire_rating, gun_count, waterpoof, external_dimensions} = criteria ?? {} // Check if there are specific specs that must be focused on
    
    const requirements:Filter<SpecificationRow> = {}
    
    if(fire_rating){
      const {time,temp} = fire_rating
      if(time) {  
        const referenceTime = referenceModel?.fire_rating_time!
        const fire_rating_times = specificationStore.getColumnValues("fire_rating_time")
        const valueWindow = getOneBeforeAndAfter(fire_rating_times,referenceTime)
        requirements["fire_rating_time"] = {gte:valueWindow[0]!, lte:valueWindow[valueWindow.length-1]!}
      }
      if(temp) {
        const referenceTemp = referenceModel?.fire_rating_temp!
        const fire_rating_temps = specificationStore.getColumnValues("fire_rating_temp")    
        const valueWindow = getOneBeforeAndAfter(fire_rating_temps,referenceTemp)
        requirements["fire_rating_temp"] = {gte:valueWindow[0]!, lte:valueWindow[valueWindow.length-1]!}    
      }
    }
    if(gun_count){
      const gun_count_values = specificationStore.getColumnValues("gun_count")
    }
    if(external_dimensions){
      const {height,width,depth} = external_dimensions
      if(height) { 
        const heights = specificationStore.getColumnValues("height")
      }
      if(width){ 
        const widths = specificationStore.getColumnValues("width")
      }
      if(depth){
         const depths = specificationStore.getColumnValues("depth")
      }
    }

    requirements["waterproof"] = {eq:false}

    return requirements

  }

  async function getSimilarModels(model:SpecificationRow["model"], criteria:SpecCriteria) {
    const requirements = await buildRequirements(model,criteria)
    const allInventorySpecs = mergedInventoryAndSpecStore.matches
    return filterBy(allInventorySpecs, requirements)
  }

  return{
    getModelSpecs,
    getSimilarModels,
  }
}