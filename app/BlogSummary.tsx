import { Status } from "@prisma/client"
import { Card, Flex, Text } from "@radix-ui/themes"
import classNames from "classnames"
import Link from "next/link"
import React, { CSSProperties } from "react"
import { PostCssProperties } from "./PostSummary"

interface Props {
  open: number
  inProgress: number
  closed: number
  style: PostCssProperties
}

const BlogSummary = ({ open, inProgress, closed, style }: Props) => {
  const categoryData: {
    label: string
    value: number
    status: Status
  }[] = [
    { label: "Web开发", value: open, status: "FINISHED" },
    { label: "科技类", value: inProgress, status: "IN_PROGRESS" },
    { label: "非技术类", value: closed, status: "CLOSED" },
  ]

  return (
    <Flex gap="4">
      {categoryData.map((container) => (
        <Card key={container.label} style={style}>
          <Flex direction="column" gap="1">
            <Link
              className="text-sm font-medium"
              href={`blogs?status=${container.status}`}
            >
              {container.label}
            </Link>
          </Flex>
          <Text size="5" className="font-bold">
            {container.value}
          </Text>
        </Card>
      ))}
    </Flex>
  )
}

export default BlogSummary
