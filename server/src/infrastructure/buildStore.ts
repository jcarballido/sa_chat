import { parse } from "csv-parse"
import fs from "node:fs"
import type { Defined, SpecCriteria } from "../types/types.js";

export type CsvQuery = {
  headers: string[];
  getColumnValues: (column: string) => (string|undefined)[];
  getRowsByColumnValue: (
    column: string,
    value: string
  ) => Record<string, string>[];
}

export async function buildStore(filePath: string): Promise<CsvQuery> {
  const rows: Record<string, string>[] = [];
  let headers: string[] = [];

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
    console.log("HEADERS: ")
    console.log("Column name passed in: ",column)
    console.log("Value passed in: ", value)
    return rows.filter(row => row[column] === value);
  };

  const buildConditional = () => {

    const conditional = 

    return conditional
  }

  const getByCriteria = (specCriteria: Defined<SpecCriteria>) => {
    // Look at every row in the parsed file and return objects that match the passed in criteria.
    // Example criteria:
    // {fire_rating:{time: [35,60]}}, gun_count:{45}, depth:[20, 88]
    // Build conditional to pass into filter

    // Fiter based on listed conditional
    const result = rows.filter(row => {
      const {fire_rating_time, fire_rating_temp, waterpoof, gun_count, height,width,depth} = row
      if(/*Conditional defined by the specCriteria*/true) return row 
    })

    return result
  }

  return {
    headers,
    getColumnValues,
    getRowsByColumnValue,
  };
}

