import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { body } = await req.json()
    return NextResponse.json({ message: "Webhook received", body }, { status: 200 })
  } catch (error) {
    return new Response(null, { status: 405 })
  }
}
