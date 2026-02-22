import parse from "csv-parser"
import fs from "fs"
import { type ModelRow } from "../types/types.js"

export async function modelParse(filePath: string){

  const result: ModelRow[] = []

  fs.createReadStream(filePath)
    .pipe(parse(["Model No.","MFR","Ht"]))
    .on("data",(data:ModelRow) => {
      result.push(data)
    })
    .on("end",() => {
      console.log("File parsing complete.")
      // console.log("Result: ", result)
      const columns = Object.keys(result[0] || {})
      console.log("Columns: ",columns)
    })

        console.log("Result: ", result)

  const columnHeaders = Object.keys(result[0] || {})
  console.log("Column headers: ", columnHeaders)

} 

