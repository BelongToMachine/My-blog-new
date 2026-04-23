import React from "react"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"

interface Props {
  total: number
}

const PostSummary = ({ total }: Props) => {
  return (
    <div className="mt-4 flex flex-col gap-4 md:mt-8 md:gap-5 lg:flex-row lg:items-stretch">
      <div className="flex min-w-0 flex-col gap-5 lg:flex-[0.92]">
        <BlogSummary total={total} />
        <BlogChart open={total} inProgress={0} closed={0} />
      </div>
      <div className="flex min-w-0 lg:flex-[1.08]">
        <LatestBlogs />
      </div>
    </div>
  )
}

export default PostSummary
