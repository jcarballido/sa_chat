import z from "zod";
import { categoryEnum, SpecRowSchema, type SpecRowType } from "./stores.types.js";

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


export const ReturnedSpecValue = z.array(z.object({category: categoryEnum,value: z.array(z.string()).nullable()})) 

export const SpecValueSchema = z.object({
  "specValues":  ReturnedSpecValue 
})