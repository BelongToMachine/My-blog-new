"use client"
import { Status } from "@prisma/client"
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
    <label className="font-pixel inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      <span>{t("filterPlaceholder")}</span>
      <select
        className="retro-select"
        defaultValue={searchParams.get("status") || "unSelected"}
        onChange={(event) => {
          const status = event.target.value
          initailizeStatus(status)
          const query: string = buildQuery(status, searchParams)
          router.push(`/blogs${query}`)
        }}
      >
        {statuses.map((status, index) => (
          <option key={index} value={status.value || "unSelected"}>
            {status.label}
          </option>
        ))}
      </select>
    </label>
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
  if (selectStatus && selectStatus !== "unSelected") params.append("status", selectStatus)
  if (searchParams.get("orderBy"))
    params.append("orderBy", searchParams.get("orderBy")!)
  return params.size ? "?" + params.toString() : ""
}

export default BlogStatusFilter
