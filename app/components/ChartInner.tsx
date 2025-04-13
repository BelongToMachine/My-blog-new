"use client"
import { Card } from "@radix-ui/themes"
import React, { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import style from "@/app/service/ThemeService"

interface Props {
  open: number
  inProgress: number
  closed: number
}

const BlogChart = ({ open, inProgress, closed }: Props) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const data = [
    { label: "Web开发", value: open },
    { label: "科技类", value: inProgress },
    { label: "非技术类", value: closed },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <Card style={{ ...style, background: style.cardBackground }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fill: style.chartText || "#666" }}
            axisLine={{ stroke: "#666" }}
          />
          <YAxis
            tick={{ fill: style.chartText || "#666" }}
            axisLine={{ stroke: "#666" }}
          />
          <Bar
            dataKey="value"
            barSize={60}
            fill={style.accentColor || "#3b82f6"}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default BlogChart
