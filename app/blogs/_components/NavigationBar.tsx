import { Box } from "@radix-ui/themes"
import React from "react"
import { Issue } from "@prisma/client"
import TableOfContent from "./TableOfContent"
import BlogParser, { Heading } from "@/app/service/BlogParser"
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
    <Box
      className="w-full max-w-sm rounded-lg mt-6"
      style={{
        ...tocPosition,
        width: "100%",
        height: "85vh",
      }}
    >
      <TableOfContent headings={headings} />
      <LikeDislike issue={issue} />
    </Box>
  )
}

export default NavigationBar
