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
    <div className="grid grid-cols-3 gap-4">
      <RetroStatCard
        className="w-full min-w-0"
        label={t("webDev")}
        value={total}
        hint={
          <RetroBadge tone="primary" className="mt-1">
            ARTICLES
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="w-full min-w-0"
        label={t("tech")}
        value={0}
        hint={
          <RetroBadge tone="amber" className="mt-1">
            WIP
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="w-full min-w-0"
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
