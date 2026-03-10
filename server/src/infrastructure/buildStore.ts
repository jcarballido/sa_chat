import { parse } from "csv-parse"
import fs from "node:fs"
import type { ConversionSchema, InferRows } from "../types/types.js";

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

export async function buildStoreGeneric<T extends ConversionSchema>(filePath:string, schema: T) {
  
  let headers: string[] = [];
  const rows: Array<Record<string,string>> = []
  
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

  function getRowsByColumnValue<K extends keyof InferRows<T> & string>(
    column: K,
    value: InferRows<T>[K]
  ): InferRows<T>[] {
    if (!headers.includes(column)) {
      throw new Error(`Column "${column}" does not exist`);
    }
    return convertedRows.filter(row => row[column] === value);
  };

  return {
    headers,
    rows: convertedRows,
    getColumnValues,
    getRowsByColumnValue,
  };
}

// export async function buildStore(filePath: string): Promise<CsvQuery> {
//   const rows: Record<string, string>[] = [];
//   let headers: string[] = [];


//   for await (const row of parser) {
//     if (headers.length === 0) {
//       headers = Object.keys(row);
//     }
//     rows.push(row);
//   }

//   const getColumnValues = (column: string): (string|undefined)[] => {
//     if (!headers.includes(column)) {
//       throw new Error(`Column "${column}" does not exist`);
//     }
//     return rows.map(row => row[column]) ;
//   };

//   const getRowsByColumnValue = (
//     column: string,
//     value: string
//   ): Record<string, string>[] => {
//     if (!headers.includes(column)) {
//       throw new Error(`Column "${column}" does not exist`);
//     }
//     console.log("HEADERS: ")
//     console.log("Column name passed in: ",column)
//     console.log("Value passed in: ", value)
//     return rows.filter(row => row[column] === value);
//   };

//   return {
//     headers,
//     rows,
//     getColumnValues,
//     getRowsByColumnValue,
//   };
// }

