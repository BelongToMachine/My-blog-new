"use client"
import { Status } from "@prisma/client"
import { Select, Theme } from "@radix-ui/themes"
import React from "react"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useRouter } from "@/app/i18n/navigation"

const BlogStatusFilter = () => {
  const t = useTranslations("blogs")
  const router = useRouter()

  const searchParams = useSearchParams()
  const statuses: { label: string; value?: Status }[] = [
    { label: t("filterAll") },
    { label: t("webDev"), value: "FINISHED" },
    { label: t("tech"), value: "IN_PROGRESS" },
    { label: t("nonTech"), value: "CLOSED" },
  ]

  return (
    <Theme radius="none">
      <Select.Root
        defaultValue={searchParams.get("status") || ""}
        onValueChange={(status) => {
          initailizeStatus(status)
          const query: string = buildQuery(status, searchParams)
          router.push(`/blogs${query}`)
        }}
      >
        <Select.Trigger
          placeholder={t("filterPlaceholder")}
          className="!rounded-[0.45rem] !border-border/70 !bg-background/85 px-4"
        />
        <Select.Content className="!rounded-[0.45rem] !border-border/70">
          {statuses.map((status, index) => (
            <Select.Item key={index} value={status.value || "unSelected"}>
              {status.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Theme>
  )
}

const initailizeStatus = (selectStatus: string): void => {
  selectStatus === "unSelected" ? "" : selectStatus
}

const buildQuery = (
  selectStatus: string,
  searchParams: ReadonlyURLSearchParams
) => {
  const params = new URLSearchParams()
  if (selectStatus) params.append("status", selectStatus)
  if (searchParams.get("orderBy"))
    params.append("orderBy", searchParams.get("orderBy")!)
  return params.size ? "?" + params.toString() : ""
}

export default BlogStatusFilter
