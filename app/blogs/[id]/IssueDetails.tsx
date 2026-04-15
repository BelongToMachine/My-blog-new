"use client"

import { IssueStatusBadge } from "@/app/components"
import { Issue } from "@prisma/client"
import { Box, Flex } from "@radix-ui/themes"
import { useState, useEffect, useRef } from "react"
import styles from "@/app/blogs/[id]/post.module.css"
import BlogParser from "@/app/service/BlogParser"
import NavigationBar from "../_components/NavigationBar"
import RetroPanel from "@/app/components/system/RetroPanel"
import { RetroBadge } from "@/app/components/system/RetroBadge"

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
      className="relative w-full p-5"
      style={{ gap: "1rem" }}
      direction={{ initial: "column", md: "row" }}
    >
      <RetroPanel ref={mainContentRef} className="max-w-3xl flex-grow" eyebrow="blog entry" title={issue.title}>
        <Flex className="mt-2 flex-wrap gap-3 text-sm text-muted-foreground" align="center">
          <IssueStatusBadge status={issue?.status} />
          <RetroBadge tone="neutral">{issue.createdAt.toDateString()}</RetroBadge>
        </Flex>
        <div className="prose max-w-none mt-4">
          <article className={styles.article}>
            {header.title ? <h1>{header.title}</h1> : null}
            {header.date ? <p className="post-meta">{header.date}</p> : null}
            <div
              id="post-content"
              className="post-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
        </div>
      </RetroPanel>

      <NavigationBar
        headings={headings}
        tocPoisition={tocPosition}
        issue={issue}
      />
    </Flex>
  )
}

export default IssueDetails
