import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { defaultLocale, locales, type AppLocale } from "./i18n/routing"

const localeCookieName = "NEXT_LOCALE"

export default function HomeRedirect() {
  const cookieLocale = cookies().get(localeCookieName)?.value

  if (isSupportedLocale(cookieLocale)) {
    redirect(`/${cookieLocale}`)
  }

  const matchedLocale = matchPreferredLocale(
    headers().get("accept-language"),
  )

  redirect(`/${matchedLocale}`)
}

function isSupportedLocale(value: string | undefined): value is AppLocale {
  return locales.some((locale) => locale === value)
}

function matchPreferredLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) {
    return defaultLocale
  }

  const weightedLocales = acceptLanguage
    .split(",")
    .map((part) => {
      const [rawTag, ...params] = part.trim().split(";")
      const weightParam = params.find((param) => param.trim().startsWith("q="))
      const weight = weightParam
        ? Number.parseFloat(weightParam.trim().slice(2))
        : 1

      return {
        tag: rawTag.toLowerCase(),
        weight: Number.isFinite(weight) ? weight : 0,
      }
    })
    .sort((left, right) => right.weight - left.weight)

  for (const { tag } of weightedLocales) {
    if (tag.startsWith("en")) {
      return "en"
    }

    if (tag.startsWith("zh")) {
      return "zh"
    }
  }

  return defaultLocale
}
