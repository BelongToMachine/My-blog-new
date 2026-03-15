import { Box } from "@radix-ui/themes"
import React from "react"
import { Issue } from "@prisma/client"
import TableOfContent from "./TableOfContent"
import { Heading } from "@/app/service/BlogParser"
import LikeDislike from "./LikeDislike"

interface Props {
  tocPoisition: React.CSSProperties
  issue: Issue
  headings: Heading[]
}

const NavigationBar = ({
  tocPoisition: tocPosition,
  issue,
  headings,
}: Props) => {
  return (
    <div
      className="relative mt-6 w-full max-w-sm"
      style={{
        ...tocPosition,
        height: "85vh",
      }}
    >
      <TableOfContent headings={headings} />
      <LikeDislike issue={issue} />
    </div>
  )
}

export default NavigationBar
