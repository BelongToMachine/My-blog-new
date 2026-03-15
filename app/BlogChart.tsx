"use client"
import dynamic from "next/dynamic"
import React, { Suspense } from "react"
import { Card } from "@radix-ui/themes"
import style from "@/app/service/ThemeService"
import { useTranslations } from "next-intl"

// 动态导入图表组件（SSR 禁用）
const Chart = dynamic(() => import("@/app/components/ChartInner"), {
  ssr: false,
  loading: () => (
    <Card style={{ ...style, background: style.cardBackground }}>
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
        <Card style={{ ...style, background: style.cardBackground }}>
          <div
            style={{
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
