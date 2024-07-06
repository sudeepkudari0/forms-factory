"use server"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { type User, UserRole, UserStatus } from "@prisma/client"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"
import { createteam } from "./team"

export async function getUserDetails(id: string) {
  try {
    return await db.user.findUnique({
      where: {
        id,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

export const createSuperUser = async (values: {
  name: string
  email: string
  password: string
}) => {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(values.password, saltRounds)

    return await db.user.create({
      data: {
        name: values.name,
        email: values.email,
        hashedPassword: hashedPassword,
        userRole: UserRole.SUPER_ADMIN,
        whatsapp: "8596523652",
        userStatus: UserStatus.ACTIVE,
      },
    })
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function createUser(values: {
  name: string
  email: string
  password: string
  accessToken: string
}) {
  try {
    if (values.accessToken !== env.SIGNUP_ACCESS_TOKEN) {
      return {
        status: "error",
        error: "Invalid access token",
      }
    }
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(values.password, saltRounds)

    const createdUser = await db.user.create({
      data: {
        name: values.name,
        email: values.email,
        hashedPassword: hashedPassword,
        whatsapp: "8596523652",
        userRole: UserRole.USER,
        userStatus: UserStatus.ACTIVE,
      },
    })

    const createTeam = await createteam({
      name: `${values.name}'s Team`,
    })

    if (createTeam) {
      await addUserToteams({
        userId: createdUser.id,
        teamIds: [createTeam.id],
      })
    }

    return {
      status: "success",
      data: createdUser,
    }
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }

  // const { email, whatsapp: to, name } = createdUser

  // if (values.preApproved) {
  //   const { error } = await tr.whatsapp.trDatacenter.accountConfirmation({
  //     to: to,
  //     lang: "en_US",
  //     name: name,
  //     crendentials: {
  //       email: email,
  //       password: values.password,
  //     },
  //   })

  //   if (error) {
  //     console.log(error)
  //   }
  // } else {
  //   const whatsappNumbers = await getAdminsSuperAdminWhatsapp()

  //   for (const adminWhatsapp of whatsappNumbers) {
  //     if (adminWhatsapp) {
  //       const { whatsapp: number } = adminWhatsapp
  //       const { error } = await tr.whatsapp.trDatacenter.newRequestNotification({
  //         to: number,
  //         lang: "en_US",
  //         name: name,
  //       })

  //       if (error) {
  //         console.log(error)
  //       }
  //     }
  //   }
  // }
}

export const getCurrentUserDetails = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }
  return db.user.findUnique({ where: { id: user.id } })
}

export async function updateUser(values: {
  userId: string
  name: string
  email: string
  status: UserStatus
  whatsapp: string
}) {
  const updatedUser = await db.user.update({
    where: { id: values.userId },
    data: {
      name: values.name,
      email: values.email,
      userStatus: values.status,
      whatsapp: values.whatsapp,
    },
  })

  revalidatePath("super-admin/users")
  return updatedUser
}

export const getUsersandPlus = async () => {
  try {
    const data = await db.user.findMany({
      where: {
        OR: [{ userRole: UserRole.USER }],
      },
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const profileUpdate = async (values: {
  userId: string
  name: string
  image: string
  email: string
  whatsapp: string
}) => {
  const data = await db.user.update({
    where: { id: values.userId },
    data: {
      name: values.name,
      image: values.image,
      email: values.email,
      whatsapp: values.whatsapp,
    },
  })

  revalidatePath("/[teamName]")

  return data
}

export const profilePasswordUpdate = async (values: {
  userId: string
  password: string
}) => {
  return await db.user.update({
    where: { id: values.userId },
    data: {
      hashedPassword: await bcrypt.hash(values.password, 10),
    },
  })
}

export const getAllUsers = async () => {
  try {
    const data = await db.user.findMany({
      where: {
        userRole: UserRole.USER,
      },
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getAllUsersWithCollaborators = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { users: [], collaborators: [] }
    }

    const data = await db.user.findMany({
      where: {
        OR: [{ userRole: UserRole.USER }],
      },
    })

    const filteredData: User[] = data.filter((item) => item.id !== user.id)
    const collaborators = await db.submissionAccess.findMany()

    return { users: filteredData, collaborators }
  } catch (error) {
    console.log(error)
    return { users: [], collaborators: [] }
  }
}

export async function deleteUser(values: { userId: string }) {
  try {
    const { userId } = values

    const deletedUser = await db.user.delete({
      where: {
        id: userId,
      },
    })

    return { success: true, data: deletedUser }
  } catch (error) {
    console.log(error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function userNotInteam(userId: string) {
  try {
    const allteams = await db.teams.findMany({
      where: {
        users: {
          none: {
            userId: userId,
          },
        },
      },
    })
    return allteams
  } catch (error) {
    console.error("Error fetching teams for user:", error)
    return []
  } finally {
    await db.$disconnect()
  }
}

export async function userInteam(userId: string) {
  try {
    const userteams = await db.user.findMany({
      where: {
        id: userId,
      },
      include: {
        teams: true,
      },
    })

    const allteams = await db.teams.findMany()

    const teamsUserIn = allteams.filter((team) => {
      return userteams.some((user) => user.teams.some((userteam) => userteam.teamId === team.id))
    })

    return teamsUserIn
  } catch (error) {
    console.error("Error fetching teams for user:", error)
    return []
  }
}

interface AddUserToteamsOptions {
  userId: string
  teamIds: string[]
}

export async function addUserToteams({ userId, teamIds }: AddUserToteamsOptions) {
  try {
    // Connect the user to the teams using the Userteam join table
    await Promise.all(
      teamIds.map(async (teamId) => {
        return await db.userTeam.create({
          data: {
            userId,
            teamId,
          },
        })
      })
    )

    // Fetch and return the updated user with their associated teams
    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    })
    revalidatePath("/user")
    return updatedUser
  } catch (error) {
    console.error("Error adding user to teams:", error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

export async function removeUserFromteam(values: {
  userId: string
  teamIds: string[]
}) {
  const { userId, teamIds } = values

  // Remove user from the specified teams
  await Promise.all(
    teamIds.map(async (teamId) => {
      return await db.userTeam.deleteMany({
        where: {
          userId,
          teamId,
        },
      })
    })
  )

  // Fetch and return the updated user with their remaining teams
  const updatedUser = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      teams: {
        include: {
          team: true,
        },
      },
    },
  })
  return updatedUser
}

export async function getteamsAndFormsNotAssociatedWithUser(userId: string) {
  try {
    const teams = await db.teams.findMany({
      where: {
        users: {
          none: {
            userId,
          },
        },
      },
      include: {
        forms: {
          include: {
            form: true,
          },
          where: {
            form: {
              users: {
                none: {
                  userId,
                },
              },
            },
          },
        },
      },
    })

    const formattedteams = teams.map((team) => ({
      ...team,
      forms: team.forms.map((teamForm) => teamForm.form),
    }))

    return formattedteams
  } catch (error) {
    console.error("Error fetching teams and forms not associated with user:", error)
    throw error
  }
}
