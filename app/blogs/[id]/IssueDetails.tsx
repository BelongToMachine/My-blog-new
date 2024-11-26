import { IssueStatusBadge } from "@/app/components";
import { Issue, Prisma } from "@prisma/client";
import { Box, Heading, Flex, Card, Text } from "@radix-ui/themes";
import React from "react"
import MarkdownIt from "markdown-it"
import styles from "@/app/posts/post.module.css"
import matter from "gray-matter";

interface ArticleHeader {
  title: string,
  date: string,
  author: string
}

const md = new MarkdownIt()

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const { data, content } = matter(issue.description)
  const header = data as ArticleHeader
  const htmlContent = md.render(content)

  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex className="space-x-3" my="2">
        <IssueStatusBadge status={issue?.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose max-w-full">
        <article className={styles.article}>
          <h1 className="">{header.title}</h1>
          <p className="post-meta">{header.date}</p>
          <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </Card>
    </>
  );
};

export default IssueDetails;
