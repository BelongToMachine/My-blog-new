import { Flex, Grid } from "@radix-ui/themes"
import React, { CSSProperties, useMemo } from "react"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"

export interface PostCssProperties extends CSSProperties {
  chartText: string
  link: string
}

interface Props {
  web: number
  tech: number
  nonTech: number
}

const PostSummary = ({ web, tech, nonTech }: Props) => {
  const style = useMemo(
    (): PostCssProperties => ({
      // background: "var(--background-color)",
      color: "var(--text-color)",
      borderColor: "var(--border-color)",
      background: "var(--card-background-color)",
      chartText: "var(--chart-text-color)",
      link: "var(--chart-link-color)",
    }),
    []
  )

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5" mt="8">
      <Flex direction="column" gap="5">
        <BlogSummary
          open={web}
          inProgress={tech}
          closed={nonTech}
          style={style}
        />
        <BlogChart
          open={web}
          inProgress={tech}
          closed={nonTech}
          style={style}
        />
      </Flex>
      <LatestBlogs style={style} />
    </Grid>
  )
}

export default PostSummary
