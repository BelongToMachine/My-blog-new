"use client"

import React, { useEffect, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, isToolUIPart } from "ai"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { useTranslations } from "next-intl"
import {
  ProfileCardBlock,
  ProjectGridBlock,
  ArticleSummaryBlock,
  TimelineBlock,
  ComparisonTableBlock,
} from "@/app/components/ai-blocks"

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
      return <ProfileCardBlock title="Profile" data={data} />
    case "list_projects":
      return (
        <ProjectGridBlock
          title="Projects"
          data={{ projects: Array.isArray(output) ? output : [] }}
        />
      )
    case "search_articles":
      return (
        <ArticleSummaryBlock
          title="Articles"
          data={{ articles: Array.isArray(output) ? output : [] }}
        />
      )
    case "build_ui_block": {
      const blockType = data.blockType as string
      const blockData = (data.data as Record<string, unknown>) ?? {}
      const blockTitle = (data.title as string) || undefined

      switch (blockType) {
        case "profile-card":
          return <ProfileCardBlock title={blockTitle} data={blockData} />
        case "project-grid":
          return <ProjectGridBlock title={blockTitle} data={blockData} />
        case "article-summary":
          return <ArticleSummaryBlock title={blockTitle} data={blockData} />
        case "timeline":
          return <TimelineBlock title={blockTitle} data={blockData} />
        case "comparison-table":
          return <ComparisonTableBlock title={blockTitle} data={blockData} />
        default:
          return null
      }
    }
    default:
      return null
  }
}

export default function AIPlayground() {
  const t = useTranslations("ai")
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
    }),
  })

  useEffect(() => {
    const viewport = scrollViewportRef.current

    if (!viewport) {
      return
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const isBusy = status === "submitted" || status === "streaming"

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = input.trim()

    if (!value || isBusy) {
      return
    }

    await sendMessage({ text: value })
    setInput("")
    textareaRef.current?.focus()
  }

  return (
    <section className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-6xl flex-col px-4 pb-4 pt-6 md:px-8 md:pb-6 md:pt-8 lg:max-w-[80vw]">
      <header className="mb-4 shrink-0 space-y-1.5">
        <p className="section-kicker">{t("eyebrow")}</p>
        <h1 className="pixel-heading text-[clamp(0.9rem,1.6vw,1.2rem)]">
          {t("title")}
        </h1>
        <p className="font-pixel text-[13px] leading-7 tracking-[0.08em] text-muted-foreground">
          {t("description")}
        </p>
      </header>

      <div className="section-shell flex flex-1 flex-col overflow-hidden">
        {/* Message list */}
        <div ref={scrollViewportRef} className="flex-1 overflow-y-auto p-4 md:p-5">
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
                            <span key={`${message.id}-${index}`}>{part.text}</span>
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
    </section>
  )
}
