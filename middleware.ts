import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { defaultLocale, locales } from "@/app/i18n/routing"

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

const protectedRoute = /^\/(en|zh)\/blogs\/(new|\d+\/edit)\/?$/

export default async function middleware(request: NextRequest) {
  const [, localeOrSegment = ""] = request.nextUrl.pathname.split("/")
  const pathnameWithoutLocale = locales.includes(localeOrSegment as (typeof locales)[number])
    ? request.nextUrl.pathname.replace(`/${localeOrSegment}`, "") || "/"
    : request.nextUrl.pathname

  if (protectedRoute.test(request.nextUrl.pathname) || /^\/blogs\/(new|\d+\/edit)\/?$/.test(pathnameWithoutLocale)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      const signInUrl = new URL("/api/auth/signin", request.url)
      signInUrl.searchParams.set(
        "callbackUrl",
        request.nextUrl.pathname + request.nextUrl.search
      )
      return NextResponse.redirect(signInUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
