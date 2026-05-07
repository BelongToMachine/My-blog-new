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
import { useReducedMotion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "@/app/hooks/useTheme"
import { useChatThreads, type ChatThread } from "@/app/hooks/useChatThreads"
import { useThreadChat } from "@/app/hooks/useThreadChat"
import { useGlobalChatRuntime } from "@/app/context/GlobalChatRuntimeContext"
import {
  useThreadWorkspace,
  removeWorkspaceForThread,
} from "@/app/hooks/useThreadWorkspace"
import { getToolName, useWorkspaceSync } from "@/app/hooks/useWorkspaceSync"
import { cn } from "@/lib/utils"
import type { TokenEstimate } from "@/lib/ai/token-estimate"
import { formatTokenCount, getRiskLabel, getRiskLabelEn } from "@/lib/ai/token-estimate"
import { ClientComponent } from "@/app/packages/ClientComponent"
import WorkspacePanel from "@/app/components/ai-workspace/WorkspacePanel"
import PixelMenuIcon from "@/app/components/system/PixelMenuIcon"
import {
  getWorkspaceArtifactLabelKey,
  safeParseWorkspaceArtifactPayload,
} from "@/app/types/ai-workspace"

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

const CODE_LANGUAGE_ALIAS_MAP: Record<string, string> = {
  shell: "bash",
  zsh: "bash",
  env: "bash",
  yml: "yaml",
  md: "markdown",
}

const WORKSPACE_FLOATING_HANDLE_SIZE = 52
const WORKSPACE_FLOATING_HANDLE_MARGIN = 16
const WORKSPACE_FLOATING_HANDLE_TOP_CLEARANCE = 84
const WORKSPACE_FLOATING_HANDLE_BOTTOM_CLEARANCE = 20
const WORKSPACE_FLOATING_HANDLE_STORAGE_KEY = "ai-playground-workspace-handle-position"
const WORKSPACE_DESKTOP_MEDIA_QUERY = "(min-width: 1024px)"

type FloatingWorkspacePosition = {
  x: number
  y: number
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getFloatingWorkspaceBounds(viewportWidth: number, viewportHeight: number) {
  const minX = WORKSPACE_FLOATING_HANDLE_MARGIN
  const maxX = Math.max(
    WORKSPACE_FLOATING_HANDLE_MARGIN,
    viewportWidth - WORKSPACE_FLOATING_HANDLE_SIZE - WORKSPACE_FLOATING_HANDLE_MARGIN,
  )
  const minY = WORKSPACE_FLOATING_HANDLE_TOP_CLEARANCE
  const maxY = Math.max(
    WORKSPACE_FLOATING_HANDLE_TOP_CLEARANCE,
    viewportHeight -
      WORKSPACE_FLOATING_HANDLE_SIZE -
      WORKSPACE_FLOATING_HANDLE_BOTTOM_CLEARANCE,
  )

  return { minX, maxX, minY, maxY }
}

function clampFloatingWorkspacePosition(
  position: FloatingWorkspacePosition,
  viewportWidth: number,
  viewportHeight: number,
): FloatingWorkspacePosition {
  const bounds = getFloatingWorkspaceBounds(viewportWidth, viewportHeight)

  return {
    x: clampValue(position.x, bounds.minX, bounds.maxX),
    y: clampValue(position.y, bounds.minY, bounds.maxY),
  }
}

function getDefaultFloatingWorkspacePosition(
  viewportWidth: number,
  viewportHeight: number,
): FloatingWorkspacePosition {
  const bounds = getFloatingWorkspaceBounds(viewportWidth, viewportHeight)

  return {
    x: bounds.maxX,
    y: clampValue(viewportHeight * 0.68, bounds.minY, bounds.maxY),
  }
}

function getSnappedFloatingWorkspacePosition(
  position: FloatingWorkspacePosition,
  viewportWidth: number,
  viewportHeight: number,
): FloatingWorkspacePosition {
  const clamped = clampFloatingWorkspacePosition(position, viewportWidth, viewportHeight)
  const bounds = getFloatingWorkspaceBounds(viewportWidth, viewportHeight)
  const anchorX =
    clamped.x + WORKSPACE_FLOATING_HANDLE_SIZE / 2 < viewportWidth / 2
      ? bounds.minX
      : bounds.maxX

  return {
    x: anchorX,
    y: clamped.y,
  }
}

function readStoredFloatingWorkspacePosition(): FloatingWorkspacePosition | null {
  if (typeof window === "undefined") return null

  try {
    const raw = window.localStorage.getItem(WORKSPACE_FLOATING_HANDLE_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<FloatingWorkspacePosition>
    if (typeof parsed.x !== "number" || typeof parsed.y !== "number") {
      return null
    }

    return { x: parsed.x, y: parsed.y }
  } catch {
    return null
  }
}

/* ─── Lightweight tool receipt ─── */

function ToolReceipt({
  toolName,
  output,
  onOpenWorkspace,
}: {
  toolName: string
  output: unknown
  onOpenWorkspace?: () => void
}) {
  const t = useTranslations("ai")
  const data = output as Record<string, unknown>
  const payload =
    toolName === "build_ui_block"
      ? safeParseWorkspaceArtifactPayload(output)
      : null

  let summary = typeof data.summary === "string" ? data.summary : undefined
  const surface = payload?.surface ?? "chat"
  const reveal = payload?.reveal ?? false

  if (!summary && payload) {
    const receiptKey =
      payload.operation === "append"
        ? "artifactReceiptAppend"
        : payload.operation === "replace"
          ? "artifactReceiptReplace"
          : "artifactReceiptUpdate"
    summary = t(receiptKey, {
      artifact: t(getWorkspaceArtifactLabelKey(payload.artifactType)),
    })
  }

  if (!summary) {
    if (toolName === "get_profile_summary") {
      summary = t("toolReceiptProfileCard")
    } else if (toolName === "list_projects") {
      summary = t("toolReceiptProjectGrid")
    } else if (toolName === "search_articles") {
      summary = t("toolReceiptArticleSummary")
    } else {
      summary = t("toolReceiptDone")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      <span className="inline-block h-2 w-2 bg-primary" />
      <span className="font-pixel text-[10px] uppercase tracking-[0.2em] text-primary/80">
        {summary}
      </span>
      {surface === "artifact" && !reveal && onOpenWorkspace ? (
        <button
          onClick={onOpenWorkspace}
          className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-2 transition-colors hover:text-primary"
        >
          {t("openWorkspaceToView") ?? "Open to view"}
        </button>
      ) : null}
    </div>
  )
}

/* ─── Markdown renderer for assistant text ─── */

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
    <div className={cn("overflow-hidden border-2 border-border", className)}>
      <div
        className="flex h-11 items-center justify-between border-b-2 border-border px-4"
        style={{ background: taskbarBg }}
      >
        <div className="flex items-center gap-1.5">
          <span className="block h-3 w-3" style={{ background: "#ff5f57" }} />
          <span className="block h-3 w-3" style={{ background: "#ffbd2e" }} />
          <span className="block h-3 w-3" style={{ background: "#28c840" }} />
        </div>
        <span className="font-pixel text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
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
          <p className="mb-3 last:mb-0 leading-7">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-primary">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-muted-foreground">{children}</em>
        ),
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
          <h1 className="font-pixel mb-3 mt-4 text-xs uppercase tracking-[0.22em] text-primary">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-pixel mb-2.5 mt-3.5 text-[11px] uppercase tracking-[0.2em] text-primary/90">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-pixel mb-2 mt-3 text-[10px] uppercase tracking-[0.18em] text-primary/80">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-pixel mb-1.5 mt-2.5 text-[10px] uppercase tracking-[0.16em] text-primary/70">
            {children}
          </h4>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-7 text-foreground/90">{children}</li>
        ),
        hr: () => <hr className="my-4 border-t-2 border-primary/20" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/40 bg-primary/[0.04] py-2 pl-3 pr-2 italic text-muted-foreground">
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
                className="my-3"
              />
            )
          }

          return (
            <code className="rounded-none border border-border/60 bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-primary">
              {children}
            </code>
          )
        },
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto">
            <table className="w-full border-collapse border-2 border-border text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-secondary">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-border/40">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-border/40">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="border border-border/60 px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-[0.16em] text-primary">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border/40 px-3 py-2 text-foreground/90">
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
  emptyLabel,
  onOpenWorkspace,
}: {
  messages: UIMessage[]
  isBusy: boolean
  showThinking: boolean
  lastAssistantMessageId?: string
  loadingLabel: string
  emptyLabel: string
  onOpenWorkspace?: () => void
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
    <div ref={scrollViewportRef} className="flex-1 overflow-y-auto p-4 md:p-5">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-8 px-4 text-center">
          <div className="font-pixel text-6xl text-primary/30">&gt;_</div>
          <p className="font-pixel max-w-md text-sm uppercase leading-relaxed tracking-[0.2em] text-muted-foreground/70">
            {emptyLabel}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] border-2 px-4 py-3 md:max-w-[78%] ${
                  message.role === "user"
                    ? "border-primary/40 bg-primary/[0.06]"
                    : "border-border/70 bg-background/60"
                }`}
              >
                <span className="font-pixel mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {message.role === "user" ? "You" : "AI"}
                </span>
                <div className="space-y-3 font-pixel text-sm leading-7 text-foreground">
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

                      if (part.state === "input-available") {
                        return (
                          <div
                            key={`${message.id}-${index}`}
                            className="flex items-center gap-2 text-muted-foreground"
                          >
                            <span className="inline-block h-2 w-2 animate-pulse bg-primary" />
                            <span className="font-pixel text-[10px] uppercase tracking-[0.2em]">
                              {toolName}...
                            </span>
                          </div>
                        )
                      }

                      if (part.state === "output-available") {
                        return (
                          <div key={`${message.id}-${index}`}>
                            <ToolReceipt
                              toolName={toolName}
                              output={part.output}
                              onOpenWorkspace={onOpenWorkspace}
                            />
                          </div>
                        )
                      }

                      if (part.state === "output-error") {
                        return (
                          <div
                            key={`${message.id}-${index}`}
                            className="font-pixel text-[10px] uppercase tracking-[0.2em] text-destructive"
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
          ))}
          {showThinking ? (
            <div className="flex justify-start">
              <div className="max-w-[88%] border-2 border-border/70 bg-background/60 px-4 py-3 md:max-w-[78%]">
                <span className="font-pixel mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  AI
                </span>
                <div className="font-pixel text-sm leading-7 text-muted-foreground">
                  {loadingLabel}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
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
}) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const tokenEstimate = useMemo(
    () => estimateInputTokens(input),
    [estimateInputTokens, input],
  )

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || isBusy) return
    setInput("")
    textareaRef.current?.focus()
    await sendMessage({ text: value })
  }

  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault()
    stop()
  }

  // Derive status label
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

  // Token estimate display
  const tokenText = `${formatTokenCount(tokenEstimate.estimatedPromptTokens)} tokens`
  const riskText = locale === "zh" ? getRiskLabel(tokenEstimate.risk) : getRiskLabelEn(tokenEstimate.risk)
  const riskColor =
    tokenEstimate.risk === "high"
      ? "text-destructive"
      : tokenEstimate.risk === "medium"
        ? "text-amber-500"
        : "text-muted-foreground"

  return (
    <div className="shrink-0 border-t-2 border-border/60 bg-background/80 p-4 md:p-5">
      <div className="space-y-3">
        {error && errorLabel ? (
          <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-destructive">
            {errorLabel}
          </p>
        ) : null}
        {statusLabel && !error ? (
          <div className="flex items-center justify-between">
            <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-amber-500">
              {statusLabel}
            </p>
            <button
              onClick={handleStop}
              className="font-pixel text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline underline-offset-2 transition-colors hover:text-destructive"
            >
              {cancelLabel}
            </button>
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="min-h-[72px] flex-1 resize-none border-2 border-border/80 bg-background/90 px-4 py-3 text-sm focus-visible:border-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                void handleSubmit(e)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="h-11 shrink-0 px-6"
          >
            {isBusy ? loadingLabel : submitLabel}
          </Button>
        </form>
        <div className="flex items-center justify-between">
          <p className={cn("font-pixel text-[9px] uppercase tracking-[0.16em]", riskColor)}>
            {tokenText} | {riskText}
          </p>
        </div>
      </div>
    </div>
  )
})

/* ─── Chat thread view (isolated per thread) ─── */

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
  workspace,
  onOpenWorkspace,
  locale,
}: {
  thread: ChatThread
  onMessagesChange: (messages: UIMessage[]) => void
  workspace: ReturnType<typeof useThreadWorkspace>
  onOpenWorkspace?: () => void
  locale: string
}) {
  const t = useTranslations("ai")

  const { messages, sendMessage, stop, error, isBusy, slowPhase, estimateInputTokens } = useThreadChat({
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

  useWorkspaceSync({
    messages,
    workspace,
  })

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ChatMessagesViewport
        messages={messages}
        isBusy={isBusy}
        showThinking={showThinking}
        lastAssistantMessageId={lastAssistantMessageId}
        loadingLabel={t("loading")}
        emptyLabel={t("empty")}
        onOpenWorkspace={onOpenWorkspace}
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
        submitLabel={t("submit")}
        errorLabel={errorLabel}
        slowLabel={t("slowRequest")}
        verySlowLabel={t("verySlowRequest")}
        connectingLabel={t("connectingModel")}
        cancelLabel={t("cancel")}
        locale={locale}
      />
    </div>
  )
}

function FloatingWorkspaceHandle({
  isOpen,
  artifactCount,
  onToggle,
  ariaLabel,
}: {
  isOpen: boolean
  artifactCount: number
  onToggle: () => void
  ariaLabel: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const [position, setPosition] = useState<FloatingWorkspacePosition | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const suppressClickRef = useRef(false)
  const dragStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    origin: FloatingWorkspacePosition
    moved: boolean
  } | null>(null)

  const syncPositionToViewport = useCallback((nextPosition: FloatingWorkspacePosition) => {
    return clampFloatingWorkspacePosition(
      nextPosition,
      window.innerWidth,
      window.innerHeight,
    )
  }, [])

  useEffect(() => {
    const storedPosition = readStoredFloatingWorkspacePosition()
    const initialPosition = syncPositionToViewport(
      storedPosition ??
        getDefaultFloatingWorkspacePosition(window.innerWidth, window.innerHeight),
    )

    setPosition(initialPosition)

    const handleResize = () => {
      setPosition((current) =>
        syncPositionToViewport(
          current ??
            getDefaultFloatingWorkspacePosition(window.innerWidth, window.innerHeight),
        ),
      )
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [syncPositionToViewport])

  useEffect(() => {
    if (!position) return

    try {
      window.localStorage.setItem(
        WORKSPACE_FLOATING_HANDLE_STORAGE_KEY,
        JSON.stringify(position),
      )
    } catch {
      // Ignore storage write failures and keep the handle draggable for this session.
    }
  }, [position])

  const finishDragging = useCallback(
    (pointerId: number, target: HTMLButtonElement) => {
      const dragState = dragStateRef.current
      if (!dragState) return

      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId)
      }

      dragStateRef.current = null
      suppressClickRef.current = dragState.moved
      setIsDragging(false)
      setPosition((current) => {
        if (!current) return current

        return getSnappedFloatingWorkspacePosition(
          current,
          window.innerWidth,
          window.innerHeight,
        )
      })
    },
    [],
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || !position) return

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: position,
        moved: false,
      }
      suppressClickRef.current = false
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [position],
  )

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    if (!dragState.moved && Math.hypot(deltaX, deltaY) > 6) {
      dragState.moved = true
    }

    setPosition(
      clampFloatingWorkspacePosition(
        {
          x: dragState.origin.x + deltaX,
          y: dragState.origin.y + deltaY,
        },
        window.innerWidth,
        window.innerHeight,
      ),
    )
  }, [])

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      finishDragging(event.pointerId, event.currentTarget)
    },
    [finishDragging],
  )

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      finishDragging(event.pointerId, event.currentTarget)
    },
    [finishDragging],
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (suppressClickRef.current && event.detail !== 0) {
        suppressClickRef.current = false
        return
      }

      suppressClickRef.current = false
      onToggle()
    },
    [onToggle],
  )

  if (!position) {
    return null
  }

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={isOpen}
      title={ariaLabel}
      className={cn(
        "fixed left-0 top-0 z-30 flex select-none touch-none items-center justify-center border-2 border-border/70 bg-background/92 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden",
        "h-[52px] w-[52px]",
        isDragging
          ? "cursor-grabbing border-primary/70"
          : "cursor-grab transition-[border-color,background-color] duration-200 hover:border-primary/60 hover:bg-primary/[0.06]",
      )}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition:
          isDragging || prefersReducedMotion
            ? "none"
            : "transform 340ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease-out, background-color 200ms ease-out",
        willChange: isDragging ? "transform" : undefined,
      }}
    >
      <span
        className={cn(
          "pointer-events-none flex h-7 w-7 items-center justify-center text-sm leading-none transition-colors duration-200",
          isOpen ? "text-primary" : "text-foreground",
        )}
        aria-hidden="true"
      >
        ◈
      </span>
      {artifactCount > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[20px] items-center justify-center border border-primary/50 bg-primary px-1 font-pixel text-[9px] text-primary-foreground">
          {artifactCount > 99 ? "99+" : artifactCount}
        </span>
      ) : null}
    </button>
  )
}

/* ─── Helpers ─── */

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

/* ─── Main page ─── */

export default function AIPlayground() {
  const t = useTranslations("ai")
  const locale = useLocale()
  const {
    hydrated,
    threads,
    activeThreadId,
    createThread,
    deleteThread,
    updateThreadMessages,
    setActiveThread,
  } = useChatThreads()
  const { removeChat } = useGlobalChatRuntime()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopWorkspaceViewport, setDesktopWorkspaceViewport] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [workspaceOpenMobile, setWorkspaceOpenMobile] = useState(false)

  const activeThread = threads.find((t) => t.id === activeThreadId)

  const workspace = useThreadWorkspace(activeThreadId)

  useEffect(() => {
    const mediaQuery = window.matchMedia(WORKSPACE_DESKTOP_MEDIA_QUERY)
    const syncViewportMode = () => {
      setDesktopWorkspaceViewport(mediaQuery.matches)
    }

    syncViewportMode()

    mediaQuery.addEventListener("change", syncViewportMode)

    return () => {
      mediaQuery.removeEventListener("change", syncViewportMode)
    }
  }, [])

  useEffect(() => {
    if (desktopWorkspaceViewport) {
      setWorkspaceOpenMobile(false)
      return
    }

    setWorkspaceOpen(false)
  }, [desktopWorkspaceViewport])

  // Close workspace when switching threads
  useEffect(() => {
    setWorkspaceOpen(false)
    setWorkspaceOpenMobile(false)
  }, [activeThreadId])

  const handleOpenWorkspace = useCallback(() => {
    if (desktopWorkspaceViewport) {
      setWorkspaceOpen(true)
      return
    }

    setWorkspaceOpenMobile(true)
  }, [desktopWorkspaceViewport])

  const handleWorkspaceDrawerToggle = useCallback(() => {
    setWorkspaceOpenMobile((open) => !open)
  }, [])

  const handleActiveMessagesChange = useCallback(
    (msgs: UIMessage[]) => {
      if (!activeThreadId) return
      updateThreadMessages(activeThreadId, msgs)
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

  const artifactCount = workspace.artifacts.length

  return (
    <section className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-7xl flex-col px-4 pb-4 pt-6 md:px-8 md:pb-6 md:pt-8 lg:max-w-[92vw]">
      <header className="mb-4 flex items-start gap-3 md:items-center">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-border/60 bg-background/60 text-foreground transition-colors hover:border-primary/60 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hidden"
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

        <div className="min-w-0 flex-1 space-y-1.5 md:flex-none md:shrink-0">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h1 className="pixel-heading max-w-full text-balance break-words !tracking-[0.01em] text-[clamp(0.95rem,4.4vw,1.2rem)] leading-[1.35]">
            {t("title")}
          </h1>
          <p className="max-w-full font-pixel text-[12px] leading-6 tracking-[0.04em] text-muted-foreground sm:text-[13px] sm:leading-7">
            {t("description")}
          </p>
        </div>

        {/* Spacer */}
        <div className="hidden flex-1 md:block" />

        {/* Large-screen workspace toggle */}
        <button
          onClick={() => setWorkspaceOpen((s) => !s)}
          className="hidden h-10 items-center gap-2 border-2 border-border/60 bg-background/60 px-3 font-pixel text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/60 hover:bg-primary/[0.06] lg:inline-flex"
          aria-label={
            workspaceOpen
              ? t("closeWorkspace") ?? "Close workspace"
              : t("openWorkspace") ?? "Open workspace"
          }
          aria-expanded={workspaceOpen}
        >
          <span className="text-lg leading-none">◈</span>
          <span>{t("workspaceEyebrow")}</span>
          {artifactCount > 0 ? (
            <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center bg-primary px-1.5 font-pixel text-[9px] text-primary-foreground">
              {artifactCount}
            </span>
          ) : null}
        </button>
      </header>

      <div className="section-shell relative flex flex-1 flex-row overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          id="chat-sidebar"
          className={cn(
            "absolute inset-y-0 left-0 z-30 border-r-2 border-border/60 bg-background/95 backdrop-blur-sm transition-all duration-200 ease-out",
            "w-[min(280px,85vw)] md:static md:inset-auto md:w-[220px] md:translate-x-0 md:opacity-100 lg:w-[260px]",
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 md:opacity-100",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="shrink-0 border-b-2 border-border/60 p-3 md:p-4">
              <button
                onClick={() => {
                  createThread()
                  setSidebarOpen(false)
                }}
                className="flex w-full items-center justify-center gap-2 border-2 border-primary/50 bg-primary/[0.06] px-3 py-2.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary transition-colors hover:border-primary hover:bg-primary/[0.12]"
              >
                <span className="text-lg leading-none">+</span>
                <span>{t("newChat") ?? "New Chat"}</span>
              </button>
            </div>

            {/* Thread list */}
            <div className="flex-1 overflow-y-auto p-2.5 md:p-3">
              {!hydrated ? (
                <p className="font-pixel pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
                  Loading chats...
                </p>
              ) : threads.length === 0 ? (
                <p className="font-pixel pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                  {t("noChats") ?? "No conversations yet"}
                </p>
              ) : (
                <div className="space-y-2">
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`group relative border-2 transition-colors ${
                        thread.id === activeThreadId
                          ? "border-primary/60 bg-primary/[0.08]"
                          : "border-border/30 bg-background/30 hover:border-border/60 hover:bg-background/60"
                      }`}
                    >
                      <button
                        onClick={() => {
                          setActiveThread(thread.id)
                          setSidebarOpen(false)
                        }}
                        className="w-full px-3 py-2.5 text-left"
                      >
                        <p className="font-pixel truncate text-[11px] uppercase tracking-[0.12em] text-foreground">
                          {thread.title}
                        </p>
                        <p className="font-pixel mt-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                          {formatRelativeTime(thread.updatedAt, locale)}
                        </p>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteThread(thread.id)
                        }}
                        className="absolute right-2 top-1/2 inline-block -translate-y-1/2 px-1.5 py-0.5 font-pixel text-sm leading-none text-muted-foreground/40 transition-colors hover:text-destructive md:hidden"
                        aria-label={t("deleteChat") ?? "Delete chat"}
                        title={t("deleteChat") ?? "Delete chat"}
                      >
                        ×
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteThread(thread.id)
                        }}
                        className="absolute right-2 top-1/2 hidden -translate-y-1/2 px-1.5 py-0.5 font-pixel text-sm leading-none text-muted-foreground/40 transition-colors hover:text-destructive md:group-hover:inline-block"
                        aria-label={t("deleteChat") ?? "Delete chat"}
                        title={t("deleteChat") ?? "Delete chat"}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thread count footer */}
            <div className="shrink-0 border-t border-border/40 px-3 py-2">
              <p className="font-pixel text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
                {hydrated ? threads.length : 0}{" "}
                {threads.length === 1
                  ? t("chatSingular") ?? "chat"
                  : t("chatPlural") ?? "chats"}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile overlay for sidebar */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-20 touch-none bg-background/80 backdrop-blur-sm transition-opacity duration-200 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Chat area (main, always full width on mobile) ── */}
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="h-full">
            {!hydrated ? (
              <div className="flex h-full items-center justify-center">
                <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/40">
                  Loading chats...
                </p>
              </div>
            ) : activeThread ? (
              <ChatThreadView
                key={activeThread.id}
                thread={activeThread}
                onMessagesChange={handleActiveMessagesChange}
                workspace={workspace}
                onOpenWorkspace={handleOpenWorkspace}
                locale={locale}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
                  {t("noChats") ?? "No conversations yet"}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* ── Large-screen Workspace Panel (collapsible) ── */}
        <aside
          className={cn(
            "hidden flex-col overflow-hidden border-l-2 border-border/60 bg-background/40 transition-all duration-300 ease-out lg:flex",
            workspaceOpen
              ? "w-[420px] border-opacity-100 opacity-100"
              : "w-0 border-opacity-0 opacity-0",
          )}
        >
          {workspaceOpen && activeThread ? (
            <WorkspacePanel
              threadTitle={activeThread.title}
              artifacts={workspace.artifacts}
              activeArtifactId={workspace.activeArtifactId}
              activeArtifact={workspace.activeArtifact}
              pendingIntent={workspace.pendingIntent}
              onSelectArtifact={workspace.setActiveArtifact}
              onClearWorkspace={workspace.clearWorkspace}
              isBusy={Boolean(workspace.pendingIntent)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/30">
                {t("workspaceClosed") ?? "Workspace closed"}
              </p>
            </div>
          )}
        </aside>

        {/* ── Mobile + Tablet Workspace Drawer ── */}
        {workspaceOpenMobile && (
          <>
            <div
              className="fixed inset-x-0 bottom-0 top-14 z-40 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden"
              onClick={() => setWorkspaceOpenMobile(false)}
              aria-hidden="true"
            />
            <div className="fixed right-0 top-14 z-50 flex h-[calc(100svh-3.5rem)] w-[min(420px,88vw)] flex-col border-l-2 border-border/60 bg-background/95 lg:hidden md:w-[min(460px,64vw)]">
              <button
                onClick={() => setWorkspaceOpenMobile(false)}
                className="absolute left-3 top-3 z-10 px-1.5 py-0.5 font-pixel text-sm leading-none text-muted-foreground/40 transition-colors hover:text-destructive"
                aria-label={t("closeWorkspace") ?? "Close workspace"}
                title={t("closeWorkspace") ?? "Close workspace"}
              >
                ×
              </button>
              <div className="box-border h-full pt-10">
                {activeThread ? (
                  <WorkspacePanel
                    threadTitle={activeThread.title}
                    artifacts={workspace.artifacts}
                    activeArtifactId={workspace.activeArtifactId}
                    activeArtifact={workspace.activeArtifact}
                    pendingIntent={workspace.pendingIntent}
                    onSelectArtifact={workspace.setActiveArtifact}
                    onClearWorkspace={workspace.clearWorkspace}
                    isBusy={Boolean(workspace.pendingIntent)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
                      {t("workspaceEmpty") ?? "Workspace is empty"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Mobile + tablet floating workspace handle ── */}
      <FloatingWorkspaceHandle
        isOpen={workspaceOpenMobile}
        artifactCount={artifactCount}
        onToggle={handleWorkspaceDrawerToggle}
        ariaLabel={
          workspaceOpenMobile
            ? t("closeWorkspace") ?? "Close workspace"
            : t("openWorkspace") ?? "Open workspace"
        }
      />
    </section>
  )
}
