"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import styles from "./jquery-article-experience.module.css"

type DemoId = "selector" | "styling" | "event"

interface Demo {
  id: DemoId
  index: string
  label: string
  headline: string
  description: string
  noteLabel: string
  note: string
  code: string[]
  items: string[]
  activeItem?: number
  titleText: string
  badge: string
}

const demos: Demo[] = [
  {
    id: "selector",
    index: "01",
    label: "选择元素",
    headline: "先学会准确找到页面里的对象",
    description:
      "jQuery 的第一感来自选择器。你不是在操作抽象状态，而是在直面页面上的真实节点。",
    noteLabel: "Why this matters",
    note:
      "对初学者来说，选择器是最直观的入口。它把“我想操作哪个元素”这件事变成一行就能说清楚的表达。",
    code: [
      "// 用 CSS 选择器定位节点",
      'const title = $("#title")',
      'const items = $(".item")',
      "",
      "// 再决定要对它做什么",
      "title.text(...)",
    ],
    items: ["导航标题", "文章卡片", "按钮区域"],
    activeItem: 1,
    titleText: "#title / .item",
    badge: "DOM lookup",
  },
  {
    id: "styling",
    index: "02",
    label: "操作样式",
    headline: "一行代码就能让视觉状态发生变化",
    description:
      "文字、颜色、class 这些最常见的 UI 变化，在 jQuery 里都能用非常低的心智成本完成。",
    noteLabel: "Design angle",
    note:
      "对产品开发来说，这一步最接近“反馈设计”。状态变化是否清晰，往往比逻辑本身更先被用户感知。",
    code: [
      '$("#title").text("Hello jQuery")',
      '$("#title").css("color", "#2563eb")',
      '$(".item").addClass("is-active")',
      "",
      "// 把界面变化直接映射到代码",
      "renderFeedback()",
    ],
    items: ["Hello jQuery", "状态高亮", "视觉反馈"],
    activeItem: 0,
    titleText: "text / css / addClass",
    badge: "Visual state",
  },
  {
    id: "event",
    index: "03",
    label: "绑定事件",
    headline: "交互真正开始发生在用户点击之后",
    description:
      "事件绑定是页面从“静态展示”变成“有回应”的关键一步，也是很多前端交互的最小单元。",
    noteLabel: "Interaction lens",
    note:
      "你可以把事件监听理解成界面的触发器。页面不是自己变化，而是在等待用户给出动作，然后立即响应。",
    code: [
      '$("#toggle-btn").on("click", () => {',
      '  $(".card").toggleClass("card--highlight")',
      '  alert("表单已提交")',
      "})",
      "",
      "// 行为 -> 状态 -> 视觉反馈",
    ],
    items: ["点击按钮", "切换状态", "触发提示"],
    activeItem: 2,
    titleText: "on('click')",
    badge: "Interaction",
  },
]

const tokenMatcher =
  /(\/\/.*$)|(\$\(".*?"\))|(\.(?:text|css|addClass|toggleClass|on)\b)|(".*?")|(\b(?:const|return)\b)|(\b(?:alert|renderFeedback)\b)/g

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function getTokenClass(match: RegExpExecArray) {
  if (match[1]) return styles.tokenComment
  if (match[2]) return styles.tokenSelector
  if (match[3]) return styles.tokenMethod
  if (match[4]) return styles.tokenString
  if (match[5]) return styles.tokenKeyword
  if (match[6]) return styles.tokenSignal
  return ""
}

function highlightLine(line: string) {
  if (!line) {
    return "&nbsp;"
  }

  let html = ""
  let lastIndex = 0
  let match = tokenMatcher.exec(line)

  while (match) {
    const [token] = match
    const tokenClass = getTokenClass(match)

    html += escapeHtml(line.slice(lastIndex, match.index))
    html += `<span class="${tokenClass}">${escapeHtml(token)}</span>`
    lastIndex = match.index + token.length
    match = tokenMatcher.exec(line)
  }

  html += escapeHtml(line.slice(lastIndex))
  tokenMatcher.lastIndex = 0

  return html
}

export default function JQueryArticleExperience() {
  const [activeId, setActiveId] = useState<DemoId>("selector")
  const activeDemo = useMemo(
    () => demos.find((demo) => demo.id === activeId) ?? demos[0],
    [activeId]
  )

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Interactive Reading Layer</div>
        <div className={styles.headline}>把 jQuery 的三个核心动作做成可以感知的界面。</div>
        <p className={styles.subline}>
          这不是额外装饰，而是把“选择元素、改变样式、绑定事件”从文字说明转成可切换、可观察的阅读体验。对招聘方来说，它也更像一个有观点的技术展示，而不是普通文档页。
        </p>
        <div className={styles.tabRow}>
          {demos.map((demo) => {
            const isActive = demo.id === activeId

            return (
              <button
                key={demo.id}
                type="button"
                className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                onClick={() => setActiveId(demo.id)}
              >
                <span className={styles.tabIndex}>{demo.index}</span>
                <span>{demo.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.body}>
        <div className={`${styles.frame} ${styles.codeFrame}`}>
          <div className={styles.frameBar}>
            <div className={styles.frameDots}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.frameLabel}>{activeDemo.badge}</div>
          </div>
          <div className={styles.codeWrap}>
            <div className={styles.lineNumbers}>
              {activeDemo.code.map((_, index) => (
                <span key={`${activeDemo.id}-line-${index + 1}`}>{index + 1}</span>
              ))}
            </div>
            <pre className={styles.codeBlock}>
              {activeDemo.code.map((line, index) => (
                <div
                  key={`${activeDemo.id}-${index}`}
                  dangerouslySetInnerHTML={{ __html: highlightLine(line) }}
                />
              ))}
            </pre>
          </div>
          <div className={styles.copy}>
            <strong>{activeDemo.headline}</strong>
            <br />
            {activeDemo.description}
          </div>
        </div>

        <div className={styles.stage}>
          <div className={`${styles.frame} ${styles.domFrame}`}>
            <div className={styles.domViewport}>
              <div className={styles.domTitle}>Live mental model</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo.id}
                  className={styles.demoSurface}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.demoHeading}>
                    <div>
                      <strong>{activeDemo.titleText}</strong>
                    </div>
                    <span className={styles.chip}>{activeDemo.badge}</span>
                  </div>
                  <div className={styles.domCard}>
                    <ul className={styles.domList}>
                      {activeDemo.items.map((item, index) => (
                        <li
                          key={`${activeDemo.id}-item-${item}`}
                          className={index === activeDemo.activeItem ? styles.activeItem : ""}
                        >
                          <span
                            className={
                              index === activeDemo.activeItem ? styles.signalText : undefined
                            }
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.stageFooter}>
            <div className={styles.note}>
              <div className={styles.noteLabel}>{activeDemo.noteLabel}</div>
              <p>{activeDemo.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
