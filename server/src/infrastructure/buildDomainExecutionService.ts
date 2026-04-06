import type { MessageStore } from "./buildMessageStore.js";
import type { Filter, InventoryStore, Operators, SpecificationRow, SpecificationStore, TransformedSpec } from "../types/types.js";
import { specificationSchema } from "../plugins/specificationStore.plugin.js";

export function buildDomainExecutionServices(inventoryStore: InventoryStore, specificationStore: SpecificationStore, messageStore: MessageStore) {

  function getInventoriedModelNumbers() { return inventoryStore.getColumnValues("model") }
  function transformModelNumbersNoHyphens(officialModelNumbers: string[]): Map<string, string> {
    const map = new Map<string, string>()
    officialModelNumbers.map((modelNumber) => {
      const strippedDashModelNumber = modelNumber.replace(/-/g, '')
      map.set(strippedDashModelNumber, modelNumber)
    })
    return map
  }

  const strippedModelNumbersInventoryMap = transformModelNumbersNoHyphens(getInventoriedModelNumbers())
  const strippedModelNumbersInInventory = [...strippedModelNumbersInventoryMap.keys()]

  function transformSpecificationStore(specificationStore: SpecificationStore): SpecificationStore {
    const rows = specificationStore.rows
    const transformedRows = rows.map(row => {
      row["model"] = row.model.replace(/-/g, "")
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
    allSpecs: SpecificationRow[]): {
      matches: SpecificationRow[], missing: { model: SpecificationRow["model"] }[]
    } {
    const specMap = new Map(allSpecs.map(modelSpec => [modelSpec.model, modelSpec]))
    const matches: SpecificationRow[] = []
    const missing: { "model": SpecificationRow["model"] }[] = []

    inventoryModels.map(inventoriedModel => {
      const result = specMap.get(inventoriedModel)
      result ? matches.push(result) : missing.push({ "model": inventoriedModel })
    })

    return {
      matches,
      missing
    }
  }

  const mergedInventoryAndSpecStore = mergeStores([...strippedModelNumbersInventoryMap.keys()], transformedSpecificationStore.rows)

  function getModelSpecs(models: SpecificationRow["model"][]): SpecificationRow[] {
    const returnedSpecs = models.map(model => {
      const returnedRows = transformedSpecificationStore.getRowsBySingleColumnValue("model", model)
      const modelSpecs = returnedRows[0] ?? null
      return modelSpecs
    })
    return returnedSpecs.filter(specs => specs !== null)
  }

  function filterBy(
    model: SpecificationRow["model"],
    rows: SpecificationRow[],
    requirements: Filter<Omit<SpecificationRow, "waterproof">>
  ): SpecificationRow[] {
    const filteredRows = rows.filter((row) => row["model"] !== model)
    const results = filteredRows.filter((row) => {
      return Object.entries(requirements).every(([key, requirement]) => {
        const value = row[key as keyof SpecificationRow]
        const req = requirement as Operators<SpecificationRow[keyof SpecificationRow]>
        if (req?.eq !== undefined && value !== req.eq) return false
        if (req?.neq !== undefined && value == req.neq) return false
        if (req?.gt !== undefined && req?.gt !== null && value <= req.gt) return false
        if (req?.gte !== undefined && req?.gte !== null && value < req.gte) return false
        if (req?.lt !== undefined && req?.lt !== null && value >= req.lt) return false
        if (req?.lte !== undefined && req?.lte !== null && value > req.lte) return false
        return true
      })
    })
    return results
  }

  function getOneBeforeAndAfter(values: number[], referenceValue: number): number[] {
    const sortedValues = [...new Set(values)].toSorted((a, b) => a - b)
    const indexOfRefValue = sortedValues.indexOf(referenceValue)
    const oneValueBefore = indexOfRefValue == 0 ? undefined : sortedValues[indexOfRefValue - 1]
    const oneValueAfter = indexOfRefValue == sortedValues.length - 1 ? undefined : sortedValues[indexOfRefValue + 1]
    const capturedValues = [oneValueBefore, referenceValue, oneValueAfter].filter(val => val !== undefined)
    return [capturedValues[0]!, capturedValues[capturedValues.length - 1]!]
  }

  async function findNearProducts(allInventoriedSpecifications: SpecificationRow[], modelSpecs: SpecificationRow) {
    const { fire_rating_time, model } = modelSpecs
    const fire_rating_times = transformedSpecificationStore.getColumnValues("fire_rating_time")
    const valueWindow = getOneBeforeAndAfter(fire_rating_times, fire_rating_time)
    const requirements: Filter<SpecificationRow> = {}
    requirements["fire_rating_time"] = { gte: valueWindow[0]!, lte: valueWindow[1]! }
    const result = filterBy(model, allInventoriedSpecifications, requirements)
    const formattedResult = { [model]: result }
    return formattedResult

  }

  async function getSimilarModels(models: SpecificationRow["model"][]) {
    const allModelSpecs = getModelSpecs(models)
    const allInventorySpecs = mergedInventoryAndSpecStore.matches
    const allNearProductMatches = await Promise.all(allModelSpecs.map(async (spec) => await findNearProducts(allInventorySpecs, spec)))
    return allNearProductMatches
  }

  type OmittedSpecRow = Omit<SpecificationRow,"model">

  async function getSpecs(requestedSpecs: TransformedSpec[]) {
    const requirements: Filter<OmittedSpecRow> = {}

    for (const item of requestedSpecs) {
      if(item.category === "waterproof") return requirements[item.category] = {eq: item.value ?? true}
      if(item.value === null) return
      return requirements[item.category] = {eq: item.value?.[0] ?? 0}
    }   

    type NumberedKeys = {
      [K in keyof OmittedSpecRow]: 
        OmittedSpecRow[K] extends number ? K : never
    }[keyof OmittedSpecRow]

    type BooleanKeys = {
      [K in keyof OmittedSpecRow]: 
        OmittedSpecRow[K] extends boolean ? K : never
    }[keyof OmittedSpecRow]
  
    const specHandler = {
      ...Object.fromEntries(
        (Object.keys(specificationSchema) as NumberedKeys[]).map( key => {
          const toOperator = (values: number[]): Operators<number> => {
            if(values.length === 1) return {eq: values[0] ?? 0 } 
            return {gte:Math.min(...values), lte: Math.max(...values)}
          }
          return [key,toOperator]
        })
      ),
      ...Object.fromEntries(
        (Object.keys(specificationSchema) as BooleanKeys[]).map( key => {
          const toOperator = (value: boolean): Operators<boolean> => ({eq: value})
          return [key,toOperator]
        })
      )            
    }

    console.log("getSpecs RESULT:")
    console.log(requirements)
    // CHORE: REMOVE DUPLICATES, AND ADD ABILITY TO PULL VALUES WITH NEAR VALUES
    // Example request: "What are safes with gun_count of 12 and fire rating of 1400"
    // Result: Here are safes that match exactly: [], Here are safes that are not exact, but similar: []
    // Example request: "What are safes with a gun count between 12 and 20, waterproof, and a fire rating between 1200-1600"
    // Result: Here are safes that fit within the given range(s): []
    // DECISION: If a user provides a range, only search for models within that range, do not look for near models

    return requirements
  }

  return {
    getModelSpecs,
    getSimilarModels,
    getInventoriedModelNumbers,
    strippedModelNumbersInInventory,
    getSpecs
  }
}