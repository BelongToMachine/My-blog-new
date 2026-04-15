import { Status } from "@prisma/client"
import React from "react"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"
import { RetroBadge } from "./components/system/RetroBadge"
import { RetroStatCard } from "./components/system/RetroStatCard"

interface Props {
  open: number
  inProgress: number
  closed: number
}

const BlogSummary = ({ open, inProgress, closed }: Props) => {
  const t = useTranslations("home")
  const categoryData: {
    label: string
    value: number
    status: Status
  }[] = [
    { label: t("webDev"), value: open, status: "FINISHED" },
    { label: t("tech"), value: inProgress, status: "IN_PROGRESS" },
    { label: t("nonTech"), value: closed, status: "CLOSED" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {categoryData.map((container) => (
        <RetroStatCard
          key={container.label}
          className="min-w-[132px]"
          label={
            <LocaleLink
              className="transition-colors hover:text-primary"
              href={`/blogs?status=${container.status}`}
            >
              {container.label}
            </LocaleLink>
          }
          value={container.value}
          hint={
            <RetroBadge tone="primary" className="mt-1">
              {container.status.replaceAll("_", " ")}
            </RetroBadge>
          }
        />
      ))}
    </div>
  )
}

export default BlogSummary
