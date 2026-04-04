import React from "react"
import { useTranslations } from "next-intl"
import { SectionHeading } from "./components/system"

const SummaryHeader = () => {
  const t = useTranslations("home")

  return <SectionHeading title={t("blogSummary")} className="mt-4" />
}

export default SummaryHeader
