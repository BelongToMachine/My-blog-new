"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { ErrorMessage } from "@/app/components"
import { MODE } from "@/app/envConfig"

const IssueForm = dynamic(() => import("@/app/blogs/_components/IssueForm"), {
  ssr: false,
})

export default function NewBlogPage() {
  const t = useTranslations("blogs")

  return MODE === "dev" ? (
    <IssueForm />
  ) : (
    <ErrorMessage>{t("newDisabled")}</ErrorMessage>
  )
}
