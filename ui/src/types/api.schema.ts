import { z } from 'zod'

export const ApiErrorSchema = z.object({
    code:z.string(),
    message: z.string()
})

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.discriminatedUnion("status", [
    z.object({
      status: z.literal("success"),
      data: dataSchema,
      error: z.null(),
    }),
    z.object({
      status: z.literal("error"),
      data: z.null(),
      error: ApiErrorSchema,
    }),
  ])

export type ApiError = z.infer<typeof ApiErrorSchema>