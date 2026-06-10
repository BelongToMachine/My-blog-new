import React from "react"
import { useTranslations } from "next-intl"
import { RetroBadge } from "./components/system/RetroBadge"
import { RetroStatCard } from "./components/system/RetroStatCard"

interface Props {
  total: number
  webDev: number
  ai: number
  nonTech: number
}

const BlogSummary = ({ total, webDev, ai, nonTech }: Props) => {
  const t = useTranslations("home")

  return (
    <div className="flex min-w-0 flex-row gap-1.5 sm:gap-2 md:gap-4">
      <RetroStatCard
        typography="plain"
        className="min-h-[7.5rem] min-w-0 basis-0 flex-1 px-2 py-3 sm:min-h-[8rem] sm:px-3 sm:py-4 md:min-h-[9rem] md:px-4 md:py-5"
        label={t("webDev")}
        value={webDev}
        hint={
          <RetroBadge
            typography="plain"
            tone="primary"
            className="mt-1 max-w-full justify-center px-1 text-[8px] tracking-[0.02em] sm:px-1.5 sm:text-[9px] md:px-2.5 md:text-[10px]"
          >
            Articles
          </RetroBadge>
        }
      />
      <RetroStatCard
        typography="plain"
        className="min-h-[7.5rem] min-w-0 basis-0 flex-1 px-2 py-3 sm:min-h-[8rem] sm:px-3 sm:py-4 md:min-h-[9rem] md:px-4 md:py-5"
        label={t("ai")}
        value={ai}
        hint={
          <RetroBadge
            typography="plain"
            tone="amber"
            className="mt-1 max-w-full justify-center px-1 text-[8px] tracking-[0.02em] sm:px-1.5 sm:text-[9px] md:px-2.5 md:text-[10px]"
          >
            WIP
          </RetroBadge>
        }
      />
      <RetroStatCard
        typography="plain"
        className="min-h-[7.5rem] min-w-0 basis-0 flex-1 px-2 py-3 sm:min-h-[8rem] sm:px-3 sm:py-4 md:min-h-[9rem] md:px-4 md:py-5"
        label={t("nonTech")}
        value={nonTech}
        hint={
          <RetroBadge
            typography="plain"
            tone="neutral"
            className="mt-1 max-w-full justify-center px-1 text-[8px] tracking-[0.02em] sm:px-1.5 sm:text-[9px] md:px-2.5 md:text-[10px]"
          >
            Closed
          </RetroBadge>
        }
      />
    </div>
  )
}

export default BlogSummary
