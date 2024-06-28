import { z } from "zod"

export const eventSchema = z.enum(["form.submission"])
export const eventArraySchema = eventSchema.array()
export type EventType = z.infer<typeof eventSchema>
