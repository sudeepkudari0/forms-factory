import "./src/env.mjs"
import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/forms",
        destination: "/dashboard",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
