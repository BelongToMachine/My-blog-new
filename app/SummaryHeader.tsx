import React from "react"
import { useTranslations } from "next-intl"

const SummaryHeader = () => {
  const t = useTranslations("home")

  return <h1 className="home-page-heading">{t("blogSummary")}</h1>
}

export default SummaryHeader
