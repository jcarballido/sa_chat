import type { MessageStore } from "./buildMessageStore.js";
import type { Filter, InferRows, InventoryStore, Operators, SpecCriteria, SpecificationRow, SpecificationStore } from "../types/types.js";

export function buildDomainExecutionServices(inventoryStore: InventoryStore, specificationStore: SpecificationStore, messageStore: MessageStore){

  function getInventoriedModelNumbers(){ return inventoryStore.getColumnValues("model") }
  function transformModelNumbersNoHyphens(officialModelNumbers: string[]): Map<string,string>{
    const map = new Map<string,string>()
    officialModelNumbers.map((modelNumber) =>{
      const strippedDashModelNumber = modelNumber.replace(/-/g,'')
      map.set(strippedDashModelNumber, modelNumber)
    })
    return map
  }

  const strippedModelNumbersInventoryMap = transformModelNumbersNoHyphens(getInventoriedModelNumbers())
  const strippedModelNumbersInInventory = [...strippedModelNumbersInventoryMap.keys()]

  function transformSpecificationStore(specificationStore: SpecificationStore): SpecificationStore{
    const rows = specificationStore.rows
    const transformedRows = rows.map(row => {
      row["model"] = row.model.replace(/-/g,"")
      return row
    })
    return {
      ...specificationStore,
      rows: transformedRows
    }
  }

  const transformedSpecificationStore = transformSpecificationStore(specificationStore)

  function mergeStores(
    inventoryModels: SpecificationRow["model"][], 
    allSpecs: SpecificationRow[]): {matches:SpecificationRow[],missing:{model:SpecificationRow["model"]}[]
  }{
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

  const mergedInventoryAndSpecStore = mergeStores([... strippedModelNumbersInventoryMap.keys()], transformedSpecificationStore.rows)

  function getModelSpecs(models: SpecificationRow["model"][]): SpecificationRow[] {
    const returnedSpecs = models.map(model => {
      const returnedRows = transformedSpecificationStore.getRowsByColumnValue("model",model)
      const modelSpecs = returnedRows[0] ?? null
      return modelSpecs
    })
    return returnedSpecs.filter(specs => specs !== null)
  }

  function filterBy(
    model: SpecificationRow["model"],
    rows: SpecificationRow[],
    requirements: Filter<Omit<SpecificationRow, "waterproof">>
  ): SpecificationRow[]{
    const filteredRows = rows.filter((row) => row["model"] !== model)
    const results = filteredRows.filter((row) => {      
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
    const capturedValues = [oneValueBefore, referenceValue, oneValueAfter].filter(val => val !== undefined)
    return [capturedValues[0]!, capturedValues[capturedValues.length - 1]!]
  }

  // CHORE: Build for the situation where only desired specs are passed in with NO reference model
  // async function buildRequirements(model:SpecificationRow["model"], criteria: SpecCriteria){
  //   const match = await getModelSpecs(model)
  //   const referenceModel = match[0] // Reference model
  //   const {fire_rating, gun_count, waterpoof, external_dimensions} = criteria ?? {} // Check if there are specific specs that must be focused on
    
  //   const requirements:Filter<Omit<SpecificationRow,"waterproof">> = {}
    
  //   if(fire_rating){
  //     const {time,temp} = fire_rating
  //     if(time) {  
  //       const referenceTime = referenceModel?.fire_rating_time!
  //       const fire_rating_times = specificationStore.getColumnValues("fire_rating_time")
  //       const valueWindow = getOneBeforeAndAfter(fire_rating_times,referenceTime)
  //       requirements["fire_rating_time"] = {gte:valueWindow[0]!, lte:valueWindow[valueWindow.length-1]!}
  //     }
  //     if(temp) {
  //       const referenceTemp = referenceModel?.fire_rating_temp!
  //       const fire_rating_temps = specificationStore.getColumnValues("fire_rating_temp")    
  //       const valueWindow = getOneBeforeAndAfter(fire_rating_temps,referenceTemp)
  //       requirements["fire_rating_temp"] = {gte:valueWindow[0]!, lte:valueWindow[valueWindow.length-1]!}    
  //     }
  //   }
  //   if(gun_count){
  //       const referenceGunCount = referenceModel?.gun_count!
  //       const gun_counts = specificationStore.getColumnValues("gun_count")    
  //       const valueWindow = getOneBeforeAndAfter(gun_counts,referenceGunCount)
  //       requirements["gun_count"] = {gte:valueWindow[0]!, lte:valueWindow[valueWindow.length-1]!}    
  //   }
  //   if(external_dimensions){
  //     const {height,width,depth} = external_dimensions
  //     if(height) { 
  //       // const heights = specificationStore.getColumnValues("height")
  //     }
  //     if(width){ 
  //       // const widths = specificationStore.getColumnValues("width")
  //     }
  //     if(depth){
  //       //  const depths = specificationStore.getColumnValues("depth")
  //     }
  //   }

  //   return requirements

  // }

  async function findNearProducts(allInventoriedSpecifications: SpecificationRow[], modelSpecs: SpecificationRow) {
    const {fire_rating_temp, fire_rating_time, gun_count, height, width, depth, waterproof, model} = modelSpecs
    const fire_rating_times = transformedSpecificationStore.getColumnValues("fire_rating_time")
    const valueWindow = getOneBeforeAndAfter(fire_rating_times,fire_rating_time)
    const requirements:Filter<SpecificationRow>= {}
    requirements["fire_rating_time"] = {gte:valueWindow[0]!, lte:valueWindow[1]!}
    const result = filterBy(model,allInventoriedSpecifications,requirements)
    const formattedResult = {[model]: result}
    return formattedResult
    
  }

  async function getSimilarModels(models:SpecificationRow["model"][]) {
    const allModelSpecs = getModelSpecs(models)
    const allInventorySpecs = mergedInventoryAndSpecStore.matches
    const allNearProductMatches = await Promise.all( allModelSpecs.map(async(spec) => await findNearProducts(allInventorySpecs,spec)))
    return allNearProductMatches
  }

  async function getSpecs(requestedSpecs: string[]) {
    // 
  }

  return{
    getModelSpecs,
    getSimilarModels,
    getInventoriedModelNumbers,
    strippedModelNumbersInInventory
  }
}