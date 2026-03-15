import { Status } from "@prisma/client"
import React from "react"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"

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
      {categoryData.map((item, index) => (
        <LocaleLink
          key={item.label}
          href={`/blogs?status=${item.status}`}
          className="group section-shell p-5 transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="section-kicker mb-2">{`0${index + 1}`}</p>
              <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                {item.label}
              </p>
            </div>
            <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {`${item.value}`.padStart(2, "0")}
            </span>
          </div>
          <p className="text-4xl font-black tracking-[-0.06em] text-foreground sm:text-5xl">
            {item.value}
          </p>
        </LocaleLink>
      ))}
    </div>
  )
}

export default BlogSummary
