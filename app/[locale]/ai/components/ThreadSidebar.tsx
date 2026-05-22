"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { AnimatePresence, motion } from "framer-motion"
import { Star } from "lucide-react"
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
          className="ai-lab-pixel-button w-full gap-2 bg-background px-3 py-2.5 text-[10px] text-foreground"
        >
          <span className="text-lg leading-none">+</span>
          <span>{t("newChat") ?? "New Chat"}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 md:p-3">
        {!hydrated ? (
          <p className="pt-6 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">
            {t("loadingChats")}
          </p>
        ) : preparedThreads.length === 0 ? (
          <p className="pt-6 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/50">
            {t("noChats")}
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
            {preparedThreads.map(({ thread, displayTitle }) => {
              const isActive = thread.id === activeThreadId

              return (
                <motion.div
                  layout
                  key={thread.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group relative border-2 transition-colors duration-200",
                    isActive
                      ? "ai-lab-pixel-button--active"
                      : "border-transparent hover:border-border hover:bg-accent/60",
                  )}
                  transition={{
                    layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.12 },
                  }}
                >

                  <button
                    onClick={() => onSelectThread(thread.id)}
                    className="w-full px-4 py-2.5 pr-9 text-left"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {thread.isStarred ? (
                        <Star className="h-3.5 w-3.5 shrink-0 fill-current text-amber-500" />
                      ) : null}
                      <p
                        className={cn(
                          "truncate text-sm",
                          isActive ? "text-foreground" : "text-foreground/90",
                        )}
                      >
                        {displayTitle}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-[9px] font-medium uppercase tracking-[0.14em]",
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
                    className="absolute right-2 top-1/2 inline-block -translate-y-1/2 px-2 py-1 text-base font-medium leading-none text-muted-foreground/40 transition-colors hover:bg-transparent hover:text-destructive md:hidden"
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
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 px-2 py-1 text-base font-medium leading-none text-muted-foreground/40 transition-colors hover:bg-transparent hover:text-destructive md:group-hover:inline-block"
                    aria-label={t("deleteChat") ?? "Delete chat"}
                    title={t("deleteChat") ?? "Delete chat"}
                  >
                    ×
                  </button>
                </motion.div>
              )
            })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border/35 px-3 py-2">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">
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
