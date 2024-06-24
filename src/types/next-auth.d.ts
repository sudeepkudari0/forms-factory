import type { UserRole, UserStatus } from "@prisma/client"

type UserId = string

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
    username?: string
    email?: string
    role?: UserRole
    status?: UserStatus
  }
}

// declare module "next-auth" {
//   interface Session {
//     user: User & {
//       id: UserId
//     }
//   }
// }

declare module "next-auth" {
  interface User {
    id: string
    username?: string
    role?: UserRole
    status?: UserStatus
  }
  interface Session {
    user: User
  }
}
