import { Status } from "@prisma/client"
import React from "react"
import { useTranslations } from "next-intl"
import { RetroBadge } from "./system/RetroBadge"

interface Props {
  status: Status
}

const statusMap: Record<
  Status,
  { key: Status; tone: "primary" | "rose" | "green" }
> = {
  FINISHED: { key: "FINISHED", tone: "primary" },
  IN_PROGRESS: { key: "IN_PROGRESS", tone: "rose" },
  CLOSED: { key: "CLOSED", tone: "green" },
}

const IssueStatusBadge = ({ status }: Props) => {
  const t = useTranslations("status")

  return (
    <RetroBadge tone={statusMap[status].tone}>{t(statusMap[status].key)}</RetroBadge>
  )
}

export default IssueStatusBadge
