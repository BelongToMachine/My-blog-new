"use client"

import { IssueStatusBadge } from "@/app/components"
import styles from "@/app/blogs/[id]/post.module.css"
import { Issue } from "@prisma/client"
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import matter from "gray-matter"
import MarkdownIt from "markdown-it"
import { v4 as uuidv4 } from "uuid"
import { useState, useEffect, useRef } from "react"
import TableOfContent from "../_components/TableOfContent"
import LikeAndDislike from "./LikeAndDislike"
import Image from "next/image"
import fan from "@/public/images/fan.png"
import { toggleLike } from "@/app/actions/blogAction"
import HoverWrapper from "../_components/HoverWrapper"
import BlogParser from "@/app/service/BlogParser"

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const parser = new BlogParser(issue.description)
  const { header, htmlContent, headings } = parser.getParserdContent()
  const [tocPosition, setTocPosition] = useState<React.CSSProperties>({
    display: "none",
    position: "fixed",
  })
  const [likes, setLikes] = useState<number>(issue.likes)
  const mainContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateTocPosition = () => {
      if (mainContentRef.current) {
        const mainContentRect = mainContentRef.current.getBoundingClientRect()

        if (window.innerWidth >= 1048) {
          setTocPosition({
            position: "fixed",
            top: `10vh`,
            left: `calc(${mainContentRect.right}px + 20px)`,
          })
        } else {
          setTocPosition({})
        }
      }
    }

    // Initial positioning
    updateTocPosition()

    // Reposition on window resize
    window.addEventListener("resize", updateTocPosition)
    return () => window.removeEventListener("resize", updateTocPosition)
  }, [])

  const { data, content } = matter(issue.description)

  const updateLikes = async () => {
    try {
      const updatedBlog = await toggleLike({
        blogId: issue.id,
        action: "like",
      })
      setLikes(updatedBlog!.likes)
    } catch (e) {
      console.error("Cannot update like" + e)
    }
  }

  return (
    <Flex
      className="w-full p-6 relative"
      style={{ gap: "1rem" }}
      direction={{ initial: "column", md: "row" }}
    >
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
    </Flex>
  )
}

export default IssueDetails
