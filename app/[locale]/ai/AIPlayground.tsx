"use client"

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { isToolUIPart, type UIMessage } from "ai"
import ReactMarkdown from "react-markdown"
import { Textarea } from "@/app/components/ui/textarea"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "@/app/hooks/useTheme"
import { useChatThreads, type ChatThread } from "@/app/hooks/useChatThreads"
import { useThreadChat } from "@/app/hooks/useThreadChat"
import { useGlobalChatRuntime } from "@/app/context/GlobalChatRuntimeContext"
import { removeWorkspaceForThread } from "@/app/hooks/useThreadWorkspace"
import {
  getToolName,
  resolveVisualToolOutputPayload,
} from "@/app/hooks/useWorkspaceSync"
import { cn } from "@/lib/utils"
import type { TokenEstimate } from "@/lib/ai/token-estimate"
import {
  formatTokenCount,
  getRiskLabel,
  getRiskLabelEn,
} from "@/lib/ai/token-estimate"
import { ClientComponent } from "@/app/packages/ClientComponent"
import ArtifactRenderer from "@/app/components/ai-workspace/ArtifactRenderer"
import PixelMenuIcon from "@/app/components/system/PixelMenuIcon"
import {
  getWorkspaceArtifactLabelKey,
  safeParseWorkspaceArtifactPayload,
  type WorkspaceArtifact,
  type WorkspaceArtifactPayload,
} from "@/app/types/ai-workspace"
import RecommendedPromptChips from "./components/RecommendedPromptChips"
import ArticlePickerModal from "./components/ArticlePickerModal"
import ThreadSidebar from "./components/ThreadSidebar"
import ThreadTitleMenu from "./components/ThreadTitleMenu"
import { getLandingOpener } from "./landingOpeners"
import { getSuggestedPrompts, type SuggestedPrompt } from "./recommendedPrompts"
import { deriveThreadDisplayTitle } from "./threadDisplay"

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

const CODE_LANGUAGE_ALIAS_MAP: Record<string, string> = {
  shell: "bash",
  zsh: "bash",
  env: "bash",
  yml: "yaml",
  md: "markdown",
}

const CHAT_TEXTAREA_MIN_HEIGHT = 56
const CHAT_TEXTAREA_MAX_HEIGHT = 160

const LEGACY_VISUAL_TOOL_ARTIFACT_MAP = {
  get_profile_summary: "profile-card",
  list_projects: "project-grid",
  search_articles: "article-summary",
} as const

function getFallbackToolSummary(
  toolName: string,
  t: ReturnType<typeof useTranslations<"ai">>,
) {
  if (toolName === "get_profile_summary") {
    return t("toolReceiptProfileCard")
  }
  if (toolName === "list_projects") {
    return t("toolReceiptProjectGrid")
  }
  if (toolName === "search_articles") {
    return t("toolReceiptArticleSummary")
  }

  return t("toolReceiptDone")
}

function getPendingToolLabel(
  toolName: string,
  input: unknown,
  t: ReturnType<typeof useTranslations<"ai">>,
) {
  if (toolName === "build_ui_block") {
    const payload = safeParseWorkspaceArtifactPayload(input)
    if (!payload) return `${toolName}...`

    const artifactLabel = payload.title?.trim()
      ? payload.title
      : t(getWorkspaceArtifactLabelKey(payload.artifactType))

    return payload.operation === "update"
      ? t("artifactPendingUpdate", { artifact: artifactLabel })
      : t("artifactPendingAppend", { artifact: artifactLabel })
  }

  if (toolName in LEGACY_VISUAL_TOOL_ARTIFACT_MAP) {
    const artifactType =
      LEGACY_VISUAL_TOOL_ARTIFACT_MAP[
        toolName as keyof typeof LEGACY_VISUAL_TOOL_ARTIFACT_MAP
      ]

    return t("artifactPendingAppend", {
      artifact: t(getWorkspaceArtifactLabelKey(artifactType)),
    })
  }

  return `${toolName}...`
}

function getToolSummaryLabel(
  toolName: string,
  payload: WorkspaceArtifactPayload | null,
  output: unknown,
  t: ReturnType<typeof useTranslations<"ai">>,
) {
  const data = output as Record<string, unknown>

  if (typeof data.summary === "string" && data.summary.trim()) {
    return data.summary
  }

  if (!payload) {
    return getFallbackToolSummary(toolName, t)
  }

  const receiptKey =
    payload.operation === "append"
      ? "artifactReceiptAppend"
      : payload.operation === "replace"
        ? "artifactReceiptReplace"
        : "artifactReceiptUpdate"

  return t(receiptKey, {
    artifact: t(getWorkspaceArtifactLabelKey(payload.artifactType)),
  })
}

function createInlineArtifact(
  payload: WorkspaceArtifactPayload,
  sourceId: string,
): WorkspaceArtifact {
  const now = Date.now()

  return {
    id: `inline-${sourceId}`,
    threadId: "inline-chat",
    type: payload.artifactType,
    title: payload.title,
    data: payload.data,
    status: "ready",
    summary: payload.summary,
    createdAt: now,
    updatedAt: now,
  }
}

function hasRenderableArtifactContent(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasRenderableArtifactContent)
  }

  if (typeof value === "number") {
    return true
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  if (!value || typeof value !== "object") {
    return false
  }

  return Object.values(value).some(hasRenderableArtifactContent)
}

function PendingToolNotice({
  toolName,
  input,
}: {
  toolName: string
  input: unknown
}) {
  const t = useTranslations("ai")

  return (
    <div className="flex items-center gap-2 py-1 text-muted-foreground">
      <span className="inline-block h-1.5 w-1.5 animate-pulse bg-primary" />
      <span className="font-pixel text-[10px] uppercase tracking-[0.12em] text-muted-foreground/86">
        {getPendingToolLabel(toolName, input, t)}
      </span>
    </div>
  )
}

function InlineToolResult({
  toolName,
  output,
  sourceId,
}: {
  toolName: string
  output: unknown
  sourceId: string
}) {
  const t = useTranslations("ai")
  const payload = resolveVisualToolOutputPayload(toolName, output)
  const summary = getToolSummaryLabel(toolName, payload, output, t)

  if (!payload || !hasRenderableArtifactContent(payload.data)) {
    return (
      <div className="flex items-center gap-2 py-1">
        <span className="inline-block h-1.5 w-1.5 bg-primary" />
        <span className="font-pixel text-[10px] uppercase tracking-[0.12em] text-primary/88">
          {summary}
        </span>
      </div>
    )
  }

  const artifact = createInlineArtifact(payload, sourceId)

  return (
    <div className="space-y-3 py-1">
      <div className="flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 bg-primary" />
        <span className="font-pixel text-[10px] uppercase tracking-[0.12em] text-primary/88">
          {summary}
        </span>
      </div>

      <div className="ai-lab-inline-artifact border border-border/45 bg-background/72 px-4 py-4 shadow-[0_8px_24px_hsl(var(--background)/0.08)] md:px-5 md:py-5">
        <ArtifactRenderer artifact={artifact} />
      </div>
    </div>
  )
}

function ChatCodeBlock({
  code,
  colorMode,
  language,
  isStreaming,
  className,
}: {
  code: string
  colorMode: string
  language: string
  isStreaming: boolean
  className?: string
}) {
  const isDark = colorMode === "dark"
  const taskbarBg = isDark ? "#2d2d2d" : "#f0f0f0"
  const bodyBg = isDark ? "hsl(265 55% 8%)" : "hsl(215 30% 10%)"
  const normalizedLanguage =
    CODE_LANGUAGE_ALIAS_MAP[language.toLowerCase()] ?? language.toLowerCase()

  return (
    <div className={cn("overflow-hidden border border-border/70", className)}>
      <div
        className="flex h-10 items-center justify-between border-b border-border/70 px-4"
        style={{ background: taskbarBg }}
      >
        <div className="flex items-center gap-1.5">
          <span className="block h-2.5 w-2.5" style={{ background: "#ff5f57" }} />
          <span className="block h-2.5 w-2.5" style={{ background: "#ffbd2e" }} />
          <span className="block h-2.5 w-2.5" style={{ background: "#28c840" }} />
        </div>
        <span className="font-pixel text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {language}
        </span>
      </div>
      <div style={{ background: bodyBg }}>
        {isStreaming ? (
          <pre className="codeblock-pre m-0 max-h-[420px] w-full overflow-auto whitespace-pre p-4 text-[12px] leading-6 text-[#e7eef5]">
            <code>{code}</code>
          </pre>
        ) : (
          <ClientComponent lang={normalizedLanguage as any} colorMode={colorMode}>
            {code}
          </ClientComponent>
        )}
      </div>
    </div>
  )
}

function MarkdownRenderer({
  text,
  streamCodeBlocks = false,
}: {
  text: string
  streamCodeBlocks?: boolean
}) {
  const { colorMode } = useTheme()

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 text-[12px] leading-6 tracking-[0.04em] md:text-[13px] md:leading-7">
            {children}
          </p>
        ),
        strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
        em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
          >
            {children}
          </a>
        ),
        h1: ({ children }) => (
          <h1 className="mb-3 mt-6 text-[1rem] leading-7 tracking-[0.08em] text-foreground md:text-[1.15rem] md:leading-8">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-5 text-[0.95rem] leading-7 tracking-[0.08em] text-foreground md:text-[1.05rem]">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-[0.9rem] leading-6 tracking-[0.08em] text-foreground md:text-[0.98rem]">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mb-1.5 mt-3 text-[11px] uppercase tracking-[0.12em] text-foreground/88">
            {children}
          </h4>
        ),
        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
        li: ({ children }) => (
          <li className="text-[12px] leading-6 tracking-[0.04em] text-foreground/92 md:text-[13px] md:leading-7">
            {children}
          </li>
        ),
        hr: () => <hr className="my-5 border-t border-border/40" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l border-primary/40 bg-primary/[0.04] py-2 pl-3 pr-2 text-[11px] leading-6 tracking-[0.04em] text-muted-foreground md:text-[12px]">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const match = /language-(\w+)/.exec(className || "")
          const code = String(children).replace(/\n$/, "")

          if (match) {
            return (
              <ChatCodeBlock
                code={code}
                colorMode={colorMode}
                language={match[1]}
                isStreaming={streamCodeBlocks}
                className="my-4"
              />
            )
          }

          return (
            <code className="border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-primary">
              {children}
            </code>
          )
        },
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse border border-border/70 text-[12px] md:text-[13px]">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-secondary/80">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-border/40">{children}</tbody>,
        tr: ({ children }) => <tr className="border-b border-border/40">{children}</tr>,
        th: ({ children }) => (
          <th className="border border-border/60 px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-[0.12em] text-foreground/86">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border/40 px-3 py-2 text-[12px] leading-6 tracking-[0.04em] text-foreground/90 md:text-[13px]">
            {children}
          </td>
        ),
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

const MemoizedMarkdownRenderer = React.memo(MarkdownRenderer)

const ChatMessagesViewport = React.memo(function ChatMessagesViewport({
  messages,
  isBusy,
  showThinking,
  lastAssistantMessageId,
  loadingLabel,
}: {
  messages: UIMessage[]
  isBusy: boolean
  showThinking: boolean
  lastAssistantMessageId?: string
  loadingLabel: string
}) {
  const scrollViewportRef = useRef<HTMLDivElement>(null)

  useBrowserLayoutEffect(() => {
    const viewport = scrollViewportRef.current
    if (!viewport) return

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: isBusy ? "auto" : "smooth",
    })
  }, [messages, isBusy])

  return (
    <div
      ref={scrollViewportRef}
      className="ai-lab-messages-viewport flex-1 overflow-y-auto px-4 pb-6 pt-5 md:px-8 md:pb-8 md:pt-7"
    >
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8 md:gap-10">
          {messages.map((message) => {
            const isUser = message.role === "user"

            return (
              <div
                key={message.id}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "ai-lab-message-card",
                    isUser
                      ? "ai-lab-message-card--user max-w-[min(100%,36rem)] px-4 py-3.5 md:px-5"
                      : "ai-lab-message-card--assistant w-full max-w-none px-0 py-0",
                  )}
                >
                  <span
                    className={cn(
                      "mb-2 block font-pixel text-[10px] uppercase tracking-[0.16em]",
                      isUser ? "text-primary/82" : "text-muted-foreground/60",
                    )}
                  >
                    {isUser ? "You" : "AI"}
                  </span>

                  <div
                    className={cn(
                      "space-y-3",
                      isUser
                        ? "text-[12px] leading-7 tracking-[0.04em] text-foreground md:text-[13px]"
                        : "text-[12px] leading-7 tracking-[0.04em] text-foreground md:text-[13px]",
                    )}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <MemoizedMarkdownRenderer
                            key={`${message.id}-${index}`}
                            text={part.text}
                            streamCodeBlocks={
                              isBusy &&
                              message.role === "assistant" &&
                              message.id === lastAssistantMessageId
                            }
                          />
                        )
                      }

                      if (isToolUIPart(part)) {
                        const toolName = getToolName(part)
                        const sourceId = `${message.id}-${index}`

                        if (part.state === "input-available") {
                          return (
                            <PendingToolNotice
                              key={sourceId}
                              toolName={toolName}
                              input={part.input}
                            />
                          )
                        }

                        if (part.state === "output-available") {
                          return (
                            <InlineToolResult
                              key={sourceId}
                              toolName={toolName}
                              output={part.output}
                              sourceId={sourceId}
                            />
                          )
                        }

                        if (part.state === "output-error") {
                          return (
                            <div
                              key={sourceId}
                              className="font-pixel text-[10px] uppercase tracking-[0.12em] text-destructive"
                            >
                              Error: {part.errorText}
                            </div>
                          )
                        }
                      }

                      return null
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          {showThinking ? (
            <div className="flex justify-start">
              <div className="ai-lab-message-card ai-lab-message-card--assistant w-full max-w-none px-0 py-0">
                <span className="mb-2 block font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
                  AI
                </span>
                <div className="font-pixel text-[10px] uppercase tracking-[0.12em] text-muted-foreground/84">
                  {loadingLabel}
                </div>
              </div>
            </div>
          ) : null}
        </div>
    </div>
  )
})

const ChatComposer = React.memo(function ChatComposer({
  sendMessage,
  stop,
  isBusy,
  slowPhase,
  estimateInputTokens,
  error,
  placeholder,
  loadingLabel,
  submitLabel,
  errorLabel,
  slowLabel,
  verySlowLabel,
  connectingLabel,
  cancelLabel,
  locale,
  shortcutHint,
}: {
  sendMessage: (message: { text: string }) => Promise<void>
  stop: () => void
  isBusy: boolean
  slowPhase: "normal" | "slow" | "verySlow"
  estimateInputTokens: (pendingInput: string) => TokenEstimate
  error?: Error | undefined
  placeholder: string
  loadingLabel: string
  submitLabel: string
  errorLabel: string
  slowLabel: string
  verySlowLabel: string
  connectingLabel: string
  cancelLabel: string
  locale: string
  shortcutHint: string
}) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tokenEstimate = useMemo(
    () => estimateInputTokens(input),
    [estimateInputTokens, input],
  )

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = `${CHAT_TEXTAREA_MIN_HEIGHT}px`

    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, CHAT_TEXTAREA_MIN_HEIGHT),
      CHAT_TEXTAREA_MAX_HEIGHT,
    )

    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY =
      textarea.scrollHeight > CHAT_TEXTAREA_MAX_HEIGHT ? "auto" : "hidden"
  }, [])

  useBrowserLayoutEffect(() => {
    resizeTextarea()
  }, [input, resizeTextarea])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || isBusy) return

    setInput("")
    textareaRef.current?.focus()
    await sendMessage({ text: value })
  }

  let statusLabel = ""
  if (isBusy) {
    if (slowPhase === "verySlow") {
      statusLabel = verySlowLabel
    } else if (slowPhase === "slow") {
      statusLabel = slowLabel
    } else {
      statusLabel = connectingLabel
    }
  }

  const tokenText = `${formatTokenCount(tokenEstimate.estimatedPromptTokens)} tokens`
  const riskText =
    locale === "zh" ? getRiskLabel(tokenEstimate.risk) : getRiskLabelEn(tokenEstimate.risk)
  const riskColor =
    tokenEstimate.risk === "high"
      ? "text-destructive"
      : tokenEstimate.risk === "medium"
        ? "text-amber-500"
        : "text-muted-foreground"

  return (
    <div className="ai-lab-composer w-full shrink-0 px-4 pb-4 pt-3 md:px-8 md:pb-6">
      <div className="mx-auto max-w-[1120px] space-y-3">
        {error && errorLabel ? (
          <p className="font-pixel text-[10px] uppercase tracking-[0.12em] text-destructive">
            {errorLabel}
          </p>
        ) : null}

        {statusLabel && !error ? (
          <div className="flex items-center justify-between gap-3">
            <p className="font-pixel text-[10px] uppercase tracking-[0.12em] text-amber-600">
              {statusLabel}
            </p>
            <button
              type="button"
              onClick={stop}
              className="ai-lab-pixel-button px-3 py-1.5 text-[10px] hover:border-destructive/70 hover:bg-destructive/10 hover:text-destructive"
            >
              {cancelLabel}
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="ai-lab-composer-shell flex min-h-[104px] items-end gap-4 border-2 border-border px-5 py-4 transition-[border-color,background-color] duration-200 focus-within:border-primary">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={placeholder}
              className="min-h-[64px] flex-1 resize-none border-0 bg-transparent p-0 font-pixel text-[12px] leading-8 tracking-[0.05em] shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:font-pixel placeholder:tracking-[0.05em] placeholder:text-muted-foreground/60"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void handleSubmit(event)
                }
              }}
            />

            <button
              type="submit"
              disabled={!input.trim() || isBusy}
              className={cn(
                "ai-lab-pixel-button mb-1 h-12 min-w-[112px] shrink-0 border-border px-5 text-[10px] text-foreground",
                input.trim() && !isBusy
                  ? "ai-lab-pixel-button--active"
                  : "bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {isBusy ? loadingLabel : submitLabel}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="font-pixel text-[9px] uppercase tracking-[0.12em] text-muted-foreground/68">
            {shortcutHint}
          </p>
          <p className={cn("font-pixel text-[9px] uppercase tracking-[0.12em]", riskColor)}>
            {tokenText} · {riskText}
          </p>
        </div>
      </div>
    </div>
  )
})

function getErrorLabel(
  error: (Error & { status?: number }) | undefined,
  t: (key: string) => string,
): string {
  if (!error) return ""
  if (error.status === 413) return t("errorInputTooLong")
  if (error.status === 423) return t("errorConversationBusy")
  if (error.status === 429) return t("errorRateLimit")
  if (error.status === 503) return t("errorServiceUnavailable")
  if (error.status === 504) return t("errorTimeout")
  return t("errorGeneric")
}

function ChatThreadView({
  thread,
  onMessagesChange,
  locale,
}: {
  thread: ChatThread
  onMessagesChange: (messages: UIMessage[]) => void
  locale: string
}) {
  const t = useTranslations("ai")
  const suggestedPrompts = useMemo(() => getSuggestedPrompts(locale), [locale])
  const landingOpener = useMemo(
    () => getLandingOpener(locale, thread.id),
    [locale, thread.id],
  )
  const [articlePickerOpen, setArticlePickerOpen] = useState(false)
  const [articleOptions, setArticleOptions] = useState<Array<{ slug: string; title: string }>>([])

  const { messages, sendMessage, stop, error, isBusy, slowPhase, estimateInputTokens } =
    useThreadChat({
      threadId: thread.id,
      initialMessages: thread.messages,
      onMessagesPersist: onMessagesChange,
    })

  const errorLabel = getErrorLabel(error, t)

  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
  const lastAssistantMessageId = lastAssistantMessage?.id
  const lastAssistantHasContent = Boolean(
    lastAssistantMessage?.parts.some((part) => {
      if (part.type === "text") {
        return part.text.trim().length > 0
      }

      return isToolUIPart(part) && part.state !== "input-streaming"
    }),
  )
  const showThinking = isBusy && !lastAssistantHasContent
  const hasConversation = messages.some((message) => message.role === "user")

  const handleSuggestedPromptSelect = useCallback(
    async (prompt: SuggestedPrompt) => {
      if (isBusy) return

      if (prompt.mode === "article-picker") {
        if (articlePickerOpen) {
          setArticlePickerOpen(false)
          return
        }

        if (articleOptions.length === 0) {
          const response = await fetch(`/api/ai/articles?locale=${encodeURIComponent(locale)}`)
          if (!response.ok) return
          const data = (await response.json()) as Array<{ slug: string; title: string }>
          setArticleOptions(data)
        }

        setArticlePickerOpen(true)
        return
      }

      setArticlePickerOpen(false)
      await sendMessage({ text: prompt.prompt })
    },
    [articleOptions.length, articlePickerOpen, isBusy, locale, sendMessage],
  )

  const handleArticleSelect = useCallback(
    async (article: { slug: string; title: string }) => {
      if (isBusy) return

      setArticlePickerOpen(false)
      await sendMessage({
        text: locale.startsWith("zh")
          ? `请介绍一下这篇 blog《${article.title}》，讲讲它主要写了什么、为什么值得看。`
          : `Introduce the blog post "${article.title}" and explain what it covers and why it is worth reading.`,
      })
    },
    [isBusy, locale, sendMessage],
  )

  if (messages.length === 0) {
    return (
      <div className="ai-lab-thread-view flex h-full flex-col overflow-hidden">
        <div className="flex h-full flex-col items-center justify-center overflow-y-auto px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-8 text-center">
            <h1 className="font-pixel text-[clamp(1.3rem,3vw,2.2rem)] leading-[1.3] tracking-[0.06em] text-foreground md:whitespace-nowrap">
              {landingOpener}
            </h1>

            <ChatComposer
              sendMessage={sendMessage}
              stop={stop}
              isBusy={isBusy}
              slowPhase={slowPhase}
              estimateInputTokens={estimateInputTokens}
              error={error}
              placeholder={t("textPromptPlaceholder")}
              loadingLabel={t("loading")}
              submitLabel={t("submit")}
              errorLabel={errorLabel}
              slowLabel={t("slowRequest")}
              verySlowLabel={t("verySlowRequest")}
              connectingLabel={t("connectingModel")}
              cancelLabel={t("cancel")}
              locale={locale}
              shortcutHint={t("shortcutHint")}
            />

            <RecommendedPromptChips
              articlePickerOpen={articlePickerOpen}
              prompts={suggestedPrompts}
              disabled={isBusy}
              onSelect={handleSuggestedPromptSelect}
            />

            <ArticlePickerModal
              articles={articleOptions}
              isOpen={articlePickerOpen}
              locale={locale}
              onClose={() => setArticlePickerOpen(false)}
              onSelect={handleArticleSelect}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ai-lab-thread-view flex h-full flex-col overflow-hidden">
      <ChatMessagesViewport
        messages={messages}
        isBusy={isBusy}
        showThinking={showThinking}
        lastAssistantMessageId={lastAssistantMessageId}
        loadingLabel={t("loading")}
      />

      <ChatComposer
        sendMessage={sendMessage}
        stop={stop}
        isBusy={isBusy}
        slowPhase={slowPhase}
        estimateInputTokens={estimateInputTokens}
        error={error}
        placeholder={t("textPromptPlaceholder")}
        loadingLabel={t("loading")}
        submitLabel={t("send")}
        errorLabel={errorLabel}
        slowLabel={t("slowRequest")}
        verySlowLabel={t("verySlowRequest")}
        connectingLabel={t("connectingModel")}
        cancelLabel={t("cancel")}
        locale={locale}
        shortcutHint={t("shortcutHint")}
      />
    </div>
  )
}

function formatRelativeTime(ts: number, locale: string): string {
  const diffMs = ts - Date.now()
  const absDiffMs = Math.abs(diffMs)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

  if (absDiffMs < 60000) {
    return rtf.format(0, "minute")
  }

  if (absDiffMs < 3600000) {
    return rtf.format(Math.round(diffMs / 60000), "minute")
  }

  if (absDiffMs < 86400000) {
    return rtf.format(Math.round(diffMs / 3600000), "hour")
  }

  if (absDiffMs < 604800000) {
    return rtf.format(Math.round(diffMs / 86400000), "day")
  }

  return new Date(ts).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  })
}

export default function AIPlayground() {
  const t = useTranslations("ai")
  const locale = useLocale()
  const {
    hydrated,
    threads,
    activeThreadId,
    createThread,
    deleteThread,
    renameThread,
    toggleThreadStar,
    updateThreadMessages,
    setActiveThread,
  } = useChatThreads()
  const { removeChat } = useGlobalChatRuntime()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const threadDisplayLabels = useMemo(
    () => ({
      defaultTitle: t("defaultChatTitle"),
      greetingTitle: t("greetingChatTitle"),
      aboutJieTitle: t("aboutJieChatTitle"),
    }),
    [t],
  )

  const activeThread = threads.find((thread) => thread.id === activeThreadId)
  const activeThreadDisplayTitle = activeThread
    ? deriveThreadDisplayTitle(activeThread, threadDisplayLabels)
    : null

  const handleActiveMessagesChange = useCallback(
    (messages: UIMessage[]) => {
      if (!activeThreadId) return
      updateThreadMessages(activeThreadId, messages)
    },
    [activeThreadId, updateThreadMessages],
  )

  const handleDeleteThread = useCallback(
    (id: string) => {
      removeChat(id)
      removeWorkspaceForThread(id)
      deleteThread(id)
    },
    [removeChat, deleteThread],
  )

  return (
    <div
      className="relative flex w-full flex-row overflow-hidden font-pixel"
      style={{ height: "calc(100svh - var(--app-nav-offset))" }}
    >
      <aside
        className="ai-lab-sidebar-pane fixed left-0 z-30 hidden w-[280px] flex-col border-r border-border/45 md:flex"
        style={{
          top: "var(--app-nav-offset)",
          height: "calc(100svh - var(--app-nav-offset))",
        }}
      >
        <ThreadSidebar
          activeThreadId={activeThreadId}
          hydrated={hydrated}
          locale={locale}
          threads={threads}
          onCreateThread={() => {
            createThread()
            setSidebarOpen(false)
          }}
          onDeleteThread={handleDeleteThread}
          onSelectThread={(threadId) => {
            setActiveThread(threadId)
            setSidebarOpen(false)
          }}
          formatRelativeTime={formatRelativeTime}
        />
      </aside>

      <div className="ai-lab-shell relative flex h-full w-full flex-col overflow-hidden md:ml-[280px]">
        <div className="relative flex flex-1 overflow-hidden">
          <aside
            id="chat-sidebar"
            className={cn(
              "ai-lab-sidebar-pane absolute inset-y-0 left-0 z-30 w-[min(290px,86vw)] border-r border-border/45 transition-all duration-200 ease-out md:hidden",
              sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0",
            )}
          >
            <ThreadSidebar
              activeThreadId={activeThreadId}
              hydrated={hydrated}
              locale={locale}
              threads={threads}
              onCreateThread={() => {
                createThread()
                setSidebarOpen(false)
              }}
              onDeleteThread={handleDeleteThread}
              onSelectThread={(threadId) => {
                setActiveThread(threadId)
                setSidebarOpen(false)
              }}
              formatRelativeTime={formatRelativeTime}
            />
          </aside>

          {sidebarOpen ? (
            <div
              className="absolute inset-0 z-20 bg-background/72 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          ) : null}

          <main className="ai-lab-chat-pane relative flex flex-1 flex-col overflow-hidden">
            <div className="shrink-0 px-4 pb-2 pt-4 md:px-5 md:pb-3 md:pt-5">
              <div className="flex w-full items-start justify-between gap-3 md:justify-start">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setSidebarOpen((open) => !open)}
                    className="ai-lab-pixel-button h-10 w-10 shrink-0 bg-background text-foreground md:hidden"
                    aria-label={
                      sidebarOpen
                        ? t("closeSidebar") ?? "Close sidebar"
                        : t("openSidebar") ?? "Open sidebar"
                    }
                    aria-expanded={sidebarOpen}
                    aria-controls="chat-sidebar"
                  >
                    <PixelMenuIcon isOpen={sidebarOpen} />
                  </button>

                  {activeThread && activeThreadDisplayTitle ? (
                    <ThreadTitleMenu
                      title={activeThreadDisplayTitle}
                      isStarred={Boolean(activeThread.isStarred)}
                      onRename={(nextTitle) => renameThread(activeThread.id, nextTitle)}
                      onToggleStar={() => toggleThreadStar(activeThread.id)}
                      onDelete={() => handleDeleteThread(activeThread.id)}
                    />
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    createThread()
                    setSidebarOpen(false)
                  }}
                  className="ai-lab-pixel-button h-9 bg-background px-3 text-[10px] text-foreground md:hidden"
                >
                  {t("newChat")}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1">
              {!hydrated ? (
                <div className="flex h-full items-center justify-center">
                  <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground/68">
                    {t("loadingChats")}
                  </p>
                </div>
              ) : activeThread ? (
                <ChatThreadView
                  key={activeThread.id}
                  thread={activeThread}
                  onMessagesChange={handleActiveMessagesChange}
                  locale={locale}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <p className="max-w-2xl font-pixel text-[11px] uppercase leading-7 tracking-[0.08em] text-muted-foreground/72">
                    {t("noChats") ?? "No conversations yet"}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
