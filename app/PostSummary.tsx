import React from "react"
import BlogSummary from "./BlogSummary"
import BlogChart from "./BlogChart"
import LatestBlogs from "./LatestBlogs"

interface Props {
  total: number
}

const PostSummary = ({ total }: Props) => {
  return (
    <div className="mt-4 grid gap-5 md:mt-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="grid min-w-0 gap-5">
        <BlogSummary total={total} />
        <BlogChart open={total} inProgress={0} closed={0} />
      </div>
      <div className="min-w-0">
        <LatestBlogs />
      </div>
    </div>
  )
}

export default PostSummary
