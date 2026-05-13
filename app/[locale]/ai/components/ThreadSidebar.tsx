"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
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

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border/35 p-3 md:p-4">
        <button
          onClick={onCreateThread}
          className="flex w-full items-center justify-center gap-2 border border-border/45 bg-background/72 px-3 py-2.5 font-pixel text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary/55 hover:text-primary"
        >
          <span className="text-lg leading-none">+</span>
          <span>{t("newChat") ?? "New Chat"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 md:p-3">
        {!hydrated ? (
          <p className="font-pixel pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
            {t("loadingChats")}
          </p>
        ) : preparedThreads.length === 0 ? (
          <p className="font-pixel pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
            {t("noChats")}
          </p>
        ) : (
          <div className="space-y-2">
            {preparedThreads.map(({ thread, displayTitle }) => {
              const isActive = thread.id === activeThreadId

              return (
                <div
                  key={thread.id}
                  className={cn(
                    "group relative overflow-hidden border transition-[border-color,background-color] duration-200",
                    isActive
                      ? "border-primary/38 bg-primary/[0.06]"
                      : "border-transparent bg-transparent hover:border-border/35 hover:bg-background/54",
                  )}
                >
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-px bg-primary"
                    />
                  ) : null}

                  <button
                    onClick={() => onSelectThread(thread.id)}
                    className="w-full px-4 py-2.5 pr-9 text-left"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <p
                      className={cn(
                        "truncate text-sm",
                        isActive ? "text-foreground" : "text-foreground/90",
                      )}
                    >
                      {displayTitle}
                    </p>
                    <p
                      className={cn(
                        "mt-1 font-pixel text-[9px] uppercase tracking-[0.14em]",
                        isActive ? "text-primary/72" : "text-muted-foreground/46",
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

      <div className="shrink-0 border-t border-border/35 px-3 py-2">
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
