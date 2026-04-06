import { parse } from "csv-parse"
import fs from "node:fs"
import type { ConversionSchema, FilteredSchema, InferRows, MappedSpecRows, SpecificationRow } from "../types/types.js";

function convertRows<S extends Record<string,(t: string) => any>>(
  data: Record<string,string>,
  schema: S
): InferRows<S>{
  const result = {} as InferRows<S>
  for (const key in schema){
    result[key] = schema[key]!(data[key]!)
  }
  return result
}

export async function buildStoreGeneric<T extends ConversionSchema>(filePath:string, schema: T, requiredHeaders: (keyof T)[]) {
  
  let headers: string[] = [];
  const rows: Array<Record<string,string>> = []
  const fileNameRegex = /([^\/]+.csv)$/
  const fileName = filePath.match(fileNameRegex)![0] 
  
  const parser = fs
    .createReadStream(filePath)
    .pipe(
      parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
      })
    );
  for await (const row of parser) {
    if (headers.length === 0) {
      requiredHeaders.sort()
      const sortedKeySchema = Object.keys(row).sort()
      if(JSON.stringify(sortedKeySchema) != JSON.stringify(requiredHeaders)){
        console.log(`HEADERS IN ${fileName}:  `, Object.keys(row))
        console.log("SCHEMA HEADERS:  ", requiredHeaders)
        throw new Error(`MISMATCH BETWEEN HEADERS IN ${fileName} AND REQUIRED HEADERS IN SCHEMA`)
      }
      headers = Object.keys(row);
    }
    rows.push(row);
  }

  const convertedRows = rows.map(row => convertRows(row, schema))

  function getColumnValues<K extends keyof InferRows<T> & string>(column: K): InferRows<T>[K][] {
    if (!headers.includes(column)) {
      throw new Error(`Column "${column}" does not exist`);
    }
    return convertedRows.map(row => row[column]) ;
  };

  function getRowsBySingleColumnValue<K extends keyof InferRows<T> & string>(
    column: K,
    value: InferRows<T>[K]
  ): InferRows<T>[] {
    if (!headers.includes(column)) {
      throw new Error(`Column "${column}" does not exist`);
    }

    return convertedRows.filter(row => row[column] === value);
  };

  function getRowsByMultipleColumnValues<K extends keyof FilteredSchema<T>>(
    requirements:{ category: K, values: InferRows<T>[K][] }[]
  ){

  }


  return {
    headers,
    rows: convertedRows,
    getColumnValues,
    getRowsBySingleColumnValue,
  };
}