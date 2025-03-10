"use client"
import { Card } from "@radix-ui/themes"
import React, { CSSProperties } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { PostCssProperties } from "./PostSummary"

interface Props {
  open: number
  inProgress: number
  closed: number
  style: PostCssProperties
}

const BlogChart = ({ open, inProgress, closed, style }: Props) => {
  const data = [
    { label: "Web开发", value: open },
    { label: "科技类", value: inProgress },
    { label: "非技术类", value: closed },
  ]

  return (
    <Card style={style}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="label" tick={{ fill: style.chartText }} />
          <YAxis tick={{ fill: style.chartText }} />
          <Bar
            dataKey="value"
            barSize={60}
            style={{ fill: "var(--accent-9)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default BlogChart
