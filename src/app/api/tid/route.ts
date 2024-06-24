import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const fetchTid = async () => {
  const user = await getCurrentUser()
  const userWithTeams = await db.userTeam.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      team: true,
    },
  })

  const tid = userWithTeams[0].team.id
  let tname = userWithTeams[0].team.name
  tname = tname.replace(/\s+/g, "-")
  return { tid, tname }
}

export async function GET() {
  const cookieStore = cookies()
  const tdetails = await fetchTid()

  cookieStore.set("tid", tdetails.tid, { path: "/" })
  cookieStore.set("tname", tdetails.tname, { path: "/" })

  return NextResponse.redirect(`${env.APP_URL}/user/${tdetails.tid}`)
}
