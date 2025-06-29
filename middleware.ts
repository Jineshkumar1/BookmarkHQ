import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const protectedPaths = ["/profile", "/settings", "/test"]

  // Check if the current path requires authentication
  const isProtectedPath = protectedPaths.some((protectedPath) => path.startsWith(protectedPath))

  // If it's a protected path, check for authentication
  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token found, redirect to signin
    if (!token) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except api routes, _next static files, and images
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
