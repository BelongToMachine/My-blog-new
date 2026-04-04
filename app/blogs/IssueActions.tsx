import { Flex } from "@radix-ui/themes"
import React from "react"
import BlogStatusFilter from "./BlogStatusFilter"
import { MODE } from "../envConfig"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"
import BlogSectionTabs from "./BlogSectionTabs"
import { Button } from "../components/ui/button"
import { SurfaceCard } from "../components/system"

const IssueActions = () => {
  const t = useTranslations("blogs")

  return (
    <SurfaceCard tone="muted" className="space-y-4">
      <BlogSectionTabs active="database" />
      <Flex className="flex-wrap gap-3">
        {MODE === "dev" && (
          <Button asChild variant="subtle" className="rounded-full px-4">
            <LocaleLink href="/blogs/new">{t("newBlog")}</LocaleLink>
          </Button>
        )}
        <BlogStatusFilter />
      </Flex>
    </SurfaceCard>
  )
}

export default IssueActions
