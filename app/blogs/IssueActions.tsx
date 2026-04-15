import React from "react"
import BlogStatusFilter from "./BlogStatusFilter"
import { MODE } from "../envConfig"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"
import BlogSectionTabs from "./BlogSectionTabs"
import { Button } from "@/app/components/ui/button"
import { RetroToolbar } from "@/app/components/system/RetroToolbar"
import { RetroBadge } from "@/app/components/system/RetroBadge"

const IssueActions = () => {
  const t = useTranslations("blogs")

  return (
    <div className="space-y-4">
      <BlogSectionTabs active="database" />
      <RetroToolbar>
        <RetroBadge tone="primary">admin workspace</RetroBadge>
        {MODE === "dev" && (
          <Button variant="outline" asChild>
            <LocaleLink href="/blogs/new">{t("newBlog")}</LocaleLink>
          </Button>
        )}
        <BlogStatusFilter />
      </RetroToolbar>
    </div>
  )
}

export default IssueActions
