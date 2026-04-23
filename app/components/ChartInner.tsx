"use client"
import { Card } from "@radix-ui/themes"
import React, { useEffect, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTranslations } from "next-intl"

interface Props {
  open: number
  inProgress: number
  closed: number
}

/* ---------- Pixel-mode custom renderers ---------- */

const PixelXTick = ({ x, y, payload }: any) => (
  <text
    x={x}
    y={y}
    dy={16}
    textAnchor="middle"
    fill="hsl(var(--muted-foreground))"
    style={{
      fontFamily: "var(--font-pixel), monospace",
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    {payload.value}
  </text>
)

const PixelYTick = ({ x, y, payload }: any) => (
  <text
    x={x}
    y={y}
    dx={-10}
    textAnchor="end"
    fill="hsl(var(--muted-foreground))"
    style={{
      fontFamily: "var(--font-pixel), monospace",
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    }}
  >
    {payload.value}
  </text>
)

const PixelBarShape = (props: any) => {
  const { x, y, width, height, fill } = props
  return (
    <g>
      {/* main block */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="hsl(var(--foreground) / 0.6)"
        strokeWidth={2}
        shapeRendering="crispEdges"
      />
      {/* top highlight for 8-bit bevel */}
      <rect
        x={x + 2}
        y={y + 2}
        width={Math.max(width - 4, 0)}
        height={2}
        fill="hsl(var(--foreground) / 0.25)"
        shapeRendering="crispEdges"
      />
    </g>
  )
}

const PixelTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: "hsl(var(--card))",
        border: "2px solid hsl(var(--border))",
        color: "hsl(var(--card-foreground))",
        padding: "6px 10px",
        fontFamily: "var(--font-pixel), monospace",
        fontSize: 11,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        lineHeight: 1.5,
      }}
    >
      <div>{label}</div>
      <div style={{ color: "hsl(var(--primary))" }}>{payload[0].value}</div>
    </div>
  )
}

/* ---------- Component ---------- */

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
    <Card className="section-shell flex items-center justify-center p-4 md:p-5">
      <div className="pixel-chart flex h-full w-full items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="label"
              tick={<PixelXTick />}
              axisLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
              }}
              tickLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
              }}
            />
            <YAxis
              tick={<PixelYTick />}
              axisLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
              }}
              tickLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: 2,
              }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
              content={<PixelTooltip />}
            />
            <Bar
              dataKey="value"
              barSize={48}
              fill="hsl(var(--primary))"
              radius={[0, 0, 0, 0]}
              shape={<PixelBarShape />}
            >
              {data.map((_, i) => (
                <Cell key={i} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default BlogChart
