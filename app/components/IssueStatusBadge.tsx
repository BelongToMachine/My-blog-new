import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  status: Status;
}

const statusMap: Record<
  Status,
  { key: Status; color: "red" | "violet" | "green" | "yellow" | "blue" }
> = {
  FINISHED: { key: "FINISHED", color: "blue" },
  IN_PROGRESS: { key: "IN_PROGRESS", color: "violet" },
  CLOSED: { key: "CLOSED", color: "green" },
};

const IssueStatusBadge = ({ status }: Props) => {
  const t = useTranslations("status");

  return (
    <Badge color={statusMap[status].color}>{t(statusMap[status].key)}</Badge>
  );
};

export default IssueStatusBadge;
