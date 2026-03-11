import type { MessageStore } from "./buildMessageStore.js";
import type { Filter, InferRows, InventoryStore, Operators, SpecCriteria, SpecificationRow, SpecificationStore } from "../types/types.js";

export function buildDomainExecutionServices(inventoryStore: InventoryStore, specificationStore: SpecificationStore, messageStore: MessageStore){
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
        console.log("VALUE:")
        console.log(value)
        const req = requirement as Operators<SpecificationRow[keyof SpecificationRow]>
        console.log("Rquirement:")
        console.log(req)
        if(req?.eq !== undefined && value !== req.eq) return false
        if(req?.neq !==undefined && value == req.neq) return false
        if(req?.gt !== undefined && req?.gt !== null && value <= req.gt) return false
        if(req?.gte !== undefined && req?.gte !== null && value < req.gte) return false 
        if(req?.lt !== undefined && req?.lt !== null && value >= req.lt) return false
        if(req?.lte !== undefined && req?.lte !== null && value > req.lte) return false 
        return true
      }) 
    })
    console.log("RESULT:")
    console.log(results)
    return results
  }

  function getOneBeforeAndAfter(values: number[], referenceValue: number):number[]{

    const sortedValues = [...new Set(values)].toSorted((a,b) => a-b) 
    // console.log("Sorted FIre times:")
    // console.log(sortedValues)
    const indexOfRefValue = sortedValues.indexOf(referenceValue)
    const oneValueBefore = indexOfRefValue == 0 ? undefined : sortedValues[indexOfRefValue - 1]
    const oneValueAfter = indexOfRefValue == sortedValues.length - 1 ? undefined : sortedValues[indexOfRefValue + 1] 
    return [oneValueBefore, referenceValue, oneValueAfter].filter(val => val !== undefined)
  }

  // async function getSimilarModels(model:SpecificationRow["model"], criteria:SpecCriteria) {
    async function getSimilarModels(criteria:SpecCriteria) {

    const match = await getModelSpecs("SA32SM-EX-IVD")
    const referenceModel = match[0] // Reference model
    const allData = specificationStore.rows // Get all specs in the main file
    // console.log("ALL DATA:")
    // console.log(allData)
    const {fire_rating} = criteria ?? {} // Check if there are specific specs that must be focused on
    
    const requirements:Filter<Omit<SpecificationRow,"waterproof">> = {}
    
    if(fire_rating){
      const {time,temp} = fire_rating
      if(time) {  
        const referenceTime = referenceModel?.fire_rating_time!
        const fire_rating_times = specificationStore.getColumnValues("fire_rating_time")
        const valueWindow = getOneBeforeAndAfter(fire_rating_times,referenceTime)
        // console.log("ValueWIndow:")
        // console.log(valueWindow)
        requirements["fire_rating_time"] = {gte:valueWindow[0]!, lte:valueWindow[valueWindow.length-1]!}
        
      }
      // if(temp) {
      //   const fire_rating_temp = specificationStore.getColumnValues("fire_rating_temp")        
      // }
    }
    // if(gun_count){
    //   const gun_count_values = specificationStore.getColumnValues("gun_count")
    // }
    // if(external_dimensions){
    //   const {height,width,depth} = external_dimensions
    //   if(height) { 
    //     const heights = specificationStore.getColumnValues("height")
    //   }
    //   if(width){ 
    //     const widths = specificationStore.getColumnValues("width")
    //   }
    //   if(depth){
    //      const depths = specificationStore.getColumnValues("depth")
    //   }
    // }

    // console.log("REQUIREMENTS:")
    // console.log(requirements)

    const result = filterBy(allData,requirements)
    // console.log("RESULT FROM FILTER:")
    // console.log(result)

    return requirements
    
  }

  return{
    getModelSpecs,
    getSimilarModels,
  }
}