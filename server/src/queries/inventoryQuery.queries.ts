import type { InventoryRowType } from "../types/stores.types.js";
import type { Filter } from "./types.js";
// import type { Filter } from "../types/types.js";

export function buildInventoryQuery(inventoryRows: {rows: InventoryRowType[],normalizedColumnMap: <K extends keyof InventoryRowType>(columnName: K) => Map<InventoryRowType[K],InventoryRowType[K]>}) {

  const m = inventoryRows.normalizedColumnMap("model")
  const normalizedModelNumbers = m.keys().toArray()

  function getProductionModelNumber(normalizedModelNumber: string) {
    return m.get(normalizedModelNumber)
  }
  function getAllHeaders(){
    return Object.keys(inventoryRows.rows) as (keyof InventoryRowType)[]
  }
  function getAll(){
    return inventoryRows.rows
  }
  function getRowsByRange(criteria: Filter<InventoryRowType>){
    const result = inventoryRows.rows.filter( row => {
      return Object.entries(criteria).every(([key, operators]) => {
        const value = row[key as keyof InventoryRowType]
        const requirements =  operators
        if(requirements?.eq && value !== requirements.eq) return false
        return true 
      })
    }) 

    return result
  }
  function getRowsWhere<K extends keyof InventoryRowType>(column: K, value:InventoryRowType[K] ){
    return inventoryRows.rows.filter(row => row[column] === value )
  }
  function getColumnValues<K extends keyof InventoryRowType>(column: K){
    return inventoryRows.rows.map(row => row[column])
  }

  return {
    getAllHeaders,
    getAll,
    getRowsByRange,
    getRowsWhere,
    getColumnValues,
    getProductionModelNumber,
    normalizedModelNumbers
  }
}

export type InventoryQueryType = ReturnType<typeof buildInventoryQuery>