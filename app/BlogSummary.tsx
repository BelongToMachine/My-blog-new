import React from "react"
import { useTranslations } from "next-intl"
import { RetroBadge } from "./components/system/RetroBadge"
import { RetroStatCard } from "./components/system/RetroStatCard"

interface Props {
  total: number
}

const BlogSummary = ({ total }: Props) => {
  const t = useTranslations("home")

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <RetroStatCard
        className="min-w-[132px]"
        label={t("webDev")}
        value={total}
        hint={
          <RetroBadge tone="primary" className="mt-1">
            ARTICLES
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="min-w-[132px]"
        label={t("tech")}
        value={0}
        hint={
          <RetroBadge tone="amber" className="mt-1">
            WIP
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="min-w-[132px]"
        label={t("nonTech")}
        value={0}
        hint={
          <RetroBadge tone="neutral" className="mt-1">
            CLOSED
          </RetroBadge>
        }
      />
    </div>
  )
}

export default BlogSummary
