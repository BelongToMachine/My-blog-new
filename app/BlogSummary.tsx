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
    <div className="flex min-w-0 flex-row gap-1.5 sm:gap-2 md:gap-4">
      <RetroStatCard
        className="min-h-[7.5rem] min-w-0 basis-0 flex-1 px-2 py-3 sm:min-h-[8rem] sm:px-3 sm:py-4 md:min-h-[9rem] md:px-4 md:py-5"
        label={t("webDev")}
        value={total}
        hint={
          <RetroBadge
            tone="primary"
            className="mt-1 max-w-full justify-center px-1 text-[7px] tracking-[0.04em] sm:px-1.5 sm:text-[8px] sm:tracking-[0.08em] md:px-2.5 md:text-[10px] md:tracking-[0.22em]"
          >
            ARTICLES
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="min-h-[7.5rem] min-w-0 basis-0 flex-1 px-2 py-3 sm:min-h-[8rem] sm:px-3 sm:py-4 md:min-h-[9rem] md:px-4 md:py-5"
        label={t("tech")}
        value={0}
        hint={
          <RetroBadge
            tone="amber"
            className="mt-1 max-w-full justify-center px-1 text-[7px] tracking-[0.04em] sm:px-1.5 sm:text-[8px] sm:tracking-[0.08em] md:px-2.5 md:text-[10px] md:tracking-[0.22em]"
          >
            WIP
          </RetroBadge>
        }
      />
      <RetroStatCard
        className="min-h-[7.5rem] min-w-0 basis-0 flex-1 px-2 py-3 sm:min-h-[8rem] sm:px-3 sm:py-4 md:min-h-[9rem] md:px-4 md:py-5"
        label={t("nonTech")}
        value={0}
        hint={
          <RetroBadge
            tone="neutral"
            className="mt-1 max-w-full justify-center px-1 text-[7px] tracking-[0.04em] sm:px-1.5 sm:text-[8px] sm:tracking-[0.08em] md:px-2.5 md:text-[10px] md:tracking-[0.22em]"
          >
            CLOSED
          </RetroBadge>
        }
      />
    </div>
  )
}

export default BlogSummary
