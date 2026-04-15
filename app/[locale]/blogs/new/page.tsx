"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { ErrorMessage } from "@/app/components"
import { MODE } from "@/app/envConfig"
import RetroPanel from "@/app/components/system/RetroPanel"

const IssueForm = dynamic(() => import("@/app/blogs/_components/IssueForm"), {
  ssr: false,
})

export default function NewBlogPage() {
  const t = useTranslations("blogs")

  return MODE === "dev" ? (
    <div className="p-5">
      <IssueForm />
    </div>
  ) : (
    <div className="p-5">
      <RetroPanel eyebrow="admin disabled" title="new entry blocked">
        <ErrorMessage>{t("newDisabled")}</ErrorMessage>
      </RetroPanel>
    </div>
  )
}
