"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { customAlphabet } from "nanoid"
import { revalidatePath } from "next/cache"

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 3)

export async function createApiKey(data: { name: string; userId: string }) {
  try {
    const generatedNanoid = nanoid()
    const prefix = `tr_${generatedNanoid}`
    const apiKey = `${prefix}${nanoid(22)}`
    const hashedKey = await bcrypt.hash(apiKey, 10)

    const newApiKey = await db.apiKey.create({
      data: {
        name: data.name,
        key: hashedKey,
        userId: data.userId,
        prefix: prefix,
      },
    })
    revalidatePath("/api-keys")

    return { apiKey, newApiKey }
  } catch (error) {
    console.error("Error creating API key:", error)
    throw new Error("Failed to create API key")
  }
}

export const getApiKeys = async (userId: string) => {
  try {
    const keys = await db.apiKey.findMany({
      where: {
        userId,
      },
    })
    return keys
  } catch (error) {
    console.error("Error fetching API keys:", error)
    throw new Error("Failed to fetch API keys")
  }
}

export const deleteApiKey = async (id: string) => {
  try {
    const apiKey = await db.apiKey.delete({
      where: {
        id,
      },
    })
    revalidatePath("/api-keys")
    return apiKey
  } catch (error) {
    console.error("Error deleting API key:", error)
    throw new Error("Failed to delete API key")
  }
}
