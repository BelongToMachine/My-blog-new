import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: Status;
}

const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" | "yellow" }
> = {
  FINISHED: { label: "WEB2", color: "yellow" },
  IN_PROGRESS: { label: "WEB3", color: "violet" },
  CLOSED: { label: "非技术类", color: "green" },
};

const IssueStatusBadge = ({ status }: Props) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default IssueStatusBadge;
