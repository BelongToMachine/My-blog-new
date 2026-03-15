import React from "react"
import { useTranslations } from "next-intl"

const SummaryHeader = () => {
  const t = useTranslations("home")

  return (
    <div className="mb-8 flex flex-col gap-3">
      <p className="section-kicker">{t("blogSummaryEyebrow")}</p>
      <h2 className="home-page-heading max-w-3xl">{t("blogSummary")}</h2>
      <p className="section-copy">{t("blogSummaryDescription")}</p>
    </div>
  )
}

export default SummaryHeader
