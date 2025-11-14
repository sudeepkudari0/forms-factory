import { db } from "@/lib/db"
import NextAuth, { type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { UserRole, UserStatus } from "@prisma/client"

import { createteam } from "@/actions/team"
import { addUserToteams } from "@/actions/users"

export const BASE_PATH = "/api/auth"

export const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      try {
        // Check if user already exists
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        })

        // If user doesn't exist, create them with a team
        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              name: user.name || "User",
              email: user.email,
              image: user.image,
              userRole: UserRole.USER,
              userStatus: UserStatus.ACTIVE,
              hashedPassword: null, // Null for OAuth users
              whatsapp: null, // Can be filled in profile later
            },
          })

          // Create or update the OAuth account link
          if (account) {
            await db.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              create: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
              update: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })
          }

          // Create a team for the new user
          const team = await createteam({
            name: `${newUser.name}'s Team`,
          })

          if (team) {
            await addUserToteams({
              userId: newUser.id,
              teamIds: [team.id],
            })
          }
        } else if (account) {
          // User exists, make sure account is linked
          await db.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
            update: {
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
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

      if (!dbUser) {
        if (user) {
          token.id = user.id as string
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
