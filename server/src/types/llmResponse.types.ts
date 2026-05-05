import type { SpecRowType } from "./stores.types.js";

export type ExtractedSpecType = {
    category: keyof SpecRowType,
    value: string[]  | null
}[]

export type ExtractedSpecMapType = {
    [K in keyof SpecRowType]: {
        category: K,
        value: SpecRowType[K][]
    }
}[keyof SpecRowType][]