import { Status } from "@prisma/client"
import { Text } from "@radix-ui/themes"
import React from "react"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"
import { SurfaceCard } from "./components/system"

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
        <SurfaceCard key={container.label} className="space-y-2" interactive>
          <div className="space-y-1">
            <LocaleLink
              className="text-sm font-medium text-primary hover:underline"
              href={`/blogs?status=${container.status}`}
            >
              {container.label}
            </LocaleLink>
          </div>
          <Text size="5" className="font-bold text-foreground">
            {container.value}
          </Text>
        </SurfaceCard>
      ))}
    </div>
  )
}

export default BlogSummary
