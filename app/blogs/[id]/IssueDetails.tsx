"use client"

import { IssueStatusBadge } from "@/app/components"
import { Issue } from "@prisma/client"
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes"
import { useState, useEffect, useRef } from "react"
import styles from "@/app/blogs/[id]/post.module.css"
import BlogParser from "@/app/service/BlogParser"
import NavigationBar from "../_components/NavigationBar"

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const parser = new BlogParser(issue.description)
  const { header, htmlContent, headings } = parser.getParserdContent()
  const [tocPosition, setTocPosition] = useState<React.CSSProperties>({
    display: "none",
    position: "fixed",
  })
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

      <NavigationBar
        headings={headings}
        tocPoisition={tocPosition}
        issue={issue}
      />
    </Flex>
  )
}

export default IssueDetails
