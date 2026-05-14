"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, PencilLine, Star, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface ThreadTitleMenuProps {
  isStarred: boolean
  title: string
  onDelete: () => void
  onRename: (title: string) => void
  onToggleStar: () => void
}

export default function ThreadTitleMenu({
  isStarred,
  title,
  onDelete,
  onRename,
  onToggleStar,
}: ThreadTitleMenuProps) {
  const t = useTranslations("ai")
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)

  useEffect(() => {
    setDraftTitle(title)
    setIsOpen(false)
    setIsRenaming(false)
  }, [title])

  useEffect(() => {
    if (!isRenaming) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [isRenaming])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setIsRenaming(false)
        setDraftTitle(title)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return
      setIsOpen(false)
      setIsRenaming(false)
      setDraftTitle(title)
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleEscape)
    }
  }, [title])

  const commitRename = () => {
    const nextTitle = draftTitle.trim()
    if (!nextTitle) {
      setDraftTitle(title)
      setIsRenaming(false)
      return
    }

    if (nextTitle !== title) {
      onRename(nextTitle)
    }

    setIsRenaming(false)
  }

  if (isRenaming) {
    return (
      <div ref={rootRef} className="relative min-w-0">
        <div className="flex items-center gap-2 border-2 border-primary bg-background px-3 py-2">
          <input
            ref={inputRef}
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onBlur={commitRename}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                commitRename()
              }

              if (event.key === "Escape") {
                event.preventDefault()
                setDraftTitle(title)
                setIsRenaming(false)
              }
            }}
            className="min-w-[12rem] bg-transparent font-pixel text-[11px] uppercase tracking-[0.08em] text-foreground outline-none placeholder:text-muted-foreground/48"
            placeholder={t("renamePlaceholder")}
            aria-label={t("renameChat")}
          />
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "ai-lab-pixel-button max-w-full gap-2 px-3 py-2 text-left text-[10px]",
          isOpen ? "ai-lab-pixel-button--active text-foreground" : "",
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t("threadActions")}
      >
        {isStarred ? (
          <Star className="h-3.5 w-3.5 shrink-0 fill-current text-amber-500" />
        ) : null}
        <span className="truncate font-pixel text-[11px] uppercase tracking-[0.08em] text-foreground">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-40 mt-2 min-w-[220px] border-2 border-border bg-background p-2 shadow-[0_18px_42px_hsl(var(--background)/0.24)]"
          role="menu"
        >
          <button
            type="button"
            onClick={() => {
              onToggleStar()
              setIsOpen(false)
            }}
            className={cn(
              "ai-lab-pixel-menu-item text-[10px]",
              isStarred ? "ai-lab-pixel-button--active" : "",
            )}
            role="menuitem"
          >
            <Star className={cn("h-4 w-4", isStarred ? "fill-current text-amber-500" : "")} />
            <span className="text-[12px]">{isStarred ? t("unstarChat") : t("starChat")}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDraftTitle(title)
              setIsOpen(false)
              setIsRenaming(true)
            }}
            className="ai-lab-pixel-menu-item text-[10px]"
            role="menuitem"
          >
            <PencilLine className="h-4 w-4" />
            <span className="text-[12px]">{t("renameChat")}</span>
          </button>

          <div className="my-1 border-t-2 border-border/45" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onDelete()
            }}
            className="ai-lab-pixel-menu-item ai-lab-pixel-menu-item--danger text-[10px] text-destructive"
            role="menuitem"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-[12px]">{t("deleteChat")}</span>
          </button>
        </div>
      ) : null}
    </div>
  )
}
