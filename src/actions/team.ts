"use server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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
  address: string
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
