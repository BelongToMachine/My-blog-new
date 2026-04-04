import React from "react"
import { useTranslations } from "next-intl"
import SectionHeading from "./components/system/SectionHeading"

const SummaryHeader = () => {
  const t = useTranslations("home")

  return <SectionHeading title={t("blogSummary")} />
}

export default SummaryHeader
