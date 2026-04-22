"use client"
import { Card } from "@radix-ui/themes"
import React, { useEffect, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTranslations } from "next-intl"
import { useStyleModeStore } from "@/app/service/Store"

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
  const { styleMode } = useStyleModeStore()
  const isPixel = styleMode === "pixel"

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
      <div className={`flex h-full w-full items-center justify-center ${isPixel ? "pixel-chart" : ""}`}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="label"
              tick={isPixel ? <PixelXTick /> : undefined}
              axisLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: isPixel ? 2 : 1,
              }}
              tickLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: isPixel ? 2 : 1,
              }}
            />
            <YAxis
              tick={isPixel ? <PixelYTick /> : undefined}
              axisLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: isPixel ? 2 : 1,
              }}
              tickLine={{
                stroke: "hsl(var(--border))",
                strokeWidth: isPixel ? 2 : 1,
              }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.2)" }}
              content={isPixel ? <PixelTooltip /> : undefined}
              contentStyle={
                !isPixel
                  ? {
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      color: "hsl(var(--card-foreground))",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }
                  : undefined
              }
            />
            <Bar
              dataKey="value"
              barSize={isPixel ? 48 : 60}
              fill="hsl(var(--primary))"
              radius={isPixel ? [0, 0, 0, 0] : [10, 10, 0, 0]}
              shape={isPixel ? <PixelBarShape /> : undefined}
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
