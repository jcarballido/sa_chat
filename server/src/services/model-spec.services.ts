import { parse } from "csv-parse"
import fs from "fs"

export interface CsvQuery {
  headers: string[];
  getColumnValues: (column: string) => (string|undefined)[];
  getRowsByColumnValue: (
    column: string,
    value: string
  ) => Record<string, string>[];
}

export async function loadCsv(filePath: string): Promise<CsvQuery> {
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

  return {
    headers,
    getColumnValues,
    getRowsByColumnValue,
  };
}