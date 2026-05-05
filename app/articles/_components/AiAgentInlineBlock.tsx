"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useLocale } from "next-intl"
import { useMemo, useState } from "react"
import styles from "./ai-agent-inline.module.css"

type PillarId = "ui" | "loop" | "tools"
type Locale = "zh" | "en"

interface AiAgentInlineBlockProps {
  slug: string
  sectionKey: string
  headingText?: string
}

interface PillarItem {
  id: PillarId
  index: string
  label: string
  short: string
  summary: string
  detail: string
}

interface LoopStep {
  title: string
  detail: string
}

interface SdkLayer {
  index: string
  label: string
  short: string
  meta: string
  detail: string
  code: string
}

interface UiCopy {
  pillarsEyebrow: string
  pillarsTitle: string
  pillarsLead: string
  spotlightLabel: string
  loopEyebrow: string
  loopTitle: string
  loopLead: string
  sdkEyebrow: string
  sdkTitle: string
  sdkLead: string
}

interface LocalizedCopy {
  pillars: PillarItem[]
  loopSteps: LoopStep[]
  sdkLayers: SdkLayer[]
  ui: UiCopy
}

const COPY: Record<Locale, LocalizedCopy> = {
  zh: {
    pillars: [
      {
        id: "ui",
        index: "01",
        label: "UI 与状态",
        short: "前端最熟的部分",
        summary: "聊天输入框、消息流、工具调用状态——都是熟悉的 React 组件。",
        detail:
          "和普通聊天应用一样，你管理消息列表、输入框、流式 token、加载态。多出来的，只是把工具调用过程也优雅地呈现给用户。",
      },
      {
        id: "loop",
        index: "02",
        label: "执行循环",
        short: "Agent 的真正大脑",
        summary: "把用户输入送给 LLM，解析意图，再决定是返回文本还是触发工具。",
        detail:
          "这一层其实是个调度器：发出请求、等待响应、判断是工具调用还是终止——然后再次循环，直到 LLM 给出最终回答。",
      },
      {
        id: "tools",
        index: "03",
        label: "工具（Function Calling）",
        short: "Agent 的双手",
        summary: "用类型签名告诉 LLM “你能做什么”，让它自己挑合适的工具。",
        detail:
          "工具就是一个个有签名的函数：天气查询、数据库读写、文件操作。LLM 看到的是函数描述与参数 schema，它来决定何时何地调用。",
      },
    ],
    loopSteps: [
      {
        title: "用户提问",
        detail: "“东京的天气怎么样？”——一句普通自然语言输入。",
      },
      {
        title: "把 Prompt + 工具列表发给 LLM",
        detail: "Prompt 不是孤立的，背后还附带了所有可用工具的签名描述。",
      },
      {
        title: "LLM 返回工具调用请求",
        detail:
          "它没直接回答，而是说：“请用 { location: 'Tokyo' } 调用 getWeather。”",
      },
      {
        title: "Agent 真正执行工具",
        detail: "前端或后端跑那个函数，拿到 22°C, Sunny 这样的真实结果。",
      },
      {
        title: "把结果再喂回 LLM",
        detail: "工具结果作为新的上下文继续追加进对话。",
      },
      {
        title: "LLM 给出最终回答",
        detail: "“东京现在 22°C，晴朗。”——一句人类易读的自然语言总结。",
      },
    ],
    sdkLayers: [
      {
        index: "01",
        label: "定义工具",
        short: "tool() + Zod schema",
        meta: "可在客户端或服务端",
        detail:
          "用 tool() 包装函数，加上 Zod 描述参数。LLM 看到的就是这份签名。",
        code: "tool({\n  description: '获取天气',\n  parameters: z.object({ location: z.string() }),\n  execute: async ({ location }) => {/* ... */}\n})",
      },
      {
        index: "02",
        label: "后端路由",
        short: "streamText() + maxSteps",
        meta: "仅服务端",
        detail:
          "把 tools 传给 streamText，maxSteps 决定 LLM 可以连续调几轮工具。",
        code: "streamText({\n  model: openai('gpt-4-turbo'),\n  messages,\n  tools: { weather: weatherTool },\n  maxSteps: 5,\n})",
      },
      {
        index: "03",
        label: "前端 UI",
        short: "useChat() 接管状态",
        meta: "仅客户端",
        detail:
          "useChat 把消息列表、输入框、提交、流式更新、工具调用全部交给你。",
        code: "const { messages, input,\n  handleInputChange,\n  handleSubmit\n} = useChat()",
      },
    ],
    ui: {
      pillarsEyebrow: "Reading Companion",
      pillarsTitle: "Agent 不是黑盒，而是三件你已经会的东西拼起来的",
      pillarsLead:
        "把 Agent 拆成 UI、循环、工具三根支柱，前端开发者会发现自己已经掌握了大半。点击下方任意一个支柱，看看它在你熟悉世界中的位置。",
      spotlightLabel: "当前聚焦",
      loopEyebrow: "Section Focus",
      loopTitle: "把执行循环展开成一条 6 步的时间线",
      loopLead:
        "Agent 比聊天机器人多出来的，就是“多走几步”——下面这 6 步是大多数工具调用的标准节奏。",
      sdkEyebrow: "Stack Layout",
      sdkTitle: "Vercel AI SDK 把 Agent 拆成清晰的三层",
      sdkLead:
        "工具定义、后端路由、前端 UI——三层各司其职，谁跑在哪里也清清楚楚。",
    },
  },
  en: {
    pillars: [
      {
        id: "ui",
        index: "01",
        label: "UI & State",
        short: "What front-enders already know",
        summary:
          "Chat input, message stream, tool-call status — all familiar React components.",
        detail:
          "Just like any chat app, you manage messages, input, streaming tokens, and loading states. The only twist is rendering tool-call progress nicely.",
      },
      {
        id: "loop",
        index: "02",
        label: "Execution Loop",
        short: "The agent's real brain",
        summary:
          "Send user input to the LLM, parse intent, then decide: return text, or trigger a tool?",
        detail:
          "This layer is essentially an orchestrator: dispatch a request, await a response, branch on tool-call vs. final answer — then loop again until the LLM is done.",
      },
      {
        id: "tools",
        index: "03",
        label: "Tools (Function Calling)",
        short: "The agent's hands",
        summary:
          "Tell the LLM what you can do via typed signatures, then let it pick the right tool.",
        detail:
          "Tools are just typed functions: weather lookup, DB read/write, file ops. The LLM sees their description and parameter schema, then decides when and where to call them.",
      },
    ],
    loopSteps: [
      {
        title: "User asks",
        detail: "\"What's the weather in Tokyo?\" — plain natural-language input.",
      },
      {
        title: "Send prompt + tool list to the LLM",
        detail:
          "The prompt never travels alone — it ships with the signatures of every available tool.",
      },
      {
        title: "LLM returns a tool-call request",
        detail:
          "Instead of answering, it says: \"Please run getWeather with { location: 'Tokyo' }.\"",
      },
      {
        title: "Agent actually runs the tool",
        detail:
          "Your front-end or backend executes the function and gets a real result like 22°C, Sunny.",
      },
      {
        title: "Feed the result back to the LLM",
        detail: "The tool's output is appended to the conversation as new context.",
      },
      {
        title: "LLM produces the final reply",
        detail:
          "\"It's 22°C and sunny in Tokyo.\" — a human-readable summary, grounded in real data.",
      },
    ],
    sdkLayers: [
      {
        index: "01",
        label: "Define Tools",
        short: "tool() + Zod schema",
        meta: "Client or server",
        detail:
          "Wrap a function with tool() and describe its parameters with Zod. That signature is what the LLM sees.",
        code: "tool({\n  description: 'Get weather',\n  parameters: z.object({ location: z.string() }),\n  execute: async ({ location }) => {/* ... */}\n})",
      },
      {
        index: "02",
        label: "Backend Route",
        short: "streamText() + maxSteps",
        meta: "Server only",
        detail:
          "Pass tools to streamText. maxSteps controls how many times the LLM can call tools in a row.",
        code: "streamText({\n  model: openai('gpt-4-turbo'),\n  messages,\n  tools: { weather: weatherTool },\n  maxSteps: 5,\n})",
      },
      {
        index: "03",
        label: "Frontend UI",
        short: "useChat() owns the state",
        meta: "Client only",
        detail:
          "useChat hands you messages, input, submit, streaming updates, and tool invocations.",
        code: "const { messages, input,\n  handleInputChange,\n  handleSubmit\n} = useChat()",
      },
    ],
    ui: {
      pillarsEyebrow: "Reading Companion",
      pillarsTitle:
        "An agent isn't a black box — it's three things you already know, stitched together.",
      pillarsLead:
        "Split an agent into UI, loop, and tools and most front-enders realise they already understand the bulk of it. Click a pillar to see how it maps to familiar territory.",
      spotlightLabel: "In focus",
      loopEyebrow: "Section Focus",
      loopTitle: "Expand the execution loop into a 6-step timeline",
      loopLead:
        "What sets an agent apart from a chatbot is taking extra steps — these six are the standard rhythm of a tool call.",
      sdkEyebrow: "Stack Layout",
      sdkTitle: "The Vercel AI SDK splits an agent into three clear layers",
      sdkLead:
        "Tool definitions, backend route, frontend UI — each layer has one job, and where each one runs is unambiguous.",
    },
  },
}

function resolveLocale(raw: string): Locale {
  return raw === "en" ? "en" : "zh"
}

function PillarsBlock({ copy }: { copy: LocalizedCopy }) {
  const [activeId, setActiveId] = useState<PillarId>("loop")
  const active = useMemo(
    () => copy.pillars.find((item) => item.id === activeId) ?? copy.pillars[0],
    [activeId, copy.pillars],
  )

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.eyebrow}>{copy.ui.pillarsEyebrow}</div>
        <h3 className={styles.panelTitle}>{copy.ui.pillarsTitle}</h3>
        <p className={styles.panelLead}>{copy.ui.pillarsLead}</p>
      </div>

      <div className={styles.pillarLayout}>
        <div className={styles.pillarGrid}>
          {copy.pillars.map((pillar) => (
            <button
              key={pillar.id}
              type="button"
              className={`${styles.pillarCard} ${pillar.id === activeId ? styles.pillarCardActive : ""}`}
              onClick={() => setActiveId(pillar.id)}
            >
              <span className={styles.pillarIcon}>{pillar.index}</span>
              <div className={styles.pillarBody}>
                <strong>{pillar.label}</strong>
                <small>{pillar.short}</small>
                <p>{pillar.summary}</p>
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
            <div className={styles.spotlightLabel}>{copy.ui.spotlightLabel}</div>
            <h4>
              {active.label} · {active.short}
            </h4>
            <p>{active.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function LoopBlock({ copy }: { copy: LocalizedCopy }) {
  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>{copy.ui.loopEyebrow}</div>
          <h3 className={styles.inlineTitle}>{copy.ui.loopTitle}</h3>
        </div>
        <p className={styles.panelLead}>{copy.ui.loopLead}</p>
      </div>

      <div className={styles.timeline}>
        {copy.loopSteps.map((step, index) => (
          <div key={step.title} className={styles.timelineStep}>
            <span className={styles.stepIndex}>{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SdkStackBlock({ copy }: { copy: LocalizedCopy }) {
  return (
    <section className={styles.panel}>
      <div className={styles.inlineHeader}>
        <div>
          <div className={styles.eyebrow}>{copy.ui.sdkEyebrow}</div>
          <h3 className={styles.inlineTitle}>{copy.ui.sdkTitle}</h3>
        </div>
        <p className={styles.panelLead}>{copy.ui.sdkLead}</p>
      </div>

      <div className={styles.sdkStack}>
        {copy.sdkLayers.map((layer) => (
          <div key={layer.label} className={styles.sdkLayer}>
            <span className={styles.sdkIndex}>{layer.index}</span>
            <div className={styles.sdkLayerBody}>
              <strong>{layer.label}</strong>
              <p>
                <em>{layer.short}</em>
              </p>
              <p>{layer.detail}</p>
              <pre className={styles.sdkLayerCode}>{layer.code}</pre>
            </div>
            <span className={styles.sdkLayerMeta}>{layer.meta}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function AiAgentInlineBlock({
  slug,
  sectionKey,
  headingText,
}: AiAgentInlineBlockProps) {
  const localeRaw = useLocale()
  const locale = resolveLocale(localeRaw)
  const copy = COPY[locale]

  if (slug !== "build-ai-agent-from-scratch") {
    return null
  }

  if (sectionKey === "intro") {
    return null
  }

  const heading = headingText?.toLowerCase() ?? ""

  if (heading.includes("front-end mental model") || heading.includes("前端心智模型")) {
    return <PillarsBlock copy={copy} />
  }

  if (heading.includes("execution loop") || heading.includes("执行循环")) {
    return <LoopBlock copy={copy} />
  }

  if (heading.includes("vercel ai sdk")) {
    return <SdkStackBlock copy={copy} />
  }

  return null
}
