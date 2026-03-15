import { Status } from "@prisma/client"
import { Card, Flex, Text } from "@radix-ui/themes"
import React from "react"
import { xTheme } from "./service/ThemeService"
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
    <Flex gap="4">
      {categoryData.map((container) => (
        <Card key={container.label} style={xTheme.card}>
          <Flex direction="column" gap="1">
            <LocaleLink
              className="text-sm font-medium"
              href={`/blogs?status=${container.status}`}
            >
              {container.label}
            </LocaleLink>
          </Flex>
          <Text size="5" className="font-bold">
            {container.value}
          </Text>
        </Card>
      ))}
    </Flex>
  )
}

export default BlogSummary
