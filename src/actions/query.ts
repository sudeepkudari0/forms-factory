"use server"

import { db } from "@/lib/db"

export async function getAllteams() {
  const teams = await db.teams.findMany({
    include: {
      users: true,
    },
  })
  return teams
}
