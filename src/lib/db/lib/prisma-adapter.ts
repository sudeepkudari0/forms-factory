export function PrismaAdapter(db: any) {
  return {
    createUser: async (data: any) => {
      return db.user.create({ data })
    },
    getUser: async (id: string) => {
      return db.user.findUnique({ where: { id } })
    },
    getUserByEmail: async (email: string) => {
      return db.user.findUnique({ where: { email } })
    },
    createSession: async (data: any) => {
      return db.session.create({ data })
    },
    getSessionAndUser: async (sessionToken: string) => {
      return db.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
    },
    updateUser: async (data: any) => {
      return db.user.update({
        where: { id: data.id },
        data,
      })
    },
    updateSession: async (data: any) => {
      return db.session.update({
        where: { sessionToken: data.sessionToken },
        data,
      })
    },
    linkAccount: async (rawAccount: any) => {
      return db.account.create({ data: rawAccount })
    },
    getUserByAccount: async (account: any) => {
      return db.account.findFirst({
        where: {
          AND: [{ providerAccountId: account.providerAccountId }, { provider: account.provider }],
        },
        include: { user: true },
      })
    },
    deleteSession: async (sessionToken: string) => {
      return db.session.delete({ where: { sessionToken } })
    },
    createVerificationToken: async (token: any) => {
      return db.verificationToken.create({ data: token })
    },
    useVerificationToken: async (token: any) => {
      const deletedToken = await db.verificationToken.delete({
        where: { identifier_token: { identifier: token.identifier, token: token.token } },
      })
      return deletedToken
    },
    deleteUser: async (id: string) => {
      return db.user.delete({
        where: { id },
        include: { sessions: true, accounts: true },
      })
    },
    unlinkAccount: async (account: any) => {
      return db.account.deleteMany({
        where: {
          AND: [{ providerAccountId: account.providerAccountId }, { provider: account.provider }],
        },
      })
    },
  }
}
