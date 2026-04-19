"use client"
import React, { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ClientComponent } from "./ClientComponent"

interface Props {
  colorMode: string
  code: string
  className?: string
  compact?: boolean
  filename?: string
}

/**
 * CodeBlocker: adapts its shell style based on `data-style-mode` on <html>.
 *
 * - pixel mode → retro terminal: 2px hard border, zero radius, square pixel
 *   traffic lights (project signal tokens), filename label in pixel font.
 * - normal mode → original macOS-style: rounded-2xl, circle traffic lights,
 *   light/dark taskbar background.
 */
export const CodeBlocker = ({
  colorMode,
  code,
  className,
  compact = false,
  filename = "coder.ts",
}: Props) => {
  const isDark = colorMode === "dark"
  const [isPixel, setIsPixel] = useState(true)

  useEffect(() => {
    const sync = () => {
      const mode = document.documentElement.getAttribute("data-style-mode")
      setIsPixel(mode !== "normal")
    }
    sync()

    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-style-mode"],
    })
    return () => observer.disconnect()
  }, [])

  // ── Normal mode: original macOS style ──────────────────────────────────────
  if (!isPixel) {
    const taskbarBg = isDark ? "#2d2d2d" : "#f0f0f0"
    return (
      <div className={cn("overflow-auto rounded-2xl", className)}>
        <div
          className={cn(
            "codeblock-taskbar flex items-center py-2",
            compact ? "h-10 px-3.5" : "h-11 px-4 sm:px-3"
          )}
          style={{ background: taskbarBg }}
        >
          <span className="mr-2 h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="mr-2 h-3 w-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <ClientComponent lang="ts" colorMode={colorMode}>
          {code}
        </ClientComponent>
      </div>
    )
  }

  // ── Pixel mode: retro terminal ─────────────────────────────────────────────
  const taskbarBg = isDark ? "hsl(264 48% 10%)" : "hsl(215 30% 14%)"
  const bodyBg = isDark ? "hsl(265 55% 8%)" : "hsl(215 30% 10%)"

  return (
    <div className={cn("overflow-hidden border-2 border-border", className)}>
      {/* Taskbar */}
      <div
        className={cn(
          "flex items-center justify-between border-b-2 border-border",
          compact ? "h-9 px-3" : "h-11 px-4"
        )}
        style={{ background: taskbarBg }}
      >
        <span className="font-pixel select-none text-[9px] uppercase tracking-[0.22em] text-muted-foreground/70">
          {filename}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="block h-3 w-3" style={{ background: "hsl(var(--signal-rose))" }} />
          <span className="block h-3 w-3" style={{ background: "hsl(var(--signal-amber))" }} />
          <span className="block h-3 w-3" style={{ background: "hsl(var(--primary))" }} />
        </div>
      </div>

      {/* Code body */}
      <div style={{ background: bodyBg }}>
        <ClientComponent lang="ts" colorMode={colorMode}>
          {code}
        </ClientComponent>
      </div>
    </div>
  )
}
