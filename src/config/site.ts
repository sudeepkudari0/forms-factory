import { env } from "@/env.mjs"
import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Tr-Form-Library",
  description:
    "Tr-Form-Library is a free, open source visual form builder for capturing feedback, leads, and opinions.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    twitter: "https://twitter.com/ThinkRoman",
    github: "https://github.com/sudeepkudari0",
  },
}
