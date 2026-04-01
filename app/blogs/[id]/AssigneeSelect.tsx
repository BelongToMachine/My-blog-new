"use client";
import { Issue, User } from "@prisma/client";
import { Select, Theme } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
      <Theme radius="none">
        <Select.Root
          defaultValue={issue.assignedToUserId || ""}
          onValueChange={assignIssue}
        >
          <Select.Trigger
            placeholder={t("assigneePlaceholder")}
            className="!rounded-[0.45rem] !border-border/70 !bg-background/85"
          />
          <Select.Content className="!rounded-[0.45rem] !border-border/70">
            <Select.Group>
              <Select.Label>{t("assigneeSuggestions")}</Select.Label>
              <Select.Item value="unassigned">{t("assigneeUnassigned")}</Select.Item>
              {users?.map((user) => (
                <Select.Item
                  key={user.id}
                  value={user.id}
                  className="cursor-pointer"
                >
                  {user.name}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Theme>
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
