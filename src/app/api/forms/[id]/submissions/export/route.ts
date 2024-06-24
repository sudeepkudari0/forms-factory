import { auth } from "@/auth"
import { db } from "@/lib/db"
import { convertSubmissionsToCsv } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)

  const { id } = params
  const format = searchParams.get("format")
  const userId = searchParams.get("uid")
  const teamId = searchParams.get("fid")
  const token = await auth()

  // Check if user is logged in
  if (!token) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  // Query form
  const form = await db.form.findFirst({
    where: { id },
  })

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }

  // Define where clause based on presence of teamId and userId
  const whereClause: any = { formId: form.id }
  if (teamId) {
    whereClause.teamId = teamId
  }
  if (userId) {
    whereClause.userId = userId
  }

  // Query submissions
  const dataWithUidFid = await db.submission.findMany({
    where: whereClause,
  })

  const data = await db.submission.findMany({
    where: { formId: form.id },
  })

  // Handle CSV format
  if (format === "csv") {
    if (dataWithUidFid.length) {
      const csv = convertSubmissionsToCsv(dataWithUidFid)
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${id}.csv"`,
        },
      })
    }
    const csv = convertSubmissionsToCsv(data)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${id}.csv"`,
      },
    })
  }

  return NextResponse.json({ error: "Invalid or missing value for param: format" }, { status: 400 })
}
