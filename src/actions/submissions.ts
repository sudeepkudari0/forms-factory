"use server"

import { db } from "@/lib/db"
import { Event } from "@/lib/events"
import { getCurrentUser } from "@/lib/session"
import { EventType, SubmissionAccessRole, SubmissionStatus } from "@prisma/client"
import { cookies } from "next/headers"
export const createSubmission = async ({ formId }: { formId: string | undefined }) => {
  const user = await getCurrentUser()

  if (!formId) {
    return null
  }

  if (!user?.id) {
    return null
  }

  const dummyData = {}

  const submission = await db.submission.create({
    data: {
      formId: formId,
      data: JSON.stringify(dummyData),
      userId: user?.id,
      status: SubmissionStatus.DRAFT,
    },
  })

  await db.submissionAccess.create({
    data: {
      userId: user?.id,
      submissionId: submission.id,
      role: SubmissionAccessRole.OWNER,
    },
  })
  return submission
}

export const createFinalSubmission = async (data: {
  submissionId?: string
  data: object
  formId: string
}) => {
  const cookieStore = cookies()
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let update
  if (data.submissionId) {
    update = await db.submission.update({
      where: {
        id: data.submissionId,
      },
      data: {
        data: JSON.stringify(data?.data),
        status: SubmissionStatus.SUBMITTED,
      },
    })
  } else {
    update = await db.submission.create({
      data: {
        formId: data.formId,
        data: JSON.stringify(data?.data),
        status: SubmissionStatus.SUBMITTED,
      },
    })
  }

  const user = await db.userForm.findFirst({
    where: {
      formId: update?.formId,
    },
  })
  const event = new Event(EventType.FORM_SUBMISSION)

  await event.emit({
    userId: user?.userId as string,
    data: JSON.stringify(data?.data),
    submissionId: update.id,
  })
  cookieStore.delete("sid")
  cookieStore.delete("fid")
  return update
}
export const createDraftSubmission = async (data: {
  data: object
  submissionId?: string
  formId: string
}) => {
  const cookieStore = cookies()

  if (data.submissionId) {
    const update = await db.submission.update({
      where: {
        id: data.submissionId,
      },
      data: {
        data: JSON.stringify(data.data),
      },
      include: {
        submissionAccesses: true,
      },
    })
    return update
  }

  const create = await db.submission.create({
    data: {
      data: JSON.stringify(data.data),
      status: SubmissionStatus.DRAFT,
      formId: data.formId,
    },
    include: {
      submissionAccesses: true,
    },
  })
  cookieStore.set("sid", create.id, { path: "/" })
  cookieStore.set("fid", create.formId, { path: "/" })
  return create
}

export const getSubmissions = async (formId: string) => {
  const user = await getCurrentUser()
  if (!user?.id) {
    return []
  }
  try {
    const data = await db.submission.findMany({
      where: {
        formId: formId,
        userId: user?.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        submissionAccesses: {
          where: { role: SubmissionAccessRole.COLLABORATOR },
        },
      },
    })
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getSubmissionForUserInteam = async (formId: string) => {
  const user = await getCurrentUser()
  if (!user?.id) {
    return []
  }
  try {
    const data = await db.submission.findMany({
      where: {
        formId: formId,
        userId: user?.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        submissionAccesses: {
          where: { role: SubmissionAccessRole.COLLABORATOR },
        },
      },
    })
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getSubmission = async (submissionId: string, formId: string) => {
  const data = await db.submission.findFirst({
    where: { id: submissionId, formId: formId },
  })

  return data
}

export const getAllSubmissionsForForm = async (formId: string) => {
  return db.submission.findMany({
    where: { formId },
  })
}

export const getSubmissionAccess = async (submissionId: string) => {
  return await db.submissionAccess.findMany({
    where: {
      submissionId,
    },
  })
}

export const getteamsForForm = async (formId: string) => {
  return db.teams.findMany({
    where: {
      forms: {
        some: { formId: formId },
      },
    },
    include: {
      users: true,
    },
  })
}

// Fetch users assigned to a team
export const getUsersForteam = async (teamId: string) => {
  return db.teams
    .findUnique({
      where: { id: teamId },
      include: {
        users: {
          include: {
            user: {
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
    .then((team) => (team ? team.users.map((userteam) => userteam.user) : []))
}

// Fetch teams assigned to a user
export const getUserteams = async (userId: string) => {
  try {
    const userWithteams = await db.user.findUnique({
      where: { id: userId },
      include: {
        teams: {
          include: {
            team: true,
          },
        },
      },
    })
    const teams = userWithteams?.teams.map((userteam) => userteam.team) || []
    return teams
  } catch (error) {
    console.error("Error fetching user teams:", error)
    throw error
  }
}

export const getFormsByteam = async (teamId: string) => {
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
    console.error("Error fetching forms by team:", error)
    throw error
  }
}

export const getSubmissionsforTheForm = async (formId: string) => {
  try {
    const submissions = await db.submission.findMany({
      where: {
        formId,
      },
    })
    return submissions
  } catch (error) {
    console.error("Error fetching submissions:", error)
    throw error
  }
}
