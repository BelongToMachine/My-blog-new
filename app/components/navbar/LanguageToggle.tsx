"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/app/i18n/navigation"

const LanguageToggle = () => {
  const locale = useLocale()
  const t = useTranslations("nav")
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = locale === "zh" ? "en" : "zh"

  return (
    <button
      className="nav-link"
      onClick={() => router.replace(pathname, { locale: toggleLocale })}
      type="button"
    >
      {t("language")}
    </button>
  )
}

export default LanguageToggle
