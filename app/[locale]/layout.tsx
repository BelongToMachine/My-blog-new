import type { Metadata } from "next"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import NavBar from "../NavBar"
import AuthProvider from "../auth/Provider"
import QueryClientProvider from "../QueryClientProvider"
import CursorManager from "../CursorManager"
import { ThemeProvider } from "../context/DarkModeContext"
import RadixThemeProvider from "../context/RadixThemeProvider"
import { xTheme } from "../service/ThemeService"
import { locales } from "../i18n/routing"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = params

  if (!hasLocale(locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: "meta" })

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!hasLocale(locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div style={xTheme.layoutBackground}>
        <QueryClientProvider>
          <AuthProvider>
            <ThemeProvider>
              <RadixThemeProvider>
                <NavBar />
                <CursorManager />
                <main className="pt-14">{children}</main>
              </RadixThemeProvider>
              <ReactQueryDevtools />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </NextIntlClientProvider>
  )
}
