import { Button, Flex } from "@radix-ui/themes"
import React from "react"
import BlogStatusFilter from "./BlogStatusFilter"
import { MODE } from "../envConfig"
import { useTranslations } from "next-intl"
import { Link as LocaleLink } from "@/app/i18n/navigation"

const IssueActions = () => {
  const t = useTranslations("blogs")

  return (
    <Flex className="space-x-3">
      {MODE === "dev" && (
        <Button>
          <LocaleLink href="/blogs/new">{t("newBlog")}</LocaleLink>
        </Button>
      )}
      <BlogStatusFilter />
    </Flex>
  )
}

export default IssueActions
