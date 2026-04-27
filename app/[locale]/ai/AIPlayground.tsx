"use client"

import React, { useRef, useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { useTranslations } from "next-intl"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function AIPlayground() {
  const t = useTranslations("ai")
  const [input, setInput] = useState("")
  const [messages] = useState<Message[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!input.trim()) return
    // UI placeholder — functionality to be implemented later
    setInput("")
    textareaRef.current?.focus()
  }

  return (
    <section className="mx-auto flex h-[calc(100svh-3.5rem)] max-w-3xl flex-col px-4 pb-4 pt-6 md:px-6 md:pb-6 md:pt-8">
      <header className="mb-5 shrink-0 space-y-2">
        <p className="section-kicker">{t("eyebrow")}</p>
        <h1 className="pixel-heading text-[clamp(1.2rem,3vw,1.8rem)]">
          {t("title")}
        </h1>
        <p className="section-copy max-w-xl">{t("description")}</p>
      </header>

      <div className="section-shell flex flex-1 flex-col overflow-hidden">
        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-4 text-center">
              <div className="font-pixel text-3xl text-primary/30">&gt;_</div>
              <p className="font-pixel max-w-sm text-[10px] uppercase leading-relaxed tracking-[0.24em] text-muted-foreground/70">
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
                    <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t-2 border-border/60 bg-background/80 p-4 md:p-5">
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
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={!input.trim()}
              className="h-11 shrink-0 px-6"
            >
              {t("submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
