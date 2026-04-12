import { Flex } from "@radix-ui/themes"
import React from "react"
import BlogStatusFilter from "./BlogStatusFilter"
import { MODE } from "../envConfig"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"
import BlogSectionTabs from "./BlogSectionTabs"
import { Button } from "@/app/components/ui/button"

const IssueActions = () => {
  const t = useTranslations("blogs")

  return (
    <div className="space-y-4">
      <BlogSectionTabs active="database" />
      <Flex className="flex-wrap gap-3">
        {MODE === "dev" && (
          <Button variant="outline" asChild>
            <LocaleLink href="/blogs/new">{t("newBlog")}</LocaleLink>
          </Button>
        )}
        <BlogStatusFilter />
      </Flex>
    </div>
  )
}

export default IssueActions
