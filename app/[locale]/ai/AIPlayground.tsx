"use client"

import React, { useEffect, useRef, useState } from "react"
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
  ProfileCardBlock,
  ProjectGridBlock,
  ArticleSummaryBlock,
  TimelineBlock,
  ComparisonTableBlock,
} from "@/app/components/ai-blocks"
import { CodeBlocker } from "@/app/packages/Screen"

/* ─── Generative UI wrapper ─── */

function GenerativeUIBorder({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="relative border-l-4 border-l-primary bg-primary/[0.03] py-3 pl-4 pr-3 dark:bg-primary/[0.06]">
      <p className="font-pixel mb-2 text-[9px] uppercase tracking-[0.2em] text-primary/70">
        {label}
      </p>
      {children}
    </div>
  )
}

/* ─── Tool renderer ─── */

function ToolOutputRenderer({
  toolName,
  output,
}: {
  toolName: string
  output: unknown
}) {
  const data = output as Record<string, unknown>

  switch (toolName) {
    case "get_profile_summary":
      return (
        <GenerativeUIBorder label="Generated Profile">
          <ProfileCardBlock data={data} />
        </GenerativeUIBorder>
      )
    case "list_projects":
      return (
        <GenerativeUIBorder label="Generated Projects">
          <ProjectGridBlock
            data={{ projects: Array.isArray(output) ? output : [] }}
          />
        </GenerativeUIBorder>
      )
    case "search_articles":
      return (
        <GenerativeUIBorder label="Generated Articles">
          <ArticleSummaryBlock
            data={{ articles: Array.isArray(output) ? output : [] }}
          />
        </GenerativeUIBorder>
      )
    case "build_ui_block": {
      const blockType = data.blockType as string
      const blockData = (data.data as Record<string, unknown>) ?? {}
      const blockTitle = (data.title as string) || undefined

      switch (blockType) {
        case "profile-card":
          return (
            <GenerativeUIBorder label="Generated Profile">
              <ProfileCardBlock title={blockTitle} data={blockData} />
            </GenerativeUIBorder>
          )
        case "project-grid":
          return (
            <GenerativeUIBorder label="Generated Projects">
              <ProjectGridBlock title={blockTitle} data={blockData} />
            </GenerativeUIBorder>
          )
        case "article-summary":
          return (
            <GenerativeUIBorder label="Generated Articles">
              <ArticleSummaryBlock title={blockTitle} data={blockData} />
            </GenerativeUIBorder>
          )
        case "timeline":
          return (
            <GenerativeUIBorder label="Generated Timeline">
              <TimelineBlock title={blockTitle} data={blockData} />
            </GenerativeUIBorder>
          )
        case "comparison-table":
          return (
            <GenerativeUIBorder label="Generated Comparison">
              <ComparisonTableBlock title={blockTitle} data={blockData} />
            </GenerativeUIBorder>
          )
        default:
          return null
      }
    }
    default:
      return null
  }
}

/* ─── Markdown renderer for assistant text ─── */

function MarkdownRenderer({ text }: { text: string }) {
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
        hr: () => (
          <hr className="my-4 border-t-2 border-primary/20" />
        ),
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
              <CodeBlocker
                code={code}
                colorMode={colorMode}
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

/* ─── Chat thread view (isolated per thread) ─── */

function ChatThreadView({
  thread,
  onMessagesChange,
}: {
  thread: ChatThread
  onMessagesChange: (messages: UIMessage[]) => void
}) {
  const t = useTranslations("ai")
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollViewportRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error, isBusy } = useThreadChat({
    threadId: thread.id,
    initialMessages: thread.messages,
    onMessagesPersist: onMessagesChange,
  })

  useEffect(() => {
    const viewport = scrollViewportRef.current
    if (!viewport) return
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || isBusy) return
    await sendMessage({ text: value })
    setInput("")
    textareaRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Message list */}
      <div
        ref={scrollViewportRef}
        className="flex-1 overflow-y-auto p-4 md:p-5"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-8 px-4 text-center">
            <div className="font-pixel text-6xl text-primary/30">&gt;_</div>
            <p className="font-pixel max-w-md text-sm uppercase leading-relaxed tracking-[0.2em] text-muted-foreground/70">
              {t("empty")}
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
                          <MarkdownRenderer
                            key={`${message.id}-${index}`}
                            text={part.text}
                          />
                        )
                      }

                      if (isToolUIPart(part)) {
                        const toolPrefix = "tool-"
                        const toolName =
                          part.type === "dynamic-tool"
                            ? part.toolName
                            : part.type.startsWith(toolPrefix)
                              ? part.type.slice(toolPrefix.length)
                              : part.type

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
                              <ToolOutputRenderer
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
            {isBusy ? (
              <div className="flex justify-start">
                <div className="max-w-[88%] border-2 border-border/70 bg-background/60 px-4 py-3 md:max-w-[78%]">
                  <span className="font-pixel mb-2 block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    AI
                  </span>
                  <div className="font-pixel text-sm leading-7 text-muted-foreground">
                    {t("loading")}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t-2 border-border/60 bg-background/80 p-4 md:p-5">
        <div className="space-y-3">
          {error ? (
            <p className="font-pixel text-[10px] uppercase tracking-[0.2em] text-destructive">
              {t("errorGeneric")}
            </p>
          ) : null}
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("textPromptPlaceholder")}
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
              {isBusy ? t("loading") : t("submit")}
            </Button>
          </form>
        </div>
      </div>
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
    threads,
    activeThreadId,
    createThread,
    deleteThread,
    updateThreadMessages,
    setActiveThread,
  } = useChatThreads()
  const { removeChat } = useGlobalChatRuntime()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const activeThread = threads.find((t) => t.id === activeThreadId)

  return (
    <section className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-7xl flex-col px-4 pb-4 pt-6 md:px-8 md:pb-6 md:pt-8 lg:max-w-[92vw]">
      <header className="mb-4 flex items-start justify-between">
        <div className="shrink-0 space-y-1.5">
          <p className="section-kicker">{t("eyebrow")}</p>
          <h1 className="pixel-heading !tracking-[0.01em] text-[clamp(0.9rem,1.6vw,1.2rem)]">
            {t("title")}
          </h1>
          <p className="font-pixel text-[13px] leading-7 tracking-[0.04em] text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="shrink-0 border-2 border-border/60 bg-background/60 px-3 py-2 font-pixel text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary/60 hover:bg-primary/[0.06] md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? "Close" : "Chats"}
        </button>
      </header>

      <div className="section-shell relative flex flex-1 flex-row overflow-hidden">
        {/* ── Sidebar ── */}
        <aside
          className={`${
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          } absolute inset-y-0 left-0 z-30 w-[260px] border-r-2 border-border/60 bg-background/95 backdrop-blur-sm transition-all duration-200 ease-out md:static md:inset-auto md:w-[220px] md:translate-x-0 md:opacity-100 lg:w-[260px]`}
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
              {threads.length === 0 ? (
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
                          {formatRelativeTime(thread.updatedAt)}
                        </p>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeChat(thread.id)
                          deleteThread(thread.id)
                        }}
                        className="absolute right-2 top-1/2 hidden -translate-y-1/2 px-1.5 py-0.5 font-pixel text-sm leading-none text-muted-foreground/40 transition-colors hover:text-destructive group-hover:inline-block"
                        aria-label="Delete chat"
                        title="Delete chat"
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
                {threads.length}{" "}
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
            className="absolute inset-0 z-20 bg-background/60 backdrop-blur-[2px] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Chat area ── */}
        <main className="relative flex flex-1 flex-col overflow-hidden">
          {activeThread ? (
            <ChatThreadView
              key={activeThread.id}
              thread={activeThread}
              onMessagesChange={(msgs) =>
                updateThreadMessages(activeThread.id, msgs)
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="font-pixel text-sm uppercase tracking-[0.2em] text-muted-foreground/50">
                {t("noChats") ?? "No conversations yet"}
              </p>
            </div>
          )}
        </main>
      </div>
    </section>
  )
}
