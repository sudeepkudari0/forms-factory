"use server"
import { db } from "@/lib/db"
import { sendInvitationEmail } from "@/lib/mail"
import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function getteam() {
  try {
    const data = await db.teams.findMany()
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createteam(values: {
  name: string
}) {
  try {
    const data = await db.teams.create({
      data: {
        name: values.name,
      },
    })
    revalidatePath("/super-admin/teams")
    revalidatePath("/user")
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function updateteam(values: {
  userId: string
  name: string
}) {
  try {
    const data = await db.teams.update({
      where: {
        id: values.userId,
      },
      data: {
        name: values.name,
      },
    })
    revalidatePath("/super-admin/teams")
    revalidatePath("/user")
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteteam(values: { teamId: string }) {
  const { teamId } = values

  const deletedteam = await db.teams.delete({
    where: {
      id: teamId,
    },
  })

  revalidatePath("/super-admin/teams")
  return deletedteam
}

export async function addFormsToteam(values: {
  teamId: string
  formIds: string[]
}) {
  const { teamId, formIds } = values

  if (!teamId || !formIds.length) {
    throw new Error("Invalid input: teamId and formIds are required.")
  }

  try {
    const createPromises = formIds.map((formId) =>
      db.teamForm.create({
        data: {
          teamId,
          formId,
        },
      })
    )

    const updatedteamForms = await Promise.all(createPromises)

    // Revalidate path, assuming revalidatePath is defined elsewhere
    revalidatePath(`/super-admin/teams/${teamId}`)
    return updatedteamForms
  } catch (error) {
    console.error("Error adding forms to team:", error)
    throw error
  }
}

export async function removeFormsFromteam(values: {
  teamId: string
  formIds: string[]
}) {
  const { teamId, formIds } = values
  if (!teamId || !formIds.length) {
    throw new Error("Invalid input: teamId and formIds are required.")
  }

  try {
    const deletePromises = formIds.map((formId) =>
      db.teamForm.deleteMany({
        where: {
          teamId,
          formId,
        },
      })
    )

    const deletedteamForms = await Promise.all(deletePromises)
    revalidatePath(`/super-admin/teams/${teamId}`)
    return deletedteamForms
  } catch (error) {
    console.error("Error adding forms to team:", error)
    throw error
  }
}

export const getUserteams = async (teamId: string) => {
  try {
    return await db.user.findMany({
      where: {
        teams: {
          some: {
            teamId: teamId,
          },
        },
      },
      include: {
        teams: true,
      },
    })
  } catch (error) {
    console.log(error)
    return []
  }
}

export type getteams = Awaited<ReturnType<typeof getteams>>[number]

export const getteams = async () => {
  try {
    const data = await db.teams.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
        forms: {
          include: {
            form: true,
          },
        },
      },
    })
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUserTeams = async (userId: string) => {
  return db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      teams: true,
    },
  })
}

export const getTeams = async (teamId: string) => {
  return db.userTeam.findMany({
    where: {
      userId: teamId,
    },
    include: {
      team: true,
    },
  })
}

// For inviting users to team
const token = uuidv4()

export async function inviteUserToTeam(values: {
  teamId: string
  teamName: string
  email: string
}) {
  const user = await getCurrentUser()

  const { teamId, email, teamName } = values
  if (!teamId || !email) {
    throw new Error("Invalid input: teamId, email are required.")
  }
  try {
    const inviteData = await db.invitation.create({
      data: {
        teamId,
        email,
        token,
        inviterId: user?.id as string,
      },
    })

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/login?nextUrl=/invite?token=${token}`
    const mail = await sendInvitationEmail(email, user?.name as string, teamName, link)
    console.log(mail)

    return inviteData
  } catch (error) {
    console.error("Error inviting user to team:", error)
    throw error
  }
}

export async function getInviteInfo(token: string): Promise<any> {
  try {
    const invite = await db.invitation.findUnique({
      where: {
        token,
      },
    })
    if (!invite) {
      return "Invalid token"
    }
    return invite
  } catch (error) {
    console.error("Error getting invite info:", error)
    return error
  }
}

// To accept the invite
export async function invitationAccept(values: {
  token: string
}): Promise<any> {
  const user = await getCurrentUser()
  const { token } = values
  if (!token) {
    throw new Error("Invalid input: token is required.")
  }
  try {
    const invite = await db.invitation.findUnique({
      where: {
        token,
      },
    })

    if (!invite) {
      return "Invalid token"
    }

    await db.userTeam.create({
      data: {
        userId: user?.id as string,
        teamId: invite.teamId,
      },
    })

    await db.invitation.deleteMany({
      where: {
        token,
      },
    })
    return {
      success: true,
      message: "Successfully joined team.",
    }
  } catch (error) {
    console.error("Error accepting invite:", error)
    return {
      success: false,
      message: "Error joining team.",
    }
  }
}
