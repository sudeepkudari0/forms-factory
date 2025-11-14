import { NextResponse } from "next/server"

const disabledResponse = NextResponse.json(
  { message: "Uploads are disabled in this demo." },
  { status: 501 }
)

export async function GET() {
  return disabledResponse
}

export async function POST() {
  return disabledResponse
}
