import type { InventoryQueryType } from "../queries/inventoryQuery.queries.js"
import type { SpecQueryType } from "../queries/specQuery.queries.js"
import type { Filter, Operators } from "../queries/types.js"
import type { ExtractedSpecMapType } from "../types/llmResponse.types.js"
import { type SpecRowType } from "../types/stores.types.js"

export function buildDomainExecution(inventoryQuery: InventoryQueryType, specQuery: SpecQueryType) {

  function mergeStores(): { matches: SpecRowType[], missing: { model: SpecRowType["model"] }[] } {
    const matches: SpecRowType[] = []
    const missing: { "model": SpecRowType["model"] }[] = []
    const inventory = inventoryQuery.getColumnValues("model")
    console.log("MERGE STORES/INVENTORY MODELS:")
    console.log(inventory)
    
    inventory.map(model => {
      const result = specQuery.getRowsWhere("model",model)
      const row = result[0]
      row ? matches.push(row) : missing.push({ "model": model })
    })
    console.log("MERGE STORES/MATCHES:")
    console.log(matches)
    return {
      matches,
      missing
    }
  }
  
  const merged = mergeStores()

  const query = () => {
    function getAll(){
      return merged.matches
    }
    function getColumnValues<K extends keyof SpecRowType>(column: K): SpecRowType[K][] {
      const rows = merged.matches
      return rows.map(row => row[column])
    }
    return {
      getAll,
      getColumnValues
    }
  }

  const queryMerged = query()   

  function getModelsByQualifiers(rows: "any"|"inventory", qualifiers: Filter<SpecRowType>): SpecRowType[] {
    const arr = rows == "any" ? specQuery.getAll() : merged.matches
    const results = arr.filter((row) => {
      return Object.entries(qualifiers).every(([key, qualifier]) => {
        const value = row[key as keyof SpecRowType]
        // const req = requirement as Operators<SpecificationRow[keyof SpecificationRow]>
        const req = qualifier
        if (req?.eq !== undefined && value !== req.eq) return false
        if (req?.neq !== undefined && value == req.neq) return false
        if(typeof(value) === "number"){
          if (req?.gt !== undefined && req?.gt !== null && value <= req.gt) return false
          if (req?.gte !== undefined && req?.gte !== null && value < req.gte) return false
          if (req?.lt !== undefined && req?.lt !== null && value >= req.lt) return false
          if (req?.lte !== undefined && req?.lte !== null && value > req.lte) return false
        }
        return true
      })
    })
    return results
  }

  function getNeighborValues(values: number[], referenceValue: number): number[] {
    console.log("GET NEIGHTBOR VALUES RUNNING")
    const sortedValues = [...new Set(values)].toSorted((a, b) => a - b)
    console.log("SORTED VALUES:")
    console.log(sortedValues)
    if(sortedValues.length === 1 || sortedValues.length === 2) return values
    const indexOfRefValue = sortedValues.indexOf(referenceValue)
    const oneValueBefore = indexOfRefValue == 0 ? undefined : sortedValues[indexOfRefValue - 1]
    const oneValueAfter = indexOfRefValue == sortedValues.length - 1 ? undefined : sortedValues[indexOfRefValue + 1]
    const capturedValues = [oneValueBefore, referenceValue, oneValueAfter].filter(val => val !== undefined)
    console.log("CAPTURED VALUES:", capturedValues)
    // console.log(capturedValues)
    return [capturedValues[0]!, capturedValues[capturedValues.length - 1]!]
  }

  function findNearProducts(referenceSpecs: SpecRowType) {
    const { model, fire_rating_temp, gun_count, waterproof } = referenceSpecs
    const fire_rating_temps =  queryMerged.getColumnValues("fire_rating_temp")
    const gunCounts = queryMerged.getColumnValues("gun_count")
    console.log("TEMPS:")
    console.log(fire_rating_temps)
    console.log("GUN COUNTS")
    console.log(gunCounts)
    // console.log("TEMP WINDOW:")
    const tempWindow = getNeighborValues(fire_rating_temps, fire_rating_temp)
    const gunCountWindow = getNeighborValues(gunCounts, gun_count)
    // console.log("WINDOWS:")
    // console.log("FIRE TEMP WINDOW:")
    // console.log(tempWindow)
    // console.log("GUN COUNT WINDOW:")
    // console.log(gunCountWindow)
    const requirements: Filter<SpecRowType> = {}
    requirements["fire_rating_temp"] = { gte: tempWindow[0]!, lte: tempWindow[1]! }
    requirements["gun_count"] = { gte: gunCountWindow[0]!, lte: gunCountWindow[1]! }
    requirements["waterproof"] = {eq: waterproof}
    const result = getModelsByQualifiers("inventory",requirements)
    const formattedResult = { [model]: result }
    return formattedResult

  }

  function getSimilarModelsByModel(rows: "any"|"inventory",models: SpecRowType["model"][]) {
    // const arr = rows === "any" ? specQuery.getAll() : merged.matches
    const similarMatches = models.map(model => {
      console.log("MODEL:")
      console.log(model)
      const normalizedModelNumber =  specQuery.getProductionModelNumber(model)
      const [ specs ] = specQuery.getRowsWhere("model",normalizedModelNumber!)
      console.log("SPECS:")
      console.log(specs)
      if(!specs) return undefined
      return findNearProducts(specs)
    })
    const filteredResult = similarMatches.filter(val => val !== undefined)
    return filteredResult
  }

  function convertExtractedSpecs(extractedSpecs: ExtractedSpecMapType){
    const operators = Object.fromEntries(
      extractedSpecs.map(({category,value}) => {
        const sample = value[0]
        if(sample === undefined) return [category, null]
        if(typeof(sample) === "boolean" || typeof(sample)==="string" || value.length === 1) return [category, {eq: sample}]
        const operator = {} as Operators<typeof sample>
        operator["gt"] = Math.min(...(value as number[]))
        operator["lte"] = Math.max(...(value as number[]))
        return [category, operator]
      })
    ) as Filter<SpecRowType>
    return operators
  }

  const getModelsBySpecs = (rows: "any" | "inventory" ,extractedSpecs: ExtractedSpecMapType) => {
    const operators = convertExtractedSpecs(extractedSpecs)
    const result = getModelsByQualifiers(rows,operators)
    return result
  }


  return {
    getSimilarModelsByModel,
    getModelsByQualifiers,
    getModelsBySpecs
  }
}

export type DomainExecutionType = ReturnType<typeof buildDomainExecution>