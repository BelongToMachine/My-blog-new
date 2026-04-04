"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/app/i18n/navigation"
import { NavTextButton } from "../system/NavTextButton"

const LanguageToggle = () => {
  const locale = useLocale()
  const t = useTranslations("nav")
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = locale === "zh" ? "en" : "zh"

  return (
    <NavTextButton
      onClick={() => router.replace(pathname, { locale: toggleLocale })}
      type="button"
    >
      {t("language")}
    </NavTextButton>
  )
}

export default LanguageToggle
