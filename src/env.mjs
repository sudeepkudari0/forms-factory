import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    WHATSAPP_API_KEY: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    SIGNUP_ACCESS_TOKEN: z.string().min(1),
    SMTP_FROM: z.string().optional(),
    POSTMARK_API_TOKEN: z.string().optional(),
    POSTMARK_SIGN_IN_TEMPLATE: z.string().optional(),
    POSTMARK_ACTIVATION_TEMPLATE: z.string().optional(),
    KV_URL: z.string().optional(),
    KV_REST_API_URL: z.string().optional(),
    KV_REST_API_TOKEN: z.string().optional(),
    KV_REST_API_READ_ONLY_TOKEN: z.string().optional(),
    QSTASH_CURRENT_SIGNING_KEY: z.string().optional(),
    QSTASH_NEXT_SIGNING_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_UMAMI_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_UMAMI_SITE_ID: z.string().optional(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
    SMTP_FROM: process.env.SMTP_FROM,
    SIGNUP_ACCESS_TOKEN: process.env.SIGNUP_ACCESS_TOKEN,
    POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
    POSTMARK_SIGN_IN_TEMPLATE: process.env.POSTMARK_SIGN_IN_TEMPLATE,
    POSTMARK_ACTIVATION_TEMPLATE: process.env.POSTMARK_ACTIVATION_TEMPLATE,
    NEXT_PUBLIC_APP_URL:
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` || process.env.NEXT_PUBLIC_APP_URL,
    KV_URL: process.env.KV_URL,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
    NEXT_PUBLIC_UMAMI_DOMAIN: process.env.NEXT_PUBLIC_UMAMI_DOMAIN,
    NEXT_PUBLIC_UMAMI_SITE_ID: process.env.NEXT_PUBLIC_UMAMI_SITE_ID,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
})
