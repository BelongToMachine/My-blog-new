import { Button, Flex, Link } from "@radix-ui/themes"
import React from "react"
import BlogStatusFilter from "./BlogStatusFilter"
import { MODE } from "../envConfig"

const IssueActions = () => {
  return (
    <Flex className="space-x-3">
      {MODE === "dev" && (
        <Button>
          <Link href="/blogs/new">新建博客</Link>
        </Button>
      )}
      <BlogStatusFilter />
    </Flex>
  )
}

export default IssueActions
