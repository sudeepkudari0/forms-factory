import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import NextAuth, { type NextAuthConfig, type User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "./lib/db/lib/prisma-adapter"

export const BASE_PATH = "/api/auth"

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (credentials?.email && credentials?.password) {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          })

          if (user && (await bcrypt.compare(credentials.password as string, user.hashedPassword))) {
            return { id: user.id, name: user.name, email: user.email }
          }
          return null
        }
        return null
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        // @ts-expect-error
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.image = token.picture
        // @ts-expect-error
        session.user.role = token.role
        // @ts-expect-error
        session.user.status = token.status
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          // @ts-expect-error
          email: token.email,
        },
      })

      // let dbUser
      // if (token.email) {
      //   dbUser = await db.user.findFirst({
      //     where: { email: token.email },
      //   })
      // }

      if (!dbUser) {
        if (user) {
          // token.id = user.id as string
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.userRole,
        email: dbUser.email,
        picture: dbUser.image,
        status: dbUser.userStatus,
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
}

// Initialize NextAuth with the configured options
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
