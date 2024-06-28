import type { EventType } from "@prisma/client"
import { db } from "../db"
import type { EventTypeSchema } from "./types"

export class Event {
  event: EventTypeSchema
  constructor(event: EventTypeSchema) {
    this.event = event
  }

  async emit({
    userId,
    data,
    submissionId,
  }: {
    userId: string
    data: string
    submissionId?: string
  }) {
    console.log(`Emitting event ${this.event} for user ${userId}.`)
    await triggerWebhooks({
      userId,
      event: this.event,
      data,
      submissionId,
    })
  }
}

async function triggerWebhooks({
  userId,
  event,
  data,
  submissionId,
}: {
  userId: string
  event: EventType
  data: string
  submissionId?: string
}) {
  try {
    const matchingWebhooks = await db.webhook.findMany({
      where: {
        userId: userId,
        deleted: false,
        enabled: true,
      },
    })
    console.log(`Found ${matchingWebhooks.length} webhooks.`)
    const now = new Date()

    await Promise.all(
      matchingWebhooks.map(async (webhook) => {
        // const eventData = JSON.parse(webhook.eventTypes))
        if (webhook.eventTypes.includes(event)) {
          const webhookEvent = await db.webhookEvent.create({
            data: {
              eventType: event,
              eventData: event,
              webhookId: webhook.id,
            },
          })
          const postRes = await postToEnpoint({
            endpoint: webhook.endpoint,
            event,
            data,
            userId,
            webhookSecret: webhook.secretKey,
            submissionId: submissionId ?? undefined,
          })

          // update status in db
          await db.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
              statusCode: postRes?.status,
              status: postRes?.status === 200 ? "success" : "attempting",
              lastAttempt: now,
              nextAttempt:
                postRes?.status === 200
                  ? undefined
                  : new Date(now.setMinutes(now.getMinutes() + 5)),
              attemptCount: 1,
            },
          })
        }
      })
    )
  } catch (err) {
    console.error(err)
  }
}

export async function postToEnpoint({
  endpoint,
  event,
  data,
  userId,
  submissionId,
  webhookSecret,
}: {
  userId: string
  endpoint: string
  event: EventType
  data: string
  submissionId?: string
  webhookSecret: string
}) {
  try {
    console.log(`Post to endpoint ${endpoint} for event ${event}`)
    console.log({ data, event, userId, submissionId: submissionId ?? null })
    // make post request to webhook endpoint
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ data, event, userId, submissionId: submissionId ?? null }),
      headers: {
        "Content-Type": "application/json",
        "x-dorf-secret": webhookSecret,
      },
    })

    return {
      status: res.status,
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}
