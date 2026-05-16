import React from "react"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"

interface Props {
  total: number
  webDev: number
  ai: number
  nonTech: number
}

const PostSummary = ({ total, webDev, ai, nonTech }: Props) => {
  return (
    <div className="mt-4 flex flex-col gap-4 md:mt-8 md:gap-5 lg:flex-row lg:items-stretch">
      <div className="flex min-w-0 flex-col gap-5 lg:flex-[0.92]">
        <BlogSummary total={total} webDev={webDev} ai={ai} nonTech={nonTech} />
        <BlogChart open={webDev} inProgress={ai} closed={nonTech} />
      </div>
      <div className="flex min-w-0 lg:flex-[1.08]">
        <LatestBlogs />
      </div>
    </div>
  )
}

export default PostSummary
