import { Grid } from "@radix-ui/themes"
import React from "react"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"

interface Props {
  total: number
}

const PostSummary = ({ total }: Props) => {
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5" className="mt-4 md:mt-8">
      <div className="grid gap-5">
        <BlogSummary total={total} />
        <BlogChart open={total} inProgress={0} closed={0} />
      </div>
      <LatestBlogs />
    </Grid>
  )
}

export default PostSummary
