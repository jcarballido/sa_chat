import { parse } from "csv-parse";
import fs from "node:fs"
import type z from "zod";

export async function excelReader<T extends Record<string,unknown>>(filePath: string, schema: z.ZodType<T>): Promise<T[]> {
  let headers: string[] = [];
  const rows: T[] = []
  
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
  
  return rows.map(row => schema.parse(row))

}

