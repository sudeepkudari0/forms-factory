import { env } from "@/env.mjs"
import type { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Forms Factory",
  description:
    "Forms Factory is a free, open source visual form builder for capturing feedback, leads, and opinions.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
      twitter: "https://twitter.com/FormsFactory",
    github: "https://github.com/sudeepkudari0",
  },
}
