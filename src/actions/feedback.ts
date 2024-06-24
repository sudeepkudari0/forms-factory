"use server"

import { db } from "@/lib/db"
import { generateId } from "@/lib/id"

type InsertFeedback = {
  text: string
  url: string
  ua: string
  userId: string | undefined
}

export async function createFeedback(values: InsertFeedback) {
  await db.feedback.create({ data: { ...values, id: generateId() } })
}
