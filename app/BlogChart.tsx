"use client"
import dynamic from "next/dynamic"
import React, { Suspense } from "react"
import { useTranslations } from "next-intl"

const chartShellClassName =
  "pixel-panel panel-grid flex min-w-0 flex-1 flex-col overflow-hidden border border-border/80 bg-card/88 p-4 md:p-5"
const chartBodyClassName =
  "flex min-h-[260px] flex-1 items-center justify-center text-sm text-muted-foreground sm:min-h-[300px]"

// 动态导入图表组件（SSR 禁用）
const Chart = dynamic(() => import("@/app/components/ChartInner"), {
  ssr: false,
  loading: () => (
    <div className={chartShellClassName}>
      <div className={chartBodyClassName}>Loading chart...</div>
    </div>
  ),
})

interface Props {
  open: number
  inProgress: number
  closed: number
}

const BlogChart = (props: Props) => {
  const t = useTranslations("home")

  return (
    <Suspense
      fallback={
        <div className={chartShellClassName}>
          <div className={chartBodyClassName}>{t("loadingMore")}</div>
        </div>
      }
    >
      <Chart {...props} />
    </Suspense>
  )
}

export default BlogChart
