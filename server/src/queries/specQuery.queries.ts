import type {  SpecRowType } from "../types/stores.types.js";
import type { Filter } from "./types.js";

export function buildSpecQuery(specRows: {rows: SpecRowType[], normalizedColumnMap: <K extends keyof SpecRowType>(columnName: K) => Map<SpecRowType[K],SpecRowType[K]>}) {
  // const modelMap = new Map<string,string>()
  // specRows.map(row => {
  //   modelMap.set(row["model"].replace("-",""),row["model"])
  // })
  // console.log("MODEL MAP:")
  // console.log(modelMap)

  const m = specRows.normalizedColumnMap("model")

  function getProductionModelNumber(normalizedModelNumber: string) {
    console.log("Normalized Modle Passed In:")
    console.log(normalizedModelNumber)
    console.log("Generated map:")
    console.log(m)
    return m.get(normalizedModelNumber)
  }

  function getAllHeaders(){
    return Object.keys(specRows.rows) as (keyof SpecRowType)[]
  }

  function getAll(){
    return specRows.rows
  }

  function getRowsByRange(criteria: Filter<SpecRowType>){
    const result = specRows.rows.filter( row => {
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
    return specRows.rows.filter(row => row[column] === value )
  }
  function getColumnValues<K extends keyof SpecRowType>(column: K){
    return specRows.rows.map( row => row[column])
  }

  return {
    getAllHeaders,
    getAll,
    getRowsByRange,
    getRowsWhere,
    getColumnValues,
    getProductionModelNumber
  }
}

export type SpecQueryType = ReturnType<typeof buildSpecQuery>