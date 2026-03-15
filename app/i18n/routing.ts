import { defineRouting } from "next-intl/routing"

export const locales = ["en", "zh"] as const
export const defaultLocale = "zh"

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
})

export type AppLocale = (typeof locales)[number]
