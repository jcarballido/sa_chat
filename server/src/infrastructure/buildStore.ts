import { parse } from "csv-parse"
import fs from "node:fs"

export type CsvQuery = {
  headers: string[],
  rows: Record<string, unknown> []
  getColumnValues: (column: string) => (string|undefined)[];
  getRowsByColumnValue: (
    column: string,
    value: string
  ) => Record<string, string>[];
}

type SpecTableShape = {
  "fire_rating_time": number,
  "fire_rating_temp": number,
  "height": number,
  "width": number,
  "depth": number,
  "gun_count": number,
  "waterproof": boolean
}

async function buildStoreGeneric<T extends Record<string,unknown>>(filePath:string): Promise<CsvQuery> {
  const parser = fs
    .createReadStream(filePath)
    .pipe(
      parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,
      })
    );
  let headers: string[] = [];
  const rows: Array<Record<string,string>> = []
  
  for await (const row of parser) {
    if (headers.length === 0) {
      headers = Object.keys(row);
    }
    rows.push(row);
  }

  type InferRows<S extends Record<string,(v:string)=> any>> = {
    -readonly [K in keyof S]: ReturnType<S[K]>
  } 

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

  const schema = {
    "fire_rating_time": (t: string) => Number(t),
    "fire_rating_temp": (t: string) => Number(t),
    "height": (t: string) => Number(t),
    "depth": (t: string) => Number(t),
    "width": (t: string) => Number(t),
    "gun_count": (t: string) => Number(t),
    "waterproof": (t: string) => t === "true"
  } as const

  const convertedRows = rows.map(row => convertRows(row, schema))
  const getColumnValues = (column: string): (string|undefined)[] => {
    if (!headers.includes(column)) {
      throw new Error(`Column "${column}" does not exist`);
    }
    return rows.map(row => row[column]) ;
  };

  const getRowsByColumnValue = (
    column: string,
    value: string
  ): Record<string, string>[] => {
    if (!headers.includes(column)) {
      throw new Error(`Column "${column}" does not exist`);
    }
    return rows.filter(row => row[column] === value);
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

