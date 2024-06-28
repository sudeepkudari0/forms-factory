import { EventType } from "@prisma/client"
import { z } from "zod"

export const EventTypeSchema = z.nativeEnum(EventType)
export type EventTypeSchema = z.infer<typeof EventTypeSchema>
