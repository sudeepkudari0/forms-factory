"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { generateId } from "@/lib/id"
import type { Webhook } from "@prisma/client"

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

  revalidatePath(`/forms/${updatedWebhook?.formId}/webhooks`)

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

  revalidatePath(`/forms/${updatedWebhook?.formId}/webhooks`)

  return updatedWebhook
}

type CreateWebhook = Pick<Webhook, "formId" | "endpoint">
export async function createWebhook(values: CreateWebhook) {
  const whsec = `whsec_${generateId()}`
  const id = generateId()

  await db.webhook.create({
    data: {
      id,
      formId: values.formId,
      endpoint: values.endpoint,
      secretKey: whsec,
      events: JSON.stringify(["submission.created"]),
    },
  })

  const createdWebhook = await db.webhook.findFirst({
    where: {
      id: id,
    },
  })

  revalidatePath(`/forms/${createdWebhook?.formId}/webhooks`)

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

  revalidatePath(`/forms/${updatedWebhook?.formId}/webhooks/${updatedWebhook?.id}`)

  return updatedWebhook
}
