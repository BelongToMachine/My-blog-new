import { IssueStatusBadge } from "@/app/components"
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import MarkdownIt from "markdown-it"
import React, { useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import styles from "@/app/blogs/[id]/post.module.css"
import { Issue } from "@prisma/client"
import TableOfContent from "./TableOfContent"
import HoverWrapper from "./HoverWrapper"
import LikeAndDislike from "../[id]/LikeAndDislike"
import matter from "gray-matter"

interface ArticleHeader {
  title: string
  date: string
  author: string
}

export interface Heading {
  text: string
  level: number
  id: string
}

interface Props {
  tocPoisition: React.CSSProperties
  issue: Issue
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const level = token.tag.slice(1)
  const content = tokens[idx + 1].content
  const id = uuidv4()

  token.attrSet("id", id)
  return `<h${level} id="${id}">${content}</h${level}>`
}

const extractHeadings = (htmlContent: string): Heading[] => {
  const headingRegex = /<h([2])\s*(?:id="([^"]*)")?[^>]*>([^<]+)<\/h\1>/g
  const headings: Heading[] = []
  let match

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const [, levelStr, existingId, text] = match
    const level = parseInt(levelStr)
    const id = existingId || `heading-${headings.length}`

    headings.push({
      text: text.trim(),
      level,
      id,
    })
  }

  return headings
}

const NavigationBar = ({ tocPoisition: tocPosition, issue }: Props) => {
  const { data, content } = matter(issue.description)
  const htmlContent = md.render(content)
  const headings = extractHeadings(htmlContent)

  return (
    <Box
      className="w-full max-w-sm rounded-lg mt-6"
      style={{
        ...tocPosition,
        width: "100%",
        height: "85vh",
      }}
    >
      <TableOfContent headings={headings} />

      <Flex className="items-center absolute bottom-0 w-full">
        <Button style={{ marginRight: "10px" }} onClick={updateLikes}>
          Likes ({likes})
        </Button>

        <HoverWrapper>
          <Button className="absolute right-24">Dislike</Button>
          <LikeAndDislike />
        </HoverWrapper>

        <Image src={fan} alt="a fan" height={130} />
      </Flex>
    </Box>
  )
}

export default NavigationBar
