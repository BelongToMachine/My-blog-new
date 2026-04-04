"use client"
import { Card } from "@radix-ui/themes"
import React, { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useTranslations } from "next-intl"

interface Props {
  open: number
  inProgress: number
  closed: number
}

const BlogChart = ({ open, inProgress, closed }: Props) => {
  const t = useTranslations("home")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const data = [
    { label: t("webDev"), value: open },
    { label: t("tech"), value: inProgress },
    { label: t("nonTech"), value: closed },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <Card className="section-shell p-4 sm:p-5">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <Bar dataKey="value" barSize={60} fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default BlogChart
