import { parse } from "csv-parse"
import fs from "fs"
import { type ModelRow } from "../types/types.js"

export async function modelParse(filePath: string){

  // Pull from a single column
  const result: ModelRow[] = []

  const fileStream = fs.createReadStream(filePath)
  const parser = parse({columns: true})

  fileStream.pipe(parser)

  for await (const row of parser) {
    result.push(row)
  }
  console.log("Result: ", result)

  return {
    getColumn: (columnName: "model" | "height" | "origin") => {
      const columnData = result.map((r) => r[columnName])
      return columnData
    }
  }
} 

