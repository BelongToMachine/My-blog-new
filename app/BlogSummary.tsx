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
    <div className="flex min-w-0 flex-wrap gap-2 sm:gap-3 md:gap-4">
      <RetroStatCard
        className="min-h-[9rem] min-w-0 basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-0 lg:flex-1"
        label={t("webDev")}
        value={total}
        hint={
          <RetroBadge
            tone="primary"
            className="mt-1 max-w-full justify-center px-1.5 text-[8px] tracking-[0.08em] sm:px-2 sm:text-[9px] sm:tracking-[0.14em] md:px-2.5 md:text-[10px] md:tracking-[0.22em]"
          >
            ARTICLES
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="min-h-[9rem] min-w-0 basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-0 lg:flex-1"
        label={t("tech")}
        value={0}
        hint={
          <RetroBadge
            tone="amber"
            className="mt-1 max-w-full justify-center px-1.5 text-[8px] tracking-[0.08em] sm:px-2 sm:text-[9px] sm:tracking-[0.14em] md:px-2.5 md:text-[10px] md:tracking-[0.22em]"
          >
            WIP
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="min-h-[9rem] min-w-0 basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-0 lg:flex-1"
        label={t("nonTech")}
        value={0}
        hint={
          <RetroBadge
            tone="neutral"
            className="mt-1 max-w-full justify-center px-1.5 text-[8px] tracking-[0.08em] sm:px-2 sm:text-[9px] sm:tracking-[0.14em] md:px-2.5 md:text-[10px] md:tracking-[0.22em]"
          >
            CLOSED
          </RetroBadge>
        }
      />
    </div>
  )
}

export default BlogSummary
