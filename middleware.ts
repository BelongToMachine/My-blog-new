import createMiddleware from "next-intl/middleware"
import { defaultLocale, locales } from "@/app/i18n/routing"

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
})

export default intlMiddleware

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
