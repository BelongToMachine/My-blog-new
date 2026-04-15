"use client";
import { Issue, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Skeleton from "react-loading-skeleton";
import toast, { Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const t = useTranslations("blogs");
  const { data: users, error, isLoading } = useUsers();

  if (error) return null;

  if (isLoading) return <Skeleton />;

  const assignIssue = async (userId: String | null) => {
    userId = userId === "unassigned" ? null : userId;
    await axios
      .patch(`/api/blogs/${issue.id}`, {
        assignedToUserId: userId || null,
      })
      .catch(() => toast.error(t("assignSaveError")));
  };

  return (
    <>
      <label className="font-pixel grid gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>{t("assigneePlaceholder")}</span>
        <select
          className="retro-select"
          defaultValue={issue.assignedToUserId || "unassigned"}
          onChange={(event) => assignIssue(event.target.value)}
        >
          <option value="unassigned">{t("assigneeUnassigned")}</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
      <Toaster />
    </>
  )
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

export default AssigneeSelect;
