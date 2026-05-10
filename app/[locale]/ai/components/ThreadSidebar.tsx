"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Input } from "@/app/components/ui/input"
import type { ChatThread } from "@/app/hooks/useChatThreads"
import { cn } from "@/lib/utils"
import { deriveThreadDisplayTitle } from "../threadDisplay"

interface ThreadSidebarProps {
  activeThreadId: string | null
  hydrated: boolean
  locale: string
  threads: ChatThread[]
  onCreateThread: () => void
  onDeleteThread: (id: string) => void
  onSelectThread: (id: string) => void
  formatRelativeTime: (ts: number, locale: string) => string
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase()
}

export default function ThreadSidebar({
  activeThreadId,
  hydrated,
  locale,
  threads,
  onCreateThread,
  onDeleteThread,
  onSelectThread,
  formatRelativeTime,
}: ThreadSidebarProps) {
  const t = useTranslations("ai")
  const [query, setQuery] = useState("")

  const displayLabels = useMemo(
    () => ({
      defaultTitle: t("defaultChatTitle"),
      greetingTitle: t("greetingChatTitle"),
      aboutJieTitle: t("aboutJieChatTitle"),
    }),
    [t],
  )

  const preparedThreads = useMemo(
    () =>
      threads.map((thread) => ({
        thread,
        displayTitle: deriveThreadDisplayTitle(thread, displayLabels),
      })),
    [displayLabels, threads],
  )

  const filteredThreads = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query)
    if (!normalizedQuery) return preparedThreads

    return preparedThreads.filter(({ thread, displayTitle }) =>
      [displayTitle, thread.title, thread.summary]
        .map((value) => normalizeSearchValue(value ?? ""))
        .some((value) => value.includes(normalizedQuery)),
    )
  }, [preparedThreads, query])

  const showSearch = threads.length >= 6

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 space-y-3 border-b-2 border-border/60 p-3 md:p-4">
        <button
          onClick={onCreateThread}
          className="flex w-full items-center justify-center gap-2 border-2 border-primary/50 bg-primary/[0.06] px-3 py-2.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-primary transition-colors hover:border-primary hover:bg-primary/[0.12]"
        >
          <span className="text-lg leading-none">+</span>
          <span>{t("newChat") ?? "New Chat"}</span>
        </button>

        {showSearch ? (
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchChatsPlaceholder")}
            className="h-10 border-2 border-border/60 bg-background/70 font-pixel text-[10px] tracking-[0.14em] placeholder:font-pixel placeholder:text-muted-foreground/38 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 md:p-3">
        {!hydrated ? (
          <p className="font-pixel pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
            {t("loadingChats")}
          </p>
        ) : filteredThreads.length === 0 ? (
          <p className="font-pixel pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
            {query.trim() ? t("noMatchingChats") : t("noChats")}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredThreads.map(({ thread, displayTitle }) => {
              const isActive = thread.id === activeThreadId

              return (
                <div
                  key={thread.id}
                  className={cn(
                    "group relative overflow-hidden border-2 transition-[border-color,background-color] duration-200",
                    isActive
                      ? "border-primary/65 bg-primary/[0.1]"
                      : "border-border/30 bg-background/30 hover:border-border/60 hover:bg-background/60",
                  )}
                >
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[3px] bg-primary"
                    />
                  ) : null}

                  <button
                    onClick={() => onSelectThread(thread.id)}
                    className="w-full px-4 py-2.5 pr-9 text-left"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <p
                      className={cn(
                        "truncate font-pixel text-[11px] tracking-[0.06em]",
                        isActive ? "text-foreground" : "text-foreground/90",
                      )}
                    >
                      {displayTitle}
                    </p>
                    <p
                      className={cn(
                        "mt-1 font-pixel text-[9px] uppercase tracking-[0.16em]",
                        isActive ? "text-primary/82" : "text-muted-foreground/48",
                      )}
                    >
                      {formatRelativeTime(thread.updatedAt, locale)}
                    </p>
                  </button>

                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      onDeleteThread(thread.id)
                    }}
                    className="absolute right-2 top-1/2 inline-block -translate-y-1/2 px-1.5 py-0.5 font-pixel text-sm leading-none text-muted-foreground/40 transition-colors hover:text-destructive md:hidden"
                    aria-label={t("deleteChat") ?? "Delete chat"}
                    title={t("deleteChat") ?? "Delete chat"}
                  >
                    ×
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      onDeleteThread(thread.id)
                    }}
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 px-1.5 py-0.5 font-pixel text-sm leading-none text-muted-foreground/40 transition-colors hover:text-destructive md:group-hover:inline-block"
                    aria-label={t("deleteChat") ?? "Delete chat"}
                    title={t("deleteChat") ?? "Delete chat"}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border/40 px-3 py-2">
        <p className="font-pixel text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
          {hydrated ? threads.length : 0}{" "}
          {threads.length === 1
            ? t("chatSingular") ?? "chat"
            : t("chatPlural") ?? "chats"}{" "}
          · {t("autoSaved")}
        </p>
      </div>
    </div>
  )
}
