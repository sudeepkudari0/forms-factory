"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { generateId } from "@/lib/id"
import type { Webhook } from "@prisma/client"
import { customAlphabet } from "nanoid"

type EnableForm = Pick<Webhook, "id" | "enabled">
export async function setWebhookEnabled(values: EnableForm) {
  if (!values.id) {
    throw new Error("Form id is required")
  }

  await db.webhook.update({ where: { id: values.id }, data: { enabled: true } })

  const updatedWebhook = await db.webhook.findFirst({
    where: {
      id: values.id,
    },
  })

  revalidatePath(`/forms/${updatedWebhook?.userId}/webhooks`)

  return updatedWebhook
}

type DeleteForm = Pick<Webhook, "id" | "deleted">

export async function setWebhookDeleted(values: DeleteForm) {
  await db.webhook.update({ where: { id: values.id }, data: { deleted: true } })

  const updatedWebhook = await db.webhook.findFirst({
    where: {
      id: values.id,
    },
  })

  revalidatePath(`/forms/${updatedWebhook?.userId}/webhooks`)

  return updatedWebhook
}

type CreateWebhook = Pick<Webhook, "userId" | "endpoint" | "eventTypes">
const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", 3)

export async function createWebhook(values: CreateWebhook) {
  const generatedNanoid = nanoid()
  const whsec = `whsec_${generatedNanoid}`

  const data = await db.webhook.create({
    data: {
      userId: values.userId,
      endpoint: values.endpoint,
      secretKey: whsec,
      eventTypes: values.eventTypes,
    },
  })

  const createdWebhook = await db.webhook.findFirst({
    where: {
      id: data.id,
    },
  })

  revalidatePath("/webhooks")

  return createdWebhook
}

type RotateKey = Pick<Webhook, "id">

export async function rotateWebhookSecretKey(values: RotateKey) {
  const whsec = `whsec_${generateId()}`

  await db.webhook.update({
    where: { id: values.id },
    data: { secretKey: whsec },
  })

  const updatedWebhook = await db.webhook.findFirst({
    where: {
      id: values.id,
    },
  })

  revalidatePath(`/webhooks/${updatedWebhook?.id}`)

  return updatedWebhook
}
