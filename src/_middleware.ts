import { type NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

export default async function middleware(req: NextRequest, _res: NextResponse) {
  const session = await auth()
  const isAuth = !!session?.user

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/user", req.url))
    }

    return null
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }

    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
  }

  // If user is authenticated and accessing protected routes, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ["/forms/:path*", "/login", "/register"],
}
