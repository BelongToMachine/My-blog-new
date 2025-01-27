import { IssueStatusBadge } from "@/app/components"
import { Issue } from "@prisma/client"
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes"
import React, { useEffect, useRef } from "react"
import styles from "@/app/blogs/[id]/post.module.css"
import { ArticleHeader } from "@/app/service/BlogParser"

interface Props {
  issue: Issue
  header: ArticleHeader
  htmlContent: string
}

export const BlogContent = ({ issue, header, htmlContent }: Props) => {
  const mainContentRef = useRef<HTMLDivElement>(null)

  return (
    <Box
      ref={mainContentRef}
      className="flex-grow max-w-3xl bg-white rounded-lg shadow-lg p-6"
    >
      <Heading className="text-2xl font-bold">{issue.title}</Heading>
      <Flex className="space-x-4 mt-2 text-gray-600 text-sm" align="center">
        <IssueStatusBadge status={issue?.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-none mt-4">
        <article className={styles.article}>
          <h1>{header.title}</h1>
          <p className="post-meta">{header.date}</p>
          <div
            id="post-content"
            className="post-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </Card>
    </Box>
  )
}
