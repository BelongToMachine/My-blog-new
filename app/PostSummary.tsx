import { Grid } from "@radix-ui/themes"
import React from "react"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"
interface Props {
  web: number
  tech: number
  nonTech: number
}

const PostSummary = ({ web, tech, nonTech }: Props) => {
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5" className="mt-4 md:mt-8">
      <div className="grid gap-5">
        <BlogSummary open={web} inProgress={tech} closed={nonTech} />
        <BlogChart open={web} inProgress={tech} closed={nonTech} />
      </div>
      <LatestBlogs />
    </Grid>
  )
}

export default PostSummary
