import { db } from "@/lib/db"
import bcrypt from "bcrypt"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { teamID: string } }) {
  try {
    const apiKey = req.headers.get("x-api-key")
    const teamId = params.teamID
    if (!apiKey) {
      return NextResponse.json({ error: "API key is missing" }, { status: 400 })
    }

    const prefix = apiKey.slice(0, 6)

    const apiKeyRecord = await db.apiKey.findFirst({
      where: {
        prefix: prefix,
      },
    })

    if (!apiKeyRecord) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(apiKey, apiKeyRecord.key)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const forms = await db.form.findMany({
      where: {
        teams: {
          some: {
            teamId: teamId,
          },
        },
      },
      include: {
        fields: true,
      },
    })

    return NextResponse.json({ forms }, { status: 200 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
