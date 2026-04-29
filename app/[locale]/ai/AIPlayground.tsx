"use client"

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { isToolUIPart, type UIMessage } from "ai"
import ReactMarkdown from "react-markdown"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { useTranslations } from "next-intl"
import { useTheme } from "@/app/hooks/useTheme"
import { useChatThreads, type ChatThread } from "@/app/hooks/useChatThreads"
import { useThreadChat } from "@/app/hooks/useThreadChat"
import { useGlobalChatRuntime } from "@/app/context/GlobalChatRuntimeContext"
import {
  useThreadWorkspace,
  removeWorkspaceForThread,
} from "@/app/hooks/useThreadWorkspace"
import { cn } from "@/lib/utils"
import { ClientComponent } from "@/app/packages/ClientComponent"
import WorkspacePanel from "@/app/components/ai-workspace/WorkspacePanel"
import PixelMenuIcon from "@/app/components/system/PixelMenuIcon"
import type { WorkspaceArtifactPayload } from "@/app/types/ai-workspace"

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

const CODE_LANGUAGE_ALIAS_MAP: Record<string, string> = {
  shell: "bash",
  zsh: "bash",
  env: "bash",
  yml: "yaml",
  md: "markdown",
}

/* ─── Tool name helper ─── */

function getToolName(part: { type: string; toolName?: string }): string {
  const toolPrefix = "tool-"
  if (part.type === "dynamic-tool" && part.toolName) {
    return part.toolName
  }
  if (part.type.startsWith(toolPrefix)) {
    return part.type.slice(toolPrefix.length)
  }
  return part.type
}

/* ─── Lightweight tool receipt ─── */

const TOOL_RECEIPTS: Record<string, string> = {
  get_profile_summary: "Generated profile card",
  list_projects: "Generated project grid",
  search_articles: "Generated article summary",
  build_ui_block: "Generated artifact",
}

function ToolReceipt({ toolName, output }: { toolName: string; output: unknown }) {
  const data = output as Record<string, unknown>
  const summary = (data.summary as string) || TOOL_RECEIPTS[toolName] || "Done"

  return (
    <div className="flex items-center gap-2 py-1 text-primary/80">
      <span className="inline-block h-2 w-2 bg-primary" />
      <span className="font-pixel text-[10px] uppercase tracking-[0.2em]">
        {summary}
      </span>
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
}: {
  messages: UIMessage[]
  isBusy: boolean
  showThinking: boolean
  lastAssistantMessageId?: string
  loadingLabel: string
  emptyLabel: string
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
  isBusy,
  error,
  placeholder,
  loadingLabel,
  submitLabel,
  errorLabel,
}: {
  sendMessage: (message: { text: string }) => Promise<void>
  isBusy: boolean
  error?: Error | undefined
  placeholder: string
  loadingLabel: string
  submitLabel: string
  errorLabel: string
}) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || isBusy) return
    setInput("")
    textareaRef.current?.focus()
    await sendMessage({ text: value })
  }

  return (
    <div className="shrink-0 border-t-2 border-border/60 bg-background/80 p-4 md:p-5">
      <div className="space-y-3">
        {error ? (
          <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-destructive">
            {errorLabel}
          </p>
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
      </div>
    </div>
  )
})

/* ─── Workspace sync helpers ─── */

function extractArtifactPayload(output: unknown): WorkspaceArtifactPayload | null {
  const data = output as Record<string, unknown>
  const artifactType = (data.artifactType || data.blockType) as string
  if (!artifactType) return null

  return {
    artifactType: artifactType as WorkspaceArtifactPayload["artifactType"],
    operation: (data.operation as WorkspaceArtifactPayload["operation"]) || "append",
    title: (data.title as string) || undefined,
    summary: (data.summary as string) || undefined,
    focus: (data.focus as boolean) ?? true,
    artifactId: (data.artifactId as string) || undefined,
    data: (data.data as Record<string, unknown>) ?? {},
  }
}

/* ─── Chat thread view (isolated per thread) ─── */

function ChatThreadView({
  thread,
  onMessagesChange,
  workspaceActions,
  workspaceArtifacts,
}: {
  thread: ChatThread
  onMessagesChange: (messages: UIMessage[]) => void
  workspaceActions: ReturnType<typeof useThreadWorkspace>
  workspaceArtifacts: ReturnType<typeof useThreadWorkspace>["artifacts"]
}) {
  const t = useTranslations("ai")

  const { messages, sendMessage, status, error, isBusy } = useThreadChat({
    threadId: thread.id,
    initialMessages: thread.messages,
    onMessagesPersist: onMessagesChange,
  })

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

  /* Sync tool outputs to workspace */
  const processedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    processedRef.current = new Set(
      workspaceArtifacts
        .map((a) => a.sourceMessageId)
        .filter(Boolean) as string[],
    )
  }, [thread.id, workspaceArtifacts])

  useEffect(() => {
    messages.forEach((message) => {
      if (message.role !== "assistant") return
      message.parts.forEach((part, partIndex) => {
        if (!isToolUIPart(part)) return
        if (part.state !== "output-available") return

        const toolName = getToolName(part)
        const sourceId = `${message.id}-${partIndex}`
        if (processedRef.current.has(sourceId)) return

        /* build_ui_block — new protocol */
        if (toolName === "build_ui_block") {
          const payload = extractArtifactPayload(part.output)
          if (!payload) return

          processedRef.current.add(sourceId)

          const artifactBase = {
            type: payload.artifactType,
            title: payload.title,
            data: payload.data,
            status: "ready" as const,
            sourceMessageId: sourceId,
            summary: payload.summary,
          }

          if (payload.operation === "append") {
            workspaceActions.addArtifact(artifactBase)
          } else if (payload.operation === "replace") {
            const existing = workspaceArtifacts.find(
              (a) => a.type === payload.artifactType,
            )
            if (existing) {
              workspaceActions.updateArtifact(existing.id, {
                data: payload.data,
                title: payload.title ?? existing.title,
                status: "ready",
                sourceMessageId: sourceId,
                summary: payload.summary ?? existing.summary,
              })
            } else {
              workspaceActions.addArtifact(artifactBase)
            }
          } else if (payload.operation === "update") {
            const targetId = payload.artifactId
            if (targetId) {
              const existing = workspaceArtifacts.find((a) => a.id === targetId)
              if (existing) {
                workspaceActions.updateArtifact(targetId, {
                  data: payload.data,
                  title: payload.title ?? existing.title,
                  status: "ready",
                  sourceMessageId: sourceId,
                  summary: payload.summary ?? existing.summary,
                })
              } else {
                workspaceActions.addArtifact(artifactBase)
              }
            } else {
              const existing = workspaceArtifacts.find(
                (a) => a.type === payload.artifactType,
              )
              if (existing) {
                workspaceActions.updateArtifact(existing.id, {
                  data: payload.data,
                  title: payload.title ?? existing.title,
                  status: "ready",
                  sourceMessageId: sourceId,
                  summary: payload.summary ?? existing.summary,
                })
              } else {
                workspaceActions.addArtifact(artifactBase)
              }
            }
          }
          return
        }

        /* Legacy tools — route to workspace as artifacts too */
        if (toolName === "get_profile_summary") {
          processedRef.current.add(sourceId)
          const existing = workspaceArtifacts.find((a) => a.type === "profile-card")
          if (existing) {
            workspaceActions.updateArtifact(existing.id, {
              data: part.output as Record<string, unknown>,
              status: "ready",
              sourceMessageId: sourceId,
            })
          } else {
            workspaceActions.addArtifact({
              type: "profile-card",
              title: "Profile Summary",
              data: part.output as Record<string, unknown>,
              status: "ready",
              sourceMessageId: sourceId,
              summary: "Generated profile card",
            })
          }
          return
        }

        if (toolName === "list_projects") {
          processedRef.current.add(sourceId)
          const existing = workspaceArtifacts.find((a) => a.type === "project-grid")
          if (existing) {
            workspaceActions.updateArtifact(existing.id, {
              data: { projects: Array.isArray(part.output) ? part.output : [] },
              status: "ready",
              sourceMessageId: sourceId,
            })
          } else {
            workspaceActions.addArtifact({
              type: "project-grid",
              title: "Projects",
              data: { projects: Array.isArray(part.output) ? part.output : [] },
              status: "ready",
              sourceMessageId: sourceId,
              summary: "Generated project grid",
            })
          }
          return
        }

        if (toolName === "search_articles") {
          processedRef.current.add(sourceId)
          const existing = workspaceArtifacts.find((a) => a.type === "article-summary")
          if (existing) {
            workspaceActions.updateArtifact(existing.id, {
              data: { articles: Array.isArray(part.output) ? part.output : [] },
              status: "ready",
              sourceMessageId: sourceId,
            })
          } else {
            workspaceActions.addArtifact({
              type: "article-summary",
              title: "Articles",
              data: { articles: Array.isArray(part.output) ? part.output : [] },
              status: "ready",
              sourceMessageId: sourceId,
              summary: "Generated article summary",
            })
          }
          return
        }
      })
    })
  }, [messages, workspaceActions, workspaceArtifacts, thread.id])

  /* Mark artifacts as updating when busy */
  useEffect(() => {
    if (!isBusy) return
    const lastArtifact = workspaceArtifacts[workspaceArtifacts.length - 1]
    if (!lastArtifact) return
    if (lastArtifact.status === "updating") return
    workspaceActions.setArtifactStatus(lastArtifact.id, "updating")
  }, [isBusy, workspaceActions, workspaceArtifacts])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ChatMessagesViewport
        messages={messages}
        isBusy={isBusy}
        showThinking={showThinking}
        lastAssistantMessageId={lastAssistantMessageId}
        loadingLabel={t("loading")}
        emptyLabel={t("empty")}
      />
      <ChatComposer
        sendMessage={sendMessage}
        isBusy={isBusy}
        error={error}
        placeholder={t("textPromptPlaceholder")}
        loadingLabel={t("loading")}
        submitLabel={t("submit")}
        errorLabel={t("errorGeneric")}
      />
    </div>
  )
}

/* ─── Helpers ─── */

function formatRelativeTime(ts: number): string {
  const now = Date.now()
  const diff = now - ts
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

/* ─── Main page ─── */

export default function AIPlayground() {
  const t = useTranslations("ai")
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
  const [mobileTab, setMobileTab] = useState<"chat" | "workspace">("chat")

  const activeThread = threads.find((t) => t.id === activeThreadId)

  const workspace = useThreadWorkspace(activeThreadId)

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

  return (
    <section className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-7xl flex-col px-4 pb-4 pt-6 md:px-8 md:pb-6 md:pt-8 lg:max-w-[92vw]">
      <header className="mb-4 flex items-center gap-3">
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

        <div className="shrink-0 space-y-1.5">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h1 className="pixel-heading !tracking-[0.01em] text-[clamp(0.9rem,1.6vw,1.2rem)]">
            {t("title")}
          </h1>
          <p className="font-pixel text-[13px] leading-7 tracking-[0.04em] text-muted-foreground">
            {t("description")}
          </p>
        </div>
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
                          setMobileTab("chat")
                        }}
                        className="w-full px-3 py-2.5 text-left"
                      >
                        <p className="font-pixel truncate text-[11px] uppercase tracking-[0.12em] text-foreground">
                          {thread.title}
                        </p>
                        <p className="font-pixel mt-1 text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                          {formatRelativeTime(thread.updatedAt)}
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

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-20 touch-none bg-background/80 backdrop-blur-sm transition-opacity duration-200 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile tabs ── */}
        <div className="absolute left-0 right-0 top-0 z-10 flex border-b-2 border-border/60 bg-background/95 md:hidden">
          <button
            onClick={() => setMobileTab("chat")}
            className={cn(
              "flex-1 border-b-2 px-3 py-2.5 font-pixel text-[10px] uppercase tracking-[0.16em] transition-colors",
              mobileTab === "chat"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground",
            )}
          >
            {t("chatTab") ?? "Chat"}
          </button>
          <button
            onClick={() => setMobileTab("workspace")}
            className={cn(
              "flex-1 border-b-2 px-3 py-2.5 font-pixel text-[10px] uppercase tracking-[0.16em] transition-colors",
              mobileTab === "workspace"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground",
            )}
          >
            {t("workspaceTab") ?? "Workspace"}
            {workspace.artifacts.length > 0 ? (
              <span className="ml-1.5 inline-block h-4 min-w-[16px] bg-primary px-1 text-center text-[9px] leading-4 text-primary-foreground">
                {workspace.artifacts.length}
              </span>
            ) : null}
          </button>
        </div>

        {/* ── Chat area ── */}
        <main
          className={cn(
            "relative flex flex-col overflow-hidden md:flex-[5]",
            mobileTab === "chat" ? "flex" : "hidden md:flex",
          )}
        >
          <div className="pt-[44px] md:pt-0 h-full">
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
                workspaceActions={workspace}
                workspaceArtifacts={workspace.artifacts}
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

        {/* ── Workspace area ── */}
        <div
          className={cn(
            "relative flex-col overflow-hidden md:flex md:flex-[7]",
            mobileTab === "workspace" ? "flex" : "hidden",
          )}
        >
          <div className="pt-[44px] md:pt-0 h-full">
            {!hydrated ? (
              <div className="flex h-full items-center justify-center">
                <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/40">
                  Loading workspace...
                </p>
              </div>
            ) : activeThread ? (
              <WorkspacePanel
                threadTitle={activeThread.title}
                artifacts={workspace.artifacts}
                activeArtifactId={workspace.activeArtifactId}
                activeArtifact={workspace.activeArtifact}
                onSelectArtifact={workspace.setActiveArtifact}
                onClearWorkspace={workspace.clearWorkspace}
                isBusy={false}
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
      </div>
    </section>
  )
}
