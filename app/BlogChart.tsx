"use client"
import dynamic from "next/dynamic"
import React, { Suspense } from "react"
import { Card } from "@radix-ui/themes"
import { useTranslations } from "next-intl"

// 动态导入图表组件（SSR 禁用）
const Chart = dynamic(() => import("@/app/components/ChartInner"), {
  ssr: false,
  loading: () => (
    <Card className="section-shell p-4 sm:p-5">
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    </Card>
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
        <Card className="section-shell p-4 sm:p-5">
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            {t("loadingMore")}
          </div>
        </Card>
      }
    >
      <Chart {...props} />
    </Suspense>
  )
}

export default BlogChart
