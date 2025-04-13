"use client"
import dynamic from "next/dynamic"
import React from "react"

// 动态导入图表组件（SSR 禁用）
const Chart = dynamic(() => import("@/app/components/ChartInner"), {
  ssr: false,
})

interface Props {
  open: number
  inProgress: number
  closed: number
}

const BlogChart = (props: Props) => {
  return <Chart {...props} />
}

export default BlogChart
