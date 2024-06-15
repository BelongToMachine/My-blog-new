import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

interface Props {
  status: Status;
}

const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" | "yellow" | "blue" }
> = {
  FINISHED: { label: "Web开发", color: "blue" },
  IN_PROGRESS: { label: "科技类", color: "violet" },
  CLOSED: { label: "非技术类", color: "green" },
};

const IssueStatusBadge = ({ status }: Props) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default IssueStatusBadge;
