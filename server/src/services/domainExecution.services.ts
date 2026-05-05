import type { InventoryQueryType } from "../queries/inventoryQuery.queries.js"
import type { SpecQueryType } from "../queries/specQuery.queries.js"
import type { Filter } from "../queries/types.js"
import type { SpecRowType } from "../types/stores.types.js"

export async function buildDomainExecution(inventoryQuery: InventoryQueryType, specQuery: SpecQueryType) {

  function mergeStores(): { matches: SpecRowType[], missing: { model: SpecRowType["model"] }[] } {
    // const specMap = new Map(allSpecs.map(modelSpec => [modelSpec.model, modelSpec]))
    const matches: SpecRowType[] = []
    const missing: { "model": SpecRowType["model"] }[] = []
    const inventory = inventoryQuery.getColumnValues("model")
    
    inventory.map(model => {
      const result = specQuery.getRowsWhere("model",model)
      const row = result[0]
      row ? matches.push(row) : missing.push({ "model": model })
    })

    return {
      matches,
      missing
    }
  }

  
  const query= () => {
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
  const merged = mergeStores()
  const queryMerged = query()   
  // const modelsInInventory = inventoryStore.getColumnValues("model")

  // const modelNumberMapGenerator = (rawModelNumbers: string[]):Map<string, string> =>  {
  //   const map = new Map<string, string>()
  //   rawModelNumbers.map((modelNumber) => {
  //     const result = modelNumber.replace(/-/g, '')
  //     map.set(result, modelNumber)
  //   })
  //   return map
  // }

  // const modelNumberMap = modelNumberMapGenerator(modelsInInventory)
  // const strippedModelNumbers = [...modelNumberMap.keys()] as string[]

  // function transformSpecificationStore(specificationStore: SpecificationStore): SpecificationStore {
  //   const rows = specificationStore.rows
  //   const transformedRows = rows.map(row => {
  //     row["model"] = row.model.replace(/-/g, "")
  //     return row
  //   })
  //   return {
  //     ...specificationStore,
  //     rows: transformedRows
  //   }
  // }

  // const transformedSpecificationStore = transformSpecificationStore(specificationStore)


  // const mergedInventoryAndSpecStore = mergeStores(strippedModelNumbers, transformedSpecificationStore.rows)

  // function getModelSpecs(models: SpecificationRow["model"][]): SpecificationRow[] {
  //   const returnedSpecs = models.map(model => {
  //     const returnedRows = transformedSpecificationStore.getRowsBySingleColumnValue("model", model)
  //     const modelSpecs = returnedRows[0] ?? null
  //     return modelSpecs
  //   })
  //   return returnedSpecs.filter(specs => specs !== null)
  // }



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


  // function filterBy(
  //   model: SpecificationRow["model"],
  //   rows: SpecificationRow[],
  //   requirements: Filter<Omit<SpecificationRow, "waterproof">>
  // ): SpecificationRow[] {
  //   const filteredRows = rows.filter((row) => row["model"] !== model)
  //   const results = filteredRows.filter((row) => {
  //     return Object.entries(requirements).every(([key, requirement]) => {
  //       const value = row[key as keyof SpecificationRow]
  //       const req = requirement as Operators<SpecificationRow[keyof SpecificationRow]>
  //       if (req?.eq !== undefined && value !== req.eq) return false
  //       if (req?.neq !== undefined && value == req.neq) return false
  //       if (req?.gt !== undefined && req?.gt !== null && value <= req.gt) return false
  //       if (req?.gte !== undefined && req?.gte !== null && value < req.gte) return false
  //       if (req?.lt !== undefined && req?.lt !== null && value >= req.lt) return false
  //       if (req?.lte !== undefined && req?.lte !== null && value > req.lte) return false
  //       return true
  //     })
  //   })
  //   return results
  // }

  function getNeighborValues(values: number[], referenceValue: number): number[] {
    const sortedValues = [...new Set(values)].toSorted((a, b) => a - b)
    if(sortedValues.length === 1 || sortedValues.length === 2) return values
    const indexOfRefValue = sortedValues.indexOf(referenceValue)
    const oneValueBefore = indexOfRefValue == 0 ? undefined : sortedValues[indexOfRefValue - 1]
    const oneValueAfter = indexOfRefValue == sortedValues.length - 1 ? undefined : sortedValues[indexOfRefValue + 1]
    const capturedValues = [oneValueBefore, referenceValue, oneValueAfter].filter(val => val !== undefined)
    return [capturedValues[0]!, capturedValues[capturedValues.length - 1]!]
  }

  function findNearProducts(referenceSpecs: SpecRowType) {
    const { model, fire_rating_temp, gun_count, waterproof } = referenceSpecs
    const fire_rating_temps =  queryMerged.getColumnValues("fire_rating_temp")
    const gunCounts = queryMerged.getColumnValues("gun_count")
    const tempWindow = getNeighborValues(fire_rating_temps, fire_rating_temp)
    const gunCountWindow = getNeighborValues(gunCounts, gun_count)
    const requirements: Filter<SpecRowType> = {}
    requirements["fire_rating_temp"] = { gte: tempWindow[0]!, lte: tempWindow[1]! }
    requirements["gun_count"] = { gte: gunCountWindow[0]!, lte: gunCountWindow[1]! }
    requirements["waterproof"] = {eq: waterproof}
    // const result = filterBy(model, allInventoriedSpecifications, requirements)
    const result = getModelsByQualifiers("inventory",requirements)
    const formattedResult = { [model]: result }
    return formattedResult

  }

  function getSimilarModelsByModel(rows: "any"|"inventory",models: SpecRowType["model"][]) {
    // const allModelSpecs = getModelSpecs(models)
    // const allInventorySpecs = mergedInventoryAndSpecStore.matches
    const arr = rows === "any" ? specQuery.getAll() : merged.matches
    const similarMatches = models.map(model => {
      const specs = specQuery.getRowsWhere("model",model)[0]
      if(!specs) return undefined
      return findNearProducts(specs)
    })
    const filteredResult = similarMatches.filter(val => val !== undefined)
    return filteredResult
  }

//   async function getSpecs(requestedSpecs: TransformedSpec[]) {

//     const numberEntries = (Object.keys(specificationSchema) as SchemaKey[])
//       .filter(key => typeof specificationSchema[key]("0") === "number")
//       .map(key => [key, (value:number[]) => {
//         if (value.length === 1) return {eq: value[0] ?? 0} 
//         return  {gte:value[0]??0,lte:value[1]??Infinity }
//       }])

//     const booleanEntries = (Object.keys(specificationSchema) as SchemaKey[]).filter(key => typeof specificationSchema[key]("true") === "boolean")
//       .map(key => ([key, (value:boolean) => ({eq:value})]))

//     const specHandler = {
//     ...Object.fromEntries(numberEntries),
//     ...Object.fromEntries(booleanEntries),
//     } as CategoryHandler
  
//     const requirements: Filter<OmittedSpecRow> = Object.fromEntries(
//       requestedSpecs.map(spec => {
//         return [spec.category,specHandler[spec.category](spec.value as any)]
//       }) 
//     )
      
//     const allInventorySpecs = mergedInventoryAndSpecStore.matches
//     const result = getRequiredSpecs(allInventorySpecs,requirements)
//     return result
//   }

  return {
    // getModelSpecs,
    // getSimilarModels,
    // modelsInInventory,
    // strippedModelNumbers,
    // getSpecs
    getSimilarModelsByModel,
    getModelsByQualifiers,
  }
}

export type DomainExecutionType = ReturnType<typeof buildDomainExecution>