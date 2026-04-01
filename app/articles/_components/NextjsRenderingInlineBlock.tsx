"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import styles from "./nextjs-rendering-inline.module.css"

type StrategyId = "csr" | "ssr" | "ssg" | "isr" | "island" | "streaming" | "resumability"
type PipelineMode = "csr" | "ssr"
type BoundaryMode = "server" | "client"
type FreshnessMode = "ssg" | "isr" | "ssr"

interface NextjsRenderingInlineBlockProps {
  slug: string
  sectionKey: string
  headingText?: string
}

interface StrategySummary {
  id: StrategyId
  label: string
  short: string
  speed: number
  seo: number
  freshness: number
  hydration: string
  summary: string
}

const strategySummaries: StrategySummary[] = [
  {
    id: "csr",
    label: "CSR",
    short: "客户端渲染",
    speed: 42,
    seo: 36,
    freshness: 92,
    hydration: "整页接管",
    summary: "JS bundle 先下载再执行，交互自由，但白屏和 SEO 压力最大。",
  },
  {
    id: "ssr",
    label: "SSR",
    short: "服务端渲染",
    speed: 76,
    seo: 88,
    freshness: 82,
    hydration: "先看内容再接管",
    summary: "服务端先输出 HTML，首屏更稳，更适合内容型与营销型页面。",
  },
  {
    id: "ssg",
    label: "SSG",
    short: "静态生成",
    speed: 93,
    seo: 91,
    freshness: 28,
    hydration: "可选",
    summary: "构建时一次做好页面，访问快，但内容变化需要重新构建。",
  },
  {
    id: "isr",
    label: "ISR",
    short: "增量静态生成",
    speed: 86,
    seo: 90,
    freshness: 74,
    hydration: "可选",
    summary: "保留静态页面速度，同时允许页面在合适时机自动更新。",
  },
  {
    id: "island",
    label: "Island",
    short: "群岛渲染",
    speed: 84,
    seo: 89,
    freshness: 76,
    hydration: "局部水合",
    summary: "只给真正需要交互的区域加载 JS，适合内容占主导的页面。",
  },
  {
    id: "streaming",
    label: "Streaming",
    short: "流式传输",
    speed: 81,
    seo: 87,
    freshness: 86,
    hydration: "分片水合",
    summary: "把页面拆开分批送到浏览器，减少整页等待和冻结感。",
  },
  {
    id: "resumability",
    label: "Resumability",
    short: "恢复式执行",
    speed: 95,
    seo: 89,
    freshness: 90,
    hydration: "尽量绕开",
    summary: "把逻辑切得更细，真正交互时再恢复，不先做完整 hydration。",
  },
]

const pipelineCopy: Record<
  PipelineMode,
  {
    title: string
    summary: string
    costLabel: string
    phases: Array<{ label: string; detail: string }>
  }
> = {
  csr: {
    title: "CSR 的瓶颈主要发生在浏览器",
    summary: "先拿空壳，再等 bundle，最后浏览器自己拼出内容和交互。",
    costLabel: "白屏风险高，SEO 弱",
    phases: [
      { label: "返回 HTML 壳", detail: "有页面结构，但几乎没有真正内容。" },
      { label: "下载大体积 JS", detail: "框架、路由、请求逻辑一起送到客户端。" },
      { label: "解析与执行", detail: "浏览器要先理解代码，才能真正画出页面。" },
      { label: "再请求数据", detail: "数据和 UI 组合都在浏览器里继续完成。" },
    ],
  },
  ssr: {
    title: "SSR 把首次内容生成提前到了服务端",
    summary: "用户先看到结果，再由较小脚本接管交互，首屏稳定很多。",
    costLabel: "服务端压力更高，但体验更均衡",
    phases: [
      { label: "服务端拉数据", detail: "在返回前就把页面所需的数据准备好。" },
      { label: "直接输出 HTML", detail: "浏览器到手就是可阅读内容，不是空壳。" },
      { label: "下载较小脚本", detail: "客户端只负责接管交互，而不是整个首屏构建。" },
      { label: "完成 hydration", detail: "页面从可读过渡到可交互，成本比 CSR 低得多。" },
    ],
  },
}

const boundaryScenarios = [
  {
    title: "直接查数据库",
    server: "适合 Server Component。数据不必下放到浏览器，也更利于保护敏感逻辑。",
    client: "不适合 Client Component。你通常要经过 API，再把结果带到浏览器。",
  },
  {
    title: "按钮点击与表单交互",
    server: "不适合纯 Server Component。它没有浏览器事件监听能力。",
    client: "适合 Client Component。事件、状态、浏览器 API 都在这里完成。",
  },
  {
    title: "首屏内容展示",
    server: "优先考虑 Server Component。对首屏、SEO 和数据获取都更友好。",
    client: "只在需要复杂交互时再下沉到 Client Component。",
  },
  {
    title: "窗口尺寸监听",
    server: "不适合。服务端没有 `window`，也没有真实浏览器环境。",
    client: "适合。浏览器环境相关逻辑都该放在客户端组件。",
  },
]

const freshnessModes = {
  ssg: {
    label: "SSG",
    caption: "构建时生成",
    freshness: "内容一旦变化，需要重新部署。",
    runtime: "线上几乎不做额外渲染，成本最低。",
  },
  isr: {
    label: "ISR",
    caption: "按规则增量更新",
    freshness: "内容可以在过期或触发后自动换成新版本。",
    runtime: "比 SSG 多一些缓存与再生成策略，但依然接近静态速度。",
  },
  ssr: {
    label: "SSR",
    caption: "每次请求实时生成",
    freshness: "每次都拿到最新内容。",
    runtime: "服务端计算成本最高，也最依赖服务能力。",
  },
} satisfies Record<FreshnessMode, { label: string; caption: string; freshness: string; runtime: string }>

const hydrationContinuum = [
  {
    label: "传统 Hydration",
    note: "整页接管",
    detail: "浏览器要把整棵组件树重新连上交互，最容易出现‘页面看到了但还不能用’。",
  },
  {
    label: "Island",
    note: "局部水合",
    detail: "只在评论区、搜索框、筛选器这些需要互动的区域加载脚本。",
  },
  {
    label: "Streaming SSR",
    note: "分片送达",
    detail: "组件按边界逐步到达，不必整页等齐，也能减少冻结感。",
  },
  {
    label: "Resumability",
    note: "尽量绕开水合",
    detail: "真正发生交互时再恢复那一小块逻辑，把启动成本进一步切碎。",
  },
]

function metricWidth(value: number) {
  return `${Math.max(10, Math.min(100, value))}%`
}

function OverviewBlock() {
  const [activeId, setActiveId] = useState<StrategyId>("ssr")
  const active = useMemo(
    () => strategySummaries.find((item) => item.id === activeId) ?? strategySummaries[0],
    [activeId]
  )

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.eyebrow}>Reading Companion</div>
        <h3 className={styles.panelTitle}>先建立整篇文章的地图，再回到每一节读细节。</h3>
        <p className={styles.panelLead}>
          你这篇文章其实是在讲一件事: 页面到底是在哪里生成、什么时候变得可交互、以及内容更新要付出什么代价。这里先把这三个维度立起来。
        </p>
      </div>

      <div className={styles.tabRow}>
        {strategySummaries.map((strategy) => (
          <button
            key={strategy.id}
            type="button"
            className={`${styles.pill} ${strategy.id === activeId ? styles.pillActive : ""}`}
            onClick={() => setActiveId(strategy.id)}
          >
            <span>{strategy.label}</span>
            <small>{strategy.short}</small>
          </button>
        ))}
      </div>

      <div className={styles.overviewLayout}>
        <div className={styles.scoreGrid}>
          {strategySummaries.map((strategy) => (
            <button
              key={strategy.id}
              type="button"
              className={`${styles.scoreCard} ${strategy.id === activeId ? styles.scoreCardActive : ""}`}
              onClick={() => setActiveId(strategy.id)}
            >
              <div className={styles.scoreCardTop}>
                <strong>{strategy.label}</strong>
                <span>{strategy.short}</span>
              </div>
              <p>{strategy.summary}</p>
              <div className={styles.metricStack}>
                <div>
                  <div className={styles.metricLabel}>
                    <span>首屏</span>
                    <span>{strategy.speed}</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div className={styles.metricFill} style={{ width: metricWidth(strategy.speed) }} />
                  </div>
                </div>
                <div>
                  <div className={styles.metricLabel}>
                    <span>SEO</span>
                    <span>{strategy.seo}</span>
                  </div>
                  <div className={styles.metricTrack}>
                    <div className={styles.metricFillAlt} style={{ width: metricWidth(strategy.seo) }} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className={styles.spotlight}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <div className={styles.spotlightLabel}>当前聚焦</div>
            <h4>
              {active.label} · {active.short}
            </h4>
            <p>{active.summary}</p>
            <dl className={styles.definitionList}>
              <div>
                <dt>交互接管方式</dt>
                <dd>{active.hydration}</dd>
              </div>
              <div>
                <dt>内容新鲜度</dt>
                <dd>{active.freshness}/100</dd>
              </div>
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function PipelineBlock() {
  const [mode, setMode] = useState<PipelineMode>("csr")
  const current = pipelineCopy[mode]

  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>Section Focus</div>
          <h3 className={styles.inlineTitle}>把你在文中对 CSR 与 SSR 的描述，转成一条可以切换的加载时间线。</h3>
        </div>
        <div className={styles.segmented}>
          {(["csr", "ssr"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.segmentedButton} ${item === mode ? styles.segmentedButtonActive : ""}`}
              onClick={() => setMode(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.pipelineMeta}>
        <div>
          <strong>{current.title}</strong>
          <p>{current.summary}</p>
        </div>
        <span className={styles.calloutTag}>{current.costLabel}</span>
      </div>

      <div className={styles.timeline}>
        {current.phases.map((phase, index) => (
          <div key={`${mode}-${phase.label}`} className={styles.timelineStep}>
            <span className={styles.stepIndex}>{index + 1}</span>
            <div>
              <strong>{phase.label}</strong>
              <p>{phase.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function BoundaryBlock() {
  const [mode, setMode] = useState<BoundaryMode>("server")

  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>Boundary Guide</div>
          <h3 className={styles.inlineTitle}>这一节最容易让读者混乱的点，是“到底哪些逻辑该放 server，哪些该放 client”。</h3>
        </div>
        <div className={styles.segmented}>
          {(["server", "client"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.segmentedButton} ${item === mode ? styles.segmentedButtonActive : ""}`}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.scenarioGrid}>
        {boundaryScenarios.map((scenario) => (
          <div key={scenario.title} className={styles.scenarioCard}>
            <h4>{scenario.title}</h4>
            <p>{mode === "server" ? scenario.server : scenario.client}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FreshnessBlock() {
  const [mode, setMode] = useState<FreshnessMode>("isr")
  const current = freshnessModes[mode]

  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>Freshness Dial</div>
          <h3 className={styles.inlineTitle}>SSG、ISR、SSR 真正的差别，不只是“快不快”，而是“内容多久变一次，以及谁来承担刷新成本”。</h3>
        </div>
      </div>

      <div className={styles.tabRow}>
        {(["ssg", "isr", "ssr"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles.pill} ${item === mode ? styles.pillActive : ""}`}
            onClick={() => setMode(item)}
          >
            <span>{freshnessModes[item].label}</span>
            <small>{freshnessModes[item].caption}</small>
          </button>
        ))}
      </div>

      <div className={styles.dualPanel}>
        <div className={styles.noteCard}>
          <div className={styles.noteLabel}>内容更新方式</div>
          <p>{current.freshness}</p>
        </div>
        <div className={styles.noteCard}>
          <div className={styles.noteLabel}>运行时成本</div>
          <p>{current.runtime}</p>
        </div>
      </div>
    </section>
  )
}

function HydrationBlock() {
  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>Hydration Evolution</div>
          <h3 className={styles.inlineTitle}>你后半篇其实一直在围绕同一个目标演进: 少等一点 hydration，少冻住一点页面。</h3>
        </div>
      </div>

      <div className={styles.continuum}>
        {hydrationContinuum.map((item, index) => (
          <div key={item.label} className={styles.continuumCard}>
            <span className={styles.continuumIndex}>0{index + 1}</span>
            <strong>{item.label}</strong>
            <small>{item.note}</small>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SsrHydrationBlock() {
  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>Hydration Snapshot</div>
          <h3 className={styles.inlineTitle}>这一节的重点不是“服务端渲染”四个字，而是“先有内容，再补交互”的两段式体验。</h3>
        </div>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineStep}>
          <span className={styles.stepIndex}>1</span>
          <div>
            <strong>用户先看到完整页面</strong>
            <p>浏览器拿到的已经不是空壳，而是带内容的 HTML，所以体感会比 CSR 稳得多。</p>
          </div>
        </div>
        <div className={styles.timelineStep}>
          <span className={styles.stepIndex}>2</span>
          <div>
            <strong>再加载较小脚本完成接管</strong>
            <p>交互能力稍后再补上，代价是你仍然需要 hydration，只是压力比整页 CSR 小很多。</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function NextjsRenderingInlineBlock({
  slug,
  sectionKey,
  headingText,
}: NextjsRenderingInlineBlockProps) {
  if (slug !== "nextjs-rendering-patterns") {
    return null
  }

  if (sectionKey === "intro") {
    return <OverviewBlock />
  }

  if (headingText?.includes("CSR")) {
    return <PipelineBlock />
  }

  if (headingText?.includes("带水合的SSR")) {
    return <SsrHydrationBlock />
  }

  if (headingText?.includes("完全的SSR") || headingText?.includes("Server component")) {
    return <BoundaryBlock />
  }

  if (headingText?.includes("增量静态生成ISR")) {
    return <FreshnessBlock />
  }

  if (headingText?.includes("9.Resumablity")) {
    return <HydrationBlock />
  }

  return null
}
