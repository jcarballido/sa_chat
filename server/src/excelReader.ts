import { parse } from "csv-parse";
import fs from "node:fs"
import type z from "zod";
import { keyof, number } from "zod";

export async function excelReader<T extends Record<string,unknown>>(filePath: string, schema: z.ZodType<T>): Promise<{rows:T[],normalizedColumnMap: <K extends keyof T>(columnName: K) => Map<any,any>}> {
  let headers: string[] = [];
  const rows: T[] = []
  
  const parser = fs
    .createReadStream(filePath)
    .pipe(
      parse({
        columns: true,
        trim: true,
        skip_empty_lines: true,  
      }
    )
  )

  for await (const row of parser) {
    if (headers.length === 0) {
      headers = Object.keys(row);
    }
    rows.push(row);
  }

  const normalizedColumnMap = <K extends keyof T>(columnName: K) => {
    const map = new Map()
    const data = rows.map(row => {
      return row[columnName]
    })
    
    data.forEach((val) => {
      if(typeof(val) === "string"){
        map.set(val.replace("-",""), val)
      }
    })
    
    return map
  }
  
  
  return {
    rows: rows.map(row => schema.parse(row)),
    normalizedColumnMap
  }
}

