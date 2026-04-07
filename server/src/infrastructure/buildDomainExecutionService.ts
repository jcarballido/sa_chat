import type { MessageStore } from "./buildMessageStore.js";
import type { CategoryHandler, Filter, InventoryStore, OmittedSpecRow, Operators, SchemaKey, SpecificationRow, SpecificationStore, TransformedSpec } from "../types/types.js";
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

  function getRequiredSpecs(
    rows: SpecificationRow[],
    requirements: Filter<OmittedSpecRow>
  ): SpecificationRow[] {
    
    const results = rows.filter((row) => {
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

  async function getSpecs(requestedSpecs: TransformedSpec[]) {

    const numberEntries = (Object.keys(specificationSchema) as SchemaKey[])
      .filter(key => typeof specificationSchema[key]("0") === "number")
      .map(key => [key, (value:number[]) => {
        if (value.length === 1) return {eq: value[0] ?? 0} 
        return  {gte:value[0]??0,lte:value[1]??Infinity }
      }])

    const booleanEntries = (Object.keys(specificationSchema) as SchemaKey[]).filter(key => typeof specificationSchema[key]("true") === "boolean")
      .map(key => ([key, (value:boolean) => ({eq:value})]))

    const specHandler = {
    ...Object.fromEntries(numberEntries),
    ...Object.fromEntries(booleanEntries),
    } as CategoryHandler
  
    const requirements: Filter<OmittedSpecRow> = Object.fromEntries(
      requestedSpecs.map(spec => {
        return [spec.category,specHandler[spec.category](spec.value as any)]
      }) 
    )

    const allInventorySpecs = mergedInventoryAndSpecStore.matches
    const result = getRequiredSpecs(allInventorySpecs,requirements)
    return result
  }

  return {
    getModelSpecs,
    getSimilarModels,
    getInventoriedModelNumbers,
    strippedModelNumbersInInventory,
    getSpecs
  }
}