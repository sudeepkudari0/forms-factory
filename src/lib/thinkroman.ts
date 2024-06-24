import { env } from "@/env.mjs"
import { Thinkroman } from "@thinkroman/api"

export const tr = new Thinkroman({
  key: env.WHATSAPP_API_KEY,
})
