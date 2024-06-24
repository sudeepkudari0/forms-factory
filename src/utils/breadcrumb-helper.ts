"use server"

import { db } from "@/lib/db"

export async function getIdToNameMappings() {
  const forms = await db.form.findMany({
    select: {
      id: true,
      title: true,
    },
  })

  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  const teams = await db.teams.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  const formMappings = forms.reduce(
    (acc, form) => {
      acc[form.id] = form.title
      return acc
    },
    {} as { [key: string]: string }
  )

  const userMappings = users.reduce(
    (acc, user) => {
      acc[user.id] = user.name
      return acc
    },
    {} as { [key: string]: string }
  )

  const teamMappings = teams.reduce(
    (acc, team) => {
      acc[team.id] = team.name
      return acc
    },
    {} as { [key: string]: string }
  )

  return {
    forms: formMappings,
    users: userMappings,
    teams: teamMappings,
  }
}
