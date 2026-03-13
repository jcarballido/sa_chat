import path from "node:path"
import type { State, Update } from "../state.js"
import fs from "node:fs"
import { ask } from "../util/ask.js"

export async function writeFileNode(state:State): Promise<Update>{
  console.log("→ WRITE_FILE")

  if (!state.specificationApproval || !state.codeApproved || !state.specification) {
    throw new Error("Cannot write file without approved code and spec")
  }

  // Define filename based on component name
  const fileName = `${state.specification.name}.tsx`
  const filePath = path.join(state.projectRoot, fileName)

  if(!filePath.startsWith(state.projectRoot)){
    throw new Error("Agent is not writing to the specified project root.")
  }
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, "utf-8")

    if (existing === state.generatedCode) {
      console.log("File already up-to-date, skipping write.")
      return { done: true }
    }

    console.log(`File ${fileName} exists. Showing diff:`)
    console.log("--- EXISTING ---")
    console.log(existing)
    console.log("--- NEW ---")
    console.log(state.generatedCode)

    // const proceed = await new Promise<string>((resolve) => {
    //   const rl = require("readline").createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //   })
    //   rl.question("Overwrite file? (y = yes / n = skip): ", (answer:string) => {
    //     rl.close()
    //     resolve(answer.trim())
    //   })
    // })

    const proceed = await ask('Overwrite file? (y = yes / n = skip): ')

    if (proceed.toLowerCase() !== "y") {
      console.log("Skipping file write.")
      return { done: true }
    }
  }

  // Write file
  fs.writeFileSync(filePath, state.generatedCode, "utf-8")
  console.log(`File written: ${fileName}`)

  return { done:true }
}