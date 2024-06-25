"use server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { FormStatus, SubmissionAccessRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const getForm = async ({ id }: { id: string }) => {
  const form = await db.form.findFirst({
    where: { id },
    include: {
      fields: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!form) {
    throw new Error("Form not found")
  }

  return form
}

export const getFormSubmissions = async ({ id }: { id: string }) => {
  return await db.submission.findMany({
    where: { formId: id },
  })
}

export async function createForm(values: {
  title: string
  description?: string
  submitText: string
  userId: string
  username: string
}) {
  const { title, description, submitText, userId, username } = values

  if (!title && !submitText && !userId) {
    throw new Error("Invalid input: title, submitText, and userId are required.")
  }

  try {
    const form = await db.form.create({
      data: {
        title,
        description,
        submitText,
        createdBy: username,
      },
    })

    revalidatePath("/super-admin")
    revalidatePath("/user-plus")
    revalidatePath("/admin")
    return form
  } catch (error) {
    console.error("Error creating form:", error)
    throw error
  }
}

export async function setFormPublished(values: {
  id: string
  published: boolean
}) {
  const { id, published } = values

  const updatedForm = await db.form.update({
    where: { id },
    data: { published },
  })

  revalidatePath("/forms")
  return updatedForm
}

export async function setFormArchived(values: {
  id: string
  archived: boolean
}) {
  const { id, archived } = values

  const updatedForm = await db.form.update({
    where: { id },
    data: { archived },
  })

  revalidatePath("/super-admin")
  revalidatePath("/admin")
  revalidatePath("/user-plus/create")
  return updatedForm
}

export async function updateFormPrivacy(values: {
  formId: string
  isPublic: FormStatus
}) {
  const { formId, isPublic } = values

  const updatedForm = await db.form.update({
    where: { id: formId },
    data: {
      status: isPublic === FormStatus.PUBLIC ? FormStatus.PUBLIC : FormStatus.PRIVATE,
    },
  })

  revalidatePath("/super-admin")
  revalidatePath("/admin")
  revalidatePath("/user-plus/create")
  return updatedForm
}

export async function deleteForm(id: string) {
  const data = await db.form.delete({ where: { id } })
  revalidatePath("/super-admin")
  return data
}

export async function getAllFormsNotInAnyteam() {
  try {
    const forms = await db.form.findMany({
      where: {
        teams: {
          none: {},
        },
        archived: false,
      },
      include: {
        fields: true,
        submissions: true,
        users: true,
      },
    })

    return forms
  } catch (error) {
    console.error("Error fetching forms not in any team:", error)
    return []
  }
}

export async function getForminteam(teamId: string) {
  try {
    const forms = await db.form.findMany({
      where: {
        teams: {
          some: {
            teamId: teamId,
          },
        },
      },
    })

    return forms
  } catch (error) {
    console.error("Error fetching forms in team:", error)
    return []
  }
}

// Fetch all teams and forms not associated with a specific user
export const getAllteamFormsNotInUser = async (userId: string) => {
  // Fetch the user with their associated forms and teams
  const userFormsteams = await db.user.findUnique({
    where: { id: userId },
    include: {
      forms: {
        include: {
          form: true,
        },
      },
      teams: {
        include: {
          team: {
            include: {
              forms: {
                include: {
                  form: true,
                },
              },
            },
          },
        },
      },
    },
  })

  // Extract form and team IDs associated with the user
  const userFormIds = userFormsteams?.forms.map((userForm) => userForm.form.id) || []
  const teamIds = userFormsteams?.teams.map((userteam) => userteam.team.id) || []

  // Fetch teams including their forms, filtered by the user's teams
  const data = await db.teams.findMany({
    include: {
      forms: {
        include: {
          form: true,
        },
      },
    },
    where: {
      id: {
        in: teamIds,
      },
    },
  })

  // Filter out forms already associated with the user
  const filteredData = data.map((team) => ({
    ...team,
    forms: team.forms.filter((form) => !userFormIds.includes(form.formId)),
  }))
  return filteredData
}

// Fetch all teams and forms associated with a specific user
export const getteamFormsInUser = async (userId: string) => {
  try {
    const userForms = await db.user.findUnique({
      where: { id: userId },
      include: { forms: true },
    })

    if (!userForms) {
      console.error(`User with ID ${userId} not found`)
      return []
    }

    const userFormIds = userForms.forms.map((userForm) => userForm.formId)

    if (userFormIds.length === 0) {
      console.log(`No forms found for user with ID ${userId}`)
      return []
    }

    const teamsWithForms = await db.teams.findMany({
      include: {
        forms: {
          include: {
            form: true,
          },
        },
      },
      where: {
        forms: {
          some: {
            form: {
              id: {
                in: userFormIds,
              },
            },
          },
        },
      },
    })

    if (teamsWithForms.length === 0) {
      console.log(`No teams found with forms for user with ID ${userFormIds}`)
      return []
    }
    return teamsWithForms
  } catch (error) {
    console.error(error)
    return []
  } finally {
    await db.$disconnect()
  }
}

export const getUserFormIds = async (userId: string) => {
  const userForms = await db.user.findUnique({
    where: { id: userId },
    include: { forms: true },
  })

  const userFormIds = userForms?.forms.map((form) => form.formId) || []

  return userFormIds
}

// Add selected forms to a user
export const addFormsToUser = async ({
  userId,
  formIds,
}: {
  userId: string
  formIds: string[]
}) => {
  try {
    return await db.$transaction(
      formIds.map((formId) =>
        db.userForm.create({
          data: {
            userId,
            formId,
          },
        })
      )
    )
  } catch (error) {
    console.error("Error adding forms to user:", error)
    throw new Error("Failed to add forms to user")
  } finally {
    await db.$disconnect()
  }
}

// Remove selected forms from a user
export const removeFormsFromUser = async ({
  userId,
  formIds,
}: {
  userId: string
  formIds: string[]
}) => {
  try {
    const deletePromises = formIds.map((formId) =>
      db.userForm.deleteMany({
        where: {
          userId,
          formId,
        },
      })
    )

    const data = await Promise.all(deletePromises)

    // Optionally, return the result if you need it
    return data
  } catch (error) {
    console.error("Error removing forms from user:", error)
    throw new Error("Failed to remove forms from user")
  } finally {
    await db.$disconnect()
  }
}

export const getFormsAndTeams = async (teamId: string) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }
  try {
    const userWithFormsAndTeams = await db.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        forms: {
          include: {
            form: {
              include: {
                fields: true,
                submissions: {
                  include: {
                    submissionAccesses: true,
                  },
                },
                teams: {
                  include: {
                    team: true,
                  },
                },
              },
            },
          },
        },
        teams: {
          include: {
            team: {
              include: {
                forms: {
                  include: {
                    form: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    let forms = []
    if (teamId) {
      forms =
        userWithFormsAndTeams?.forms
          .map((userForm) => ({
            ...userForm.form,
            teams: userForm.form.teams.map((teamForm) => teamForm.team),
          }))
          .filter((form) => form.teams.some((team) => team.id === teamId)) || []
    } else {
      forms =
        userWithFormsAndTeams?.forms.map((userForm) => ({
          ...userForm.form,
          teams: userForm.form.teams.map((teamForm) => teamForm.team),
        })) || []
    }

    const teams =
      userWithFormsAndTeams?.teams.map((userTeam) => ({
        ...userTeam.team,
        forms: userTeam.team.forms.map((teamForm) => teamForm.form),
      })) || []
    return { forms, teams }
  } catch (error) {
    console.error("Error fetching forms and teams:", error)
    return { forms: [], teams: [] }
  }
}

export const getTeamForms = async (teamId: string) => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }
  try {
    const teamForms = await db.form.findMany({
      where: {
        teams: {
          some: {
            teamId,
          },
        },
      },
    })

    return teamForms
  } catch (error) {
    console.error("Error fetching team forms:", error)
    return []
  }
}

export type sharedForms = Awaited<ReturnType<typeof getSharedSubmissions>>[number]

export const getSharedSubmissions = async () => {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not authenticated")
  }

  try {
    const data = await db.submissionAccess.findMany({
      where: {
        userId: user.id,
        role: SubmissionAccessRole.COLLABORATOR,
      },
      include: {
        submission: {
          include: {
            form: true,
          },
        },
      },
    })
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const updateFormAccess = async (userIds: string[], submissionId: string) => {
  if (!submissionId) {
    console.log("Submission ID not provided")
    return null
  }

  const currentCollaborators = await db.submissionAccess.findMany({
    where: { submissionId, role: SubmissionAccessRole.COLLABORATOR },
    select: { userId: true },
  })

  const currentUserIds = currentCollaborators.map((collab) => collab.userId)

  const usersToAdd = userIds.filter((userId) => !currentUserIds.includes(userId))

  const usersToRemove = currentUserIds.filter((userId) => !userIds.includes(userId))

  if (usersToAdd.length > 0) {
    await db.submissionAccess.createMany({
      data: usersToAdd.map((userId) => ({
        userId,
        submissionId,
        role: SubmissionAccessRole.COLLABORATOR,
      })),
    })
  }

  if (usersToRemove.length > 0) {
    await db.submissionAccess.deleteMany({
      where: {
        submissionId,
        userId: { in: usersToRemove },
        role: SubmissionAccessRole.COLLABORATOR,
      },
    })
  }

  revalidatePath("/user")
  return { added: usersToAdd, removed: usersToRemove }
}

export const duplicateFormFields = async (id: string) => {
  const user = await getCurrentUser()

  // Fetch the form and its fields
  const getForm = await db.form.findFirst({
    where: { id },
    include: { fields: true },
  })

  if (!getForm) {
    throw new Error("Form not found")
  }

  // Create a new form with the copied details
  const newForm = await db.form.create({
    data: {
      title: `${getForm.title}_copy`,
      description: getForm.description,
      submitText: getForm.submitText,
      createdBy: user?.name as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  // Duplicate each field associated with the form
  if (getForm.fields.length) {
    const newFields = getForm.fields.map((field) => ({
      ...field,
      id: undefined, // Let the database generate a new ID
      formId: newForm.id, // Associate the field with the new form
    }))

    await db.field.createMany({ data: newFields })
  }

  revalidatePath("/super-admin")
  return newForm
}
