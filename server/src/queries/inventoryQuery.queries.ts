import type { FastifyInstance } from "fastify";
import type { InventoryRowType } from "../types/stores.types.js";
import type { Filter } from "../types/types.js";

export function buildInventoryQuery(inventoryRows: InventoryRowType[]) {
  function getAllHeaders(){
    return Object.keys(inventoryRows) as (keyof InventoryRowType)[]
  }
  function getAll(){
    return inventoryRows
  }

  function getRowsByRange(criteria: Filter<InventoryRowType>){
    const result = inventoryRows.filter( row => {
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
    return inventoryRows.filter(row => row[column] === value )
  }
  function getColumnValues<K extends keyof InventoryRowType>(column: K){
    return inventoryRows.map(row => row[column])
  }

  return {
    getAllHeaders,
    getAll,
    getRowsByRange,
    getRowsWhere,
    getColumnValues
  }
}