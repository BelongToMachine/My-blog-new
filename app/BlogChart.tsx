"use client"
import dynamic from "next/dynamic"
import React, { Suspense } from "react"
import { useTranslations } from "next-intl"

const chartShellClassName =
  "pixel-panel !shadow-none panel-grid flex min-w-0 flex-1 flex-col overflow-hidden border border-border/80 bg-card/88 p-3 sm:p-4 md:p-5"
const chartBodyClassName =
  "flex min-h-[220px] flex-1 items-center justify-center text-sm text-muted-foreground md:min-h-[280px] lg:min-h-[300px]"

const ChartLoading = () => {
  const t = useTranslations("home")

  return (
    <div className={chartShellClassName} role="status" aria-live="polite">
      <div className={chartBodyClassName}>{t("loadingMore")}</div>
    </div>
  )
}

// 动态导入图表组件（SSR 禁用）
const Chart = dynamic(() => import("@/app/components/ChartInner"), {
  ssr: false,
  loading: () => <ChartLoading />,
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
        <div className={chartShellClassName} role="status" aria-live="polite">
          <div className={chartBodyClassName}>{t("loadingMore")}</div>
        </div>
      }
    >
      <Chart {...props} typography="plain" />
    </Suspense>
  )
}

export default BlogChart
