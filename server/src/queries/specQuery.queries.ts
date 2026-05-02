// import type { FastifyInstance } from "fastify";
import type {  SpecRowType } from "../types/stores.types.js";
import type { Filter } from "./types.js";
// import type { Operators } from "./types.js";

export function buildSpecQuery(specRows: SpecRowType[]) {
  function getAllHeaders(){
    return Object.keys(specRows) as (keyof SpecRowType)[]
  }
  function getAll(){
    return specRows
  }

  function getRowsByRange(criteria: Filter<SpecRowType>){
    const result = specRows.filter( row => {
      return Object.entries(criteria).every(([key, operators]) => {
        const value = row[key as keyof SpecRowType]
        const requirements =  operators 
        if (requirements?.eq && value !== requirements.eq) return false
        if (requirements?.neq && value == requirements.neq) return false
        if(typeof(value) === "number"){
          if (requirements?.gt && value <= requirements.gt) return false
          if (requirements?.gte && value < requirements.gte) return false
          if (requirements?.lt && value >= requirements.lt) return false
          if (requirements?.lte && value > requirements.lte) return false
        }
        return true 
      })
    }) 

    return result
  }

  function getRowsWhere<K extends keyof SpecRowType>(column: K, value:SpecRowType[K] ){
    return specRows.filter(row => row[column] === value )
  }
  function getColumnValues<K extends keyof SpecRowType>(column: K){
    return specRows.map( row => row[column])
  }

  return {
    getAllHeaders,
    getAll,
    getRowsByRange,
    getRowsWhere,
    getColumnValues
  }
}