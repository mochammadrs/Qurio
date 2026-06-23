import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  const protectedRoutes = ["/play", "/result", "/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
