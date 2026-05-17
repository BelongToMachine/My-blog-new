"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/app/i18n/navigation"
import { NavTextButton } from "../system/NavTextButton"

interface LanguageToggleProps {
  className?: string
}

const LanguageToggle = ({ className }: LanguageToggleProps) => {
  const locale = useLocale()
  const t = useTranslations("nav")
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = locale === "zh" ? "en" : "zh"

  return (
    <NavTextButton
      onClick={() => router.replace(pathname, { locale: toggleLocale })}
      type="button"
      className={className}
    >
      {t("language")}
    </NavTextButton>
  )
}

export default LanguageToggle
