import React from "react"
import { useTranslations } from "next-intl"
import SectionHeading from "./components/system/SectionHeading"

const SummaryHeader = () => {
  const t = useTranslations("home")

  return (
    <div>
      <SectionHeading title={t("blogSummary")} align="left" variant="plain" />
    </div>
  )
}

export default SummaryHeader
