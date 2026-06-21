"use client"
import React, { useEffect, useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTranslations } from "next-intl"
import { BREAKPOINTS, isTabletViewport } from "@/app/lib/responsive"

interface Props {
  open: number
  inProgress: number
  closed: number
  typography?: "retro" | "plain"
}

const PixelXTick = ({
  x = 0,
  y = 0,
  payload,
  fontSize = 11,
  dy = 16,
  typography = "retro",
}: {
  x?: number
  y?: number
  payload?: { value?: string }
  fontSize?: number
  dy?: number
  typography?: "retro" | "plain"
}) => (
  <text
    x={x}
    y={y}
    dy={dy}
    textAnchor="middle"
    fill="hsl(var(--muted-foreground))"
    style={{
      fontFamily:
        typography === "plain"
          ? "var(--font-sans), sans-serif"
          : "var(--font-pixel), monospace",
      fontSize,
      textTransform: typography === "retro" ? "uppercase" : undefined,
      letterSpacing: typography === "retro" ? "0.05em" : "0.01em",
      fontWeight: typography === "plain" ? 500 : undefined,
    }}
  >
    {payload?.value}
  </text>
)

const PixelYTick = ({
  x = 0,
  y = 0,
  payload,
  dx = -10,
  fontSize = 11,
  typography = "retro",
}: {
  x?: number
  y?: number
  payload?: { value?: string | number }
  dx?: number
  fontSize?: number
  typography?: "retro" | "plain"
}) => (
  <text
    x={x}
    y={y}
    dx={dx}
    textAnchor="end"
    fill="hsl(var(--muted-foreground))"
    style={{
      fontFamily:
        typography === "plain"
          ? "var(--font-sans), sans-serif"
          : "var(--font-pixel), monospace",
      fontSize,
      textTransform: typography === "retro" ? "uppercase" : undefined,
      letterSpacing: typography === "retro" ? "0.05em" : "0.01em",
      fontWeight: typography === "plain" ? 500 : undefined,
    }}
  >
    {payload?.value}
  </text>
)

const PixelBarShape = (props: any) => {
  const { x, y, width, height, fill } = props
  return (
    <g>
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

const PixelTooltip = ({
  active,
  payload,
  label,
  typography = "retro",
}: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: "hsl(var(--card))",
        border: "2px solid hsl(var(--border))",
        color: "hsl(var(--card-foreground))",
        padding: "6px 10px",
        fontFamily:
          typography === "plain"
            ? "var(--font-sans), sans-serif"
            : "var(--font-pixel), monospace",
        fontSize: 11,
        letterSpacing: typography === "retro" ? "0.05em" : "0.01em",
        textTransform: typography === "retro" ? "uppercase" : undefined,
        fontWeight: typography === "plain" ? 500 : undefined,
        lineHeight: 1.5,
      }}
    >
      <div>{label}</div>
      <div style={{ color: "hsl(var(--primary))" }}>{payload[0].value}</div>
    </div>
  )
}

const ChartInner = ({
  open,
  inProgress,
  closed,
  typography = "retro",
}: Props) => {
  const t = useTranslations("home")
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? BREAKPOINTS.desktop : window.innerWidth
  )

  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth)
    }

    updateViewportWidth()
    window.addEventListener("resize", updateViewportWidth)

    return () => {
      window.removeEventListener("resize", updateViewportWidth)
    }
  }, [])

  const isMobileViewport = viewportWidth < BREAKPOINTS.tablet
  const isTabletOnlyViewport = isTabletViewport(viewportWidth)

  const chartHeight = isMobileViewport ? 228 : isTabletOnlyViewport ? 280 : 300
  const barSize = isMobileViewport ? 30 : isTabletOnlyViewport ? 38 : 48
  const xTickFontSize = isMobileViewport ? 8 : isTabletOnlyViewport ? 10 : 11
  const xTickDy = isMobileViewport ? 12 : 16
  const yTickFontSize = isMobileViewport ? 9 : 11
  const yTickDx = isMobileViewport ? -6 : -10
  const yAxisWidth = isMobileViewport ? 24 : 32
  const chartMargin = isMobileViewport
    ? { top: 18, right: 10, left: 2, bottom: 6 }
    : isTabletOnlyViewport
      ? { top: 18, right: 20, left: 8, bottom: 6 }
      : { top: 20, right: 30, left: 20, bottom: 5 }

  const data = [
    {
      label: isMobileViewport ? t("webDevShort") : t("webDev"),
      value: open,
    },
    {
      label: isMobileViewport ? t("aiShort") : t("ai"),
      value: inProgress,
    },
    {
      label: isMobileViewport ? t("nonTechShort") : t("nonTech"),
      value: closed,
    },
  ]

  return (
    <div className="pixel-panel !shadow-none panel-grid flex min-w-0 flex-1 flex-col overflow-hidden border border-border/80 bg-card/88 p-3 sm:p-4 md:p-5">
      <div className="pixel-chart flex h-full w-full items-center justify-center">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={chartMargin}
          >
            <XAxis
              dataKey="label"
              tick={
                <PixelXTick
                  fontSize={xTickFontSize}
                  dy={xTickDy}
                  typography={typography}
                />
              }
              height={isMobileViewport ? 40 : 34}
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
              tick={
                <PixelYTick
                  dx={yTickDx}
                  fontSize={yTickFontSize}
                  typography={typography}
                />
              }
              width={yAxisWidth}
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
              content={<PixelTooltip typography={typography} />}
            />
            <Bar
              dataKey="value"
              barSize={barSize}
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
    </div>
  )
}

export default ChartInner
